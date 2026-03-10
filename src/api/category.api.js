import axiosClient from "./axiosClient"

const categoryAPI = {

  getAll() {
    return axiosClient.get("/categories")
  }

}

export default categoryAPI