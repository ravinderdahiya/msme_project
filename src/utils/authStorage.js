const TOKEN_KEY = "token"
const USER_KEY = "user"

export const getToken = () => {
  if (typeof window === "undefined") return ""
  return localStorage.getItem(TOKEN_KEY) || ""
}

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const setAuthSession = ({ token, user }) => {
  if (typeof window === "undefined") return
  if (token) localStorage.setItem(TOKEN_KEY, token)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearAuthSession = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
