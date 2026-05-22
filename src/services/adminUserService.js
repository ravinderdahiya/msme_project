import http from "../api/axios"

export const getAdminUsers = async ({ page = 1, limit = 10, search = "", role = "All", status = "All" } = {}) => {
  const res = await http.get("/user/admin/users", {
    params: {
      page,
      limit,
      search,
      role,
      status
    }
  })

  return res.data || {}
}

export const updateAdminUserStatus = async (id, payload) => {
  const res = await http.patch(`/user/admin/users/${id}/status`, payload)
  return res.data || {}
}

export const getAdminUserSessions = async (id, { page = 1, limit = 20 } = {}) => {
  const res = await http.get(`/user/admin/users/${id}/sessions`, {
    params: {
      page,
      limit
    }
  })

  return res.data || {}
}
