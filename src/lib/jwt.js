// lib/jwtUtils.js
export function decodeToken(token) {
  if (!token) return null

  try {
    // JWT token has 3 parts: header.payload.signature
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

export function isTokenExpired(token) {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true

  // Convert expiration time to milliseconds and compare with current time
  return Date.now() >= decoded.exp * 1000
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  
  if (!token || isTokenExpired(token)) {
    // Clear expired token
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return null
  }

  return userStr ? JSON.parse(userStr) : null
}