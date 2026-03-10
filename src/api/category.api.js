import axiosClient from "./axiosClient"

const categoryAPI = {

  getAll() {
    return axiosClient.get("/categories")
  },

  create(data) {
    return axiosClient.post("/categories", data)
  },

  update(id, data) {
    return axiosClient.patch(`/categories/${id}`, data)
  },

  delete(id) {
    return axiosClient.delete(`/categories/${id}`)
  }

}

export default categoryAPI