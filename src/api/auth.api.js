import axiosClient from "./axiosClient"

const authAPI = {

  login(data) {
    return axiosClient.post("/auth/login", data)
  },

  register(data) {
    return axiosClient.post("/auth/register", data)
  },

  changePassword(data) {
    return axiosClient.patch("/auth/change-password", data)
  }

}

export default authAPI