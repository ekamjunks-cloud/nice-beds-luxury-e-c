import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { X, Cookie } from '@phosphor-icons/react'
import { StorageHelper } from '@/lib/storage'

export function StorageWarning() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('storage-warning-dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    const checkStorage = () => {
      const result = StorageHelper.checkStorageAvailability()
      setIsVisible(!result.available)
    }

    checkStorage()
    const interval = setInterval(checkStorage, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    sessionStorage.setItem('storage-warning-dismissed', 'true')
  }

  if (!isVisible || isDismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] p-4">
      <Alert className="bg-destructive text-destructive-foreground border-destructive shadow-lg max-w-3xl mx-auto">
        <div className="flex items-start gap-3">
          <Cookie size={24} weight="fill" className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <AlertDescription className="text-sm">
              <strong className="font-semibold block mb-1">Cookies and Local Storage Required</strong>
              This website requires cookies and local storage to function properly. Features like user accounts, shopping cart, and wishlist will not work without them.{' '}
              <a href="/COOKIES_AND_STORAGE.md" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                Learn how to enable them
              </a>
            </AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="flex-shrink-0 hover:bg-destructive-foreground/10 -mt-1 -mr-1"
          >
            <X size={18} />
          </Button>
        </div>
      </Alert>
    </div>
  )
}
