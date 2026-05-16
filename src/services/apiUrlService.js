import http from "../api/axios"

export const getApiUrls = async () => {
  const res = await http.get("/api-url")
  return res.data?.data || []
}

export const createApiUrl = async (payload) => {
  const res = await http.post("/api-url", payload)
  return res.data?.data
}

export const updateApiUrl = async (id, payload) => {
  const res = await http.put(`/api-url/${id}`, payload)
  return res.data?.data
}

export const deleteApiUrl = async (id) => {
  await http.delete(`/api-url/${id}`)
}

export const getFrontendRuntimeConfig = async () => {
  const res = await http.get("/api-url/frontend-config")
  return res.data || {}
}
