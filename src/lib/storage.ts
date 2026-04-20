export class StorageHelper {
  private static testStorage(): boolean {
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  private static isStorageAvailable = StorageHelper.testStorage()

  static async safeKVSet<T>(key: string, value: T): Promise<void> {
    try {
      await window.spark.kv.set(key, value)
    } catch (error) {
      console.error(`Failed to set KV key "${key}":`, error)
      
      if (StorageHelper.isStorageAvailable) {
        try {
          localStorage.setItem(`kv_fallback_${key}`, JSON.stringify(value))
        } catch (fallbackError) {
          console.error(`Fallback storage also failed for "${key}":`, fallbackError)
          throw new Error('Storage is not available. Please enable cookies and local storage.')
        }
      } else {
        throw new Error('Storage is not available. Please enable cookies and local storage.')
      }
    }
  }

  static async safeKVGet<T>(key: string): Promise<T | undefined> {
    try {
      return await window.spark.kv.get<T>(key)
    } catch (error) {
      console.error(`Failed to get KV key "${key}":`, error)
      
      if (StorageHelper.isStorageAvailable) {
        try {
          const fallbackValue = localStorage.getItem(`kv_fallback_${key}`)
          return fallbackValue ? JSON.parse(fallbackValue) : undefined
        } catch (fallbackError) {
          console.error(`Fallback storage read also failed for "${key}":`, fallbackError)
          return undefined
        }
      }
      return undefined
    }
  }

  static async safeKVDelete(key: string): Promise<void> {
    try {
      await window.spark.kv.delete(key)
    } catch (error) {
      console.error(`Failed to delete KV key "${key}":`, error)
    }
    
    if (StorageHelper.isStorageAvailable) {
      try {
        localStorage.removeItem(`kv_fallback_${key}`)
      } catch (fallbackError) {
        console.error(`Fallback storage delete also failed for "${key}":`, fallbackError)
      }
    }
  }

  static async safeKVKeys(): Promise<string[]> {
    try {
      return await window.spark.kv.keys()
    } catch (error) {
      console.error('Failed to get KV keys:', error)
      
      if (StorageHelper.isStorageAvailable) {
        try {
          const keys: string[] = []
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key?.startsWith('kv_fallback_')) {
              keys.push(key.replace('kv_fallback_', ''))
            }
          }
          return keys
        } catch (fallbackError) {
          console.error('Fallback storage keys also failed:', fallbackError)
          return []
        }
      }
      return []
    }
  }

  static checkStorageAvailability(): { available: boolean; message?: string } {
    if (!StorageHelper.isStorageAvailable) {
      return {
        available: false,
        message: 'Browser storage is disabled. Please enable cookies and local storage to use this feature.'
      }
    }

    try {
      if (typeof window.spark === 'undefined' || typeof window.spark.kv === 'undefined') {
        return {
          available: false,
          message: 'Spark runtime is not available. Please refresh the page.'
        }
      }
    } catch {
      return {
        available: false,
        message: 'Unable to access storage. Please check your browser settings.'
      }
    }

    return { available: true }
  }
}
