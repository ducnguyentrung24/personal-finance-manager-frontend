import axiosClient from "./axiosClient"

const userAPI = {

  getMe() {
    return axiosClient.get("/auth/me")
  },

  updateMe(data) {
    return axiosClient.patch("/auth/me", data)
  }

}

export default userAPI