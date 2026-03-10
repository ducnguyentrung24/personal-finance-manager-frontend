import axiosClient from "./axiosClient"

const userAPI = {

  getMe() {
    return axiosClient.get("/auth/me")
  }

}

export default userAPI