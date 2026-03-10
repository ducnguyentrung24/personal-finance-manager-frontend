import axiosClient from "./axiosClient"

const authAPI = {

  login(data) {
    return axiosClient.post("/auth/login", data)
  },

  register(data) {
    return axiosClient.post("/auth/register", data)
  }

}

export default authAPI