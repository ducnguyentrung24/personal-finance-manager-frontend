import axiosClient from "./axiosClient"

const transactionAPI = {

  getAll() {
    return axiosClient.get("/transactions")
  },

  create(data) {
    return axiosClient.post("/transactions", data)
  },

  update(id, data) {
    return axiosClient.patch(`/transactions/${id}`, data)
  },

  delete(id) {
    return axiosClient.delete(`/transactions/${id}`)
  }

}

export default transactionAPI