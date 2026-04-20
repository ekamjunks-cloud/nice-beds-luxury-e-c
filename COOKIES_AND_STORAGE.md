# Cookies and Local Storage Usage

## Overview

This application uses browser cookies and local storage (via the Spark KV API) to provide core functionality including:

- **User Authentication**: Storing user sessions and authentication tokens
- **Shopping Cart**: Persisting items in your cart between sessions
- **Wishlist**: Saving your favorite products
- **User Preferences**: Remembering your settings and preferences
- **Anonymous Data**: Temporary storage for cart/wishlist before login

## Why Cookies Are Required

The application uses the Spark runtime's KV (Key-Value) storage system which relies on browser cookies and IndexedDB/localStorage for data persistence. Without these technologies enabled:

- You cannot create an account or log in
- Your cart will not be saved between sessions
- Your wishlist will be lost when you close the browser
- Product customizations will not persist

## Browser Requirements

### Minimum Requirements
- **Cookies**: Must be enabled
- **Local Storage**: Must be enabled
- **JavaScript**: Must be enabled
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### How to Enable Cookies

#### Google Chrome
1. Click the three dots menu → Settings
2. Privacy and security → Cookies and other site data
3. Select "Allow all cookies" or add this site to allowed sites

#### Firefox
1. Click the menu button → Settings
2. Privacy & Security
3. Under Cookies and Site Data, ensure "Delete cookies and site data when Firefox is closed" is unchecked for this site

#### Safari
1. Safari → Preferences → Privacy
2. Uncheck "Block all cookies"

#### Microsoft Edge
1. Click the three dots menu → Settings
2. Cookies and site permissions → Cookies and site data
3. Turn off "Block third-party cookies"

## Privacy & Security

### What We Store
- **Authentication Data**: Hashed passwords (SHA-256), email addresses, names
- **Cart Data**: Product IDs, quantities, customizations
- **Session Tokens**: Temporary authentication tokens
- **User Preferences**: UI settings and preferences

### What We DON'T Store
- Credit card information
- Payment details
- Sensitive personal data beyond email/name
- Browsing history
- Third-party tracking data

### Security Measures
- All passwords are hashed using SHA-256 before storage
- Session tokens are randomly generated cryptographic strings
- No plain text passwords are ever stored
- Data is stored locally in your browser (not on external servers)
- User input is sanitized to prevent XSS attacks

## Troubleshooting

### "Storage is not available" Error
This means cookies or local storage are disabled. Follow the steps above to enable them.

### "Failed to set key" Error
This indicates the browser's storage quota may be exceeded or storage is blocked:
1. Clear browser cache and cookies for this site
2. Check if you're in Private/Incognito mode (some storage may be limited)
3. Ensure sufficient disk space is available
4. Try a different browser

### Cart/Wishlist Not Saving
1. Verify cookies are enabled
2. Check browser console for errors (F12 → Console tab)
3. Ensure you're not in Private/Incognito mode
4. Clear site data and try again

### Cannot Create Account
1. Verify all storage requirements are met
2. Check if an account with that email already exists
3. Ensure password meets requirements (8+ characters, uppercase, lowercase, numbers)
4. Check browser console for specific error messages

## Technical Details

### Storage Keys Used
- `current-user`: Active user session
- `user-email-{email}`: User account lookup by email
- `user-id-{id}`: User account lookup by ID
- `user-index`: List of all registered users
- `cart-{sessionId}`: Anonymous cart (before login)
- `cart-user-{userId}`: Authenticated user's cart
- `wishlist-{sessionId}`: Anonymous wishlist
- `wishlist-user-{userId}`: Authenticated user's wishlist

### Fallback Mechanism
The application includes a fallback system that attempts to use localStorage if the Spark KV API fails. However, full functionality requires the Spark KV API to work properly.

## Support

If you continue to experience issues after enabling cookies and local storage:
1. Try clearing all site data
2. Update your browser to the latest version
3. Test in a different browser
4. Check if browser extensions (ad blockers, privacy tools) are interfering
5. Contact support with browser console error logs
