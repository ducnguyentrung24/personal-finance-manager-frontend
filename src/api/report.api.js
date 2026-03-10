import axiosClient from "./axiosClient"

const reportAPI = {

  getDashboard() {
    return axiosClient.get("/reports/dashboard")
  },

  getMonthly() {
    return axiosClient.get("/reports/monthly")
  },

  getTopExpenseCategories() {
    return axiosClient.get("/reports/top-expense-categories")
  },

  exportExcel() {
    return axiosClient.get("/reports/export-excel", {
      responseType: "blob"
    })
  }

}

export default reportAPI