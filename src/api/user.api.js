import axiosClient from "./axiosClient"

const userAPI = {

  getMe() {
    return axiosClient.get("/auth/me")
  },

  updateMe(data) {
    return axiosClient.patch("/auth/me", data)
  },

  getAll() {
    return axiosClient.get("/users")
  },

  create(data) {
    return axiosClient.post("/users", data)
  },

  update(id, data) {
    return axiosClient.patch(`/users/${id}`, data)
  },

  delete(id) {
    return axiosClient.delete(`/users/${id}`)
  },

  deleteMany(ids) {
    return axiosClient.delete("/users", { data: { ids } })
  },

  lock(id) {
    return axiosClient.patch(`/users/${id}/lock`)
  },

  unlock(id) {
    return axiosClient.patch(`/users/${id}/unlock`)
  }

}

export default userAPI