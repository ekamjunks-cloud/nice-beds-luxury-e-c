# Cart and Wishlist Persistence Fix

## Problem
Cart and wishlist data were being shared across all users on the public domain because they used global storage keys (`'cart'` and `'wishlist'`). This meant:
- Multiple visitors would see and modify the same cart
- Cart/wishlist items would appear/disappear as different users added/removed items
- Privacy issues with users seeing each other's selections

## Solution
Implemented **user-specific and session-based storage keys**:

### 1. **Anonymous Users** (Not Logged In)
- Each browser session gets a unique session ID stored in `sessionStorage`
- Cart key: `cart-${sessionId}` (e.g., `cart-session-1234567890-abc123`)
- Wishlist key: `wishlist-${sessionId}` (e.g., `wishlist-session-1234567890-abc123`)
- Data persists within the same browser session

### 2. **Authenticated Users** (Logged In)
- Use the user's unique ID for storage
- Cart key: `cart-user-${userId}` (e.g., `cart-user-user-1234567890-xyz789`)
- Wishlist key: `wishlist-user-${userId}` (e.g., `wishlist-user-user-1234567890-xyz789`)
- Data persists across sessions and devices for the same user account

### 3. **Data Migration on Login/Signup**
When a user logs in or signs up:
- Their anonymous cart and wishlist are automatically merged with their user account data
- Duplicate items are combined (quantities added for cart items)
- Anonymous data is cleaned up after migration
- Users don't lose items they added before logging in

## Files Modified

### 1. `/src/hooks/use-cart.ts`
- Added `getSessionId()` helper function
- Cart key is now dynamic based on auth state
- Uses `useAuth()` hook to determine current user

### 2. `/src/hooks/use-wishlist.ts`
- Added `getSessionId()` helper function
- Wishlist key is now dynamic based on auth state
- Uses `useAuth()` hook to determine current user

### 3. `/src/hooks/use-auth.ts`
- Added `migrateAnonymousData()` function
- Called during both `login()` and `signup()`
- Merges anonymous cart/wishlist with user account data
- Cleans up anonymous storage after migration

## Testing Checklist

### Anonymous User Flow
- [ ] Open app in incognito/private window
- [ ] Add items to cart
- [ ] Add items to wishlist
- [ ] Refresh page - items should persist
- [ ] Open another incognito window - should see empty cart/wishlist (different session)

### Authenticated User Flow
- [ ] Login to account
- [ ] Add items to cart and wishlist
- [ ] Logout and login again - items should persist
- [ ] Login from different browser/device - items should be there

### Migration Flow
- [ ] As anonymous user, add items to cart and wishlist
- [ ] Sign up for new account - items should migrate to account
- [ ] Logout and login - items should still be there
- [ ] Add more items
- [ ] Logout, create new anonymous session with items, login - new items should merge

### Multi-User Testing
- [ ] Open two different browsers/incognito windows
- [ ] Add different items in each
- [ ] Verify carts are completely separate
- [ ] Create accounts in both - verify data remains separate

## Technical Details

### Session ID Generation
```typescript
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('spark-session-id')
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('spark-session-id', sessionId)
  }
  return sessionId
}
```

### Cart Merging Logic
When merging carts during login/signup:
- If same product with same color and customization exists → add quantities
- If product doesn't exist → add to cart
- Preserves all customization and color selections

### Wishlist Merging Logic
When merging wishlists during login/signup:
- If product already in wishlist → skip (no duplicates)
- If product doesn't exist → add to wishlist
- Preserves customization details

## Benefits

1. **Privacy**: Each user/session has isolated data
2. **Persistence**: Logged-in users keep their carts across devices
3. **Seamless UX**: Anonymous users don't lose items when signing up
4. **Scalability**: Ready for multi-user production environment
5. **Data Integrity**: Proper merging prevents data loss or duplication
