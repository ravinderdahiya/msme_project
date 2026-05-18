import http from "../api/axios"

export const getDataServices = async () => {
  const res = await http.get("/data-services")
  return res.data?.data || []
}

export const createDataService = async (payload) => {
  const res = await http.post("/data-services", payload)
  return res.data?.data
}

export const updateDataService = async (id, payload) => {
  const res = await http.put(`/data-services/${id}`, payload)
  return res.data?.data
}

export const deleteDataService = async (id) => {
  await http.delete(`/data-services/${id}`)
}

