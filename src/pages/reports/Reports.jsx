import { useEffect, useMemo, useState } from "react"

import StatCard from "../../components/common/StatCard"
import reportAPI from "../../api/report.api"
import { getCache, setCache } from "../../utils/pageCache"

function Reports() {

  const [dashboard, setDashboard] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  })

  const [monthly, setMonthly] = useState([])
  const [topExpenseCategories, setTopExpenseCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("vi-VN") + " ₫"
  }

  useEffect(() => {

    const fetchReports = async () => {

      const cached = getCache("reports-summary")
      if (cached) {
        setDashboard(cached.dashboard)
        setMonthly(cached.monthly)
        setTopExpenseCategories(cached.topExpenseCategories)
        setLoading(false)
        return
      }

      try {

        const [dashboardRes, monthlyRes] = await Promise.all([
          reportAPI.getDashboard(),
          reportAPI.getMonthly()
        ])

        const dashboardData = dashboardRes?.data?.data || dashboardRes?.data || {}
        const monthlyData = monthlyRes?.data?.data || monthlyRes?.data || []

        const nextDashboard = {
          totalIncome: Number(dashboardData.totalIncome || 0),
          totalExpense: Number(dashboardData.totalExpense || 0),
          balance: Number(dashboardData.balance || 0)
        }

        const nextMonthly = Array.isArray(monthlyData) ? monthlyData : []

        const topRes = await reportAPI.getTopExpenseCategories()
        const topData = topRes?.data?.data || topRes?.data || []
        const nextTopExpenseCategories = Array.isArray(topData) ? topData : []

        setDashboard(nextDashboard)
        setMonthly(nextMonthly)
        setTopExpenseCategories(nextTopExpenseCategories)
        setCache("reports-summary", {
          dashboard: nextDashboard,
          monthly: nextMonthly,
          topExpenseCategories: nextTopExpenseCategories
        }, 5 * 60 * 1000)

        const dashboardCached = getCache("dashboard-data")
        if (dashboardCached) {
          setCache("dashboard-data", {
            ...dashboardCached,
            monthly: nextMonthly
          }, 5 * 60 * 1000)
        }

      } catch (error) {

        console.error("Fetch reports error:", error)
        setDashboard({ totalIncome: 0, totalExpense: 0, balance: 0 })
        setMonthly([])
        setTopExpenseCategories([])

      } finally {

        setLoading(false)

      }

    }

    fetchReports()

  }, [])

  const latestMonthSummary = useMemo(() => {

    if (monthly.length === 0) {
      return {
        month: "N/A",
        income: 0,
        expense: 0,
        saving: 0
      }
    }

    const latest = monthly[monthly.length - 1]
    const income = Number(latest.income || 0)
    const expense = Number(latest.expense || 0)

    return {
      month: latest.month || "N/A",
      income,
      expense,
      saving: income - expense
    }

  }, [monthly])

  const topExpenseTotal = useMemo(() => {
    return topExpenseCategories.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    )
  }, [topExpenseCategories])

  const handleExportExcel = async () => {

    try {

      setExporting(true)

      const response = await reportAPI.exportExcel()
      const blob = response?.data || response

      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "transactions_report.xlsx")

      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)

    } catch (error) {

      console.error("Export report error:", error)

    } finally {

      setExporting(false)

    }

  }

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-3">

        <h1 className="text-2xl font-bold">Reports</h1>

        <button
          onClick={handleExportExcel}
          disabled={exporting}
          className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-60 w-full sm:w-auto"
        >
          {exporting ? "Đang xuất..." : "Xuất Excel"}
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Tổng thu nhập"
          value={formatMoney(dashboard.totalIncome)}
          color="text-green-600"
        />

        <StatCard
          title="Tổng chi tiêu"
          value={formatMoney(dashboard.totalExpense)}
          color="text-red-600"
        />

        <StatCard
          title="Số dư"
          value={formatMoney(dashboard.balance)}
          color="text-blue-600"
        />

        <StatCard
          title={`Tiết kiệm tháng ${latestMonthSummary.month}`}
          value={formatMoney(latestMonthSummary.saving)}
          color="text-purple-600"
        />

      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">

        <h2 className="font-semibold mb-4">Phân tích theo tháng</h2>

        {loading ? (

          <div className="text-gray-500 py-10 text-center">Đang tải dữ liệu...</div>

        ) : monthly.length === 0 ? (

          <div className="text-gray-500 py-10 text-center">Chưa có dữ liệu báo cáo</div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">Tháng</th>
                  <th className="py-2 pr-4 text-green-700">Thu nhập</th>
                  <th className="py-2 pr-4 text-red-700">Chi tiêu</th>
                  <th className="py-2 pr-4 text-blue-700">Tiết kiệm</th>
                  <th className="py-2 pr-4">Tỷ lệ tiết kiệm</th>
                </tr>
              </thead>

              <tbody>

                {monthly.map((row) => {
                  const income = Number(row.income || 0)
                  const expense = Number(row.expense || 0)
                  const saving = income - expense
                  const savingRate = income > 0 ? (saving / income) * 100 : 0

                  return (
                    <tr key={row.month} className="border-b last:border-b-0">
                      <td className="py-2 pr-4 font-medium">{row.month}</td>
                      <td className="py-2 pr-4">{formatMoney(income)}</td>
                      <td className="py-2 pr-4">{formatMoney(expense)}</td>
                      <td className={`py-2 pr-4 ${saving >= 0 ? "text-blue-700" : "text-red-600"}`}>
                        {formatMoney(saving)}
                      </td>
                      <td className="py-2 pr-4">{savingRate.toFixed(1)}%</td>
                    </tr>
                  )
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">

        <h2 className="font-semibold mb-4">Top danh mục chi tiêu</h2>

        {topExpenseCategories.length === 0 ? (

          <div className="text-gray-500 py-4">Chưa có dữ liệu danh mục chi tiêu</div>

        ) : (

          <div className="space-y-3">

            {topExpenseCategories.map((item) => {

              const amount = Number(item.total || 0)
              const percent = topExpenseTotal > 0
                ? (amount / topExpenseTotal) * 100
                : 0

              return (
                <div key={item.category}>

                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{item.category}</span>
                    <span className="text-gray-600">{formatMoney(amount)}</span>
                  </div>

                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${Math.max(percent, 3)}%` }}
                    />
                  </div>

                </div>
              )

            })}

          </div>

        )}

      </div>

    </div>
  )
}

export default Reports