import axiosClient from "./axiosClient"

const reportAPI = {

  getDashboard() {
    return axiosClient.get("/reports/dashboard")
  },

  getMonthly() {
    return axiosClient.get("/reports/monthly")
  }

}

export default reportAPI