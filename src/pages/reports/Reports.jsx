import { useEffect, useMemo, useState } from "react"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

import StatCard from "../../components/common/StatCard"
import reportAPI from "../../api/report.api"

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

      try {

        const [dashboardRes, monthlyRes] = await Promise.all([
          reportAPI.getDashboard(),
          reportAPI.getMonthly()
        ])

        const dashboardData = dashboardRes?.data?.data || dashboardRes?.data || {}
        const monthlyData = monthlyRes?.data?.data || monthlyRes?.data || []

        setDashboard({
          totalIncome: Number(dashboardData.totalIncome || 0),
          totalExpense: Number(dashboardData.totalExpense || 0),
          balance: Number(dashboardData.balance || 0)
        })

        setMonthly(Array.isArray(monthlyData) ? monthlyData : [])

        const topRes = await reportAPI.getTopExpenseCategories()
        const topData = topRes?.data?.data || topRes?.data || []
        setTopExpenseCategories(Array.isArray(topData) ? topData : [])

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

      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold">Reports</h1>

        <button
          onClick={handleExportExcel}
          disabled={exporting}
          className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-60"
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

      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="font-semibold mb-4">Thu nhập vs Chi tiêu theo tháng</h2>

        {loading ? (

          <div className="text-gray-500 py-10 text-center">Đang tải dữ liệu...</div>

        ) : monthly.length === 0 ? (

          <div className="text-gray-500 py-10 text-center">Chưa có dữ liệu báo cáo</div>

        ) : (

          <ResponsiveContainer width="100%" height={320}>

            <LineChart data={monthly} margin={{ top: 10, right: 24, left: 40, bottom: 0 }}>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => Number(value).toLocaleString("vi-VN")} />

              <Tooltip
                formatter={(value) => formatMoney(value)}
              />

              <Line type="monotone" dataKey="income" stroke="#16a34a" strokeWidth={3} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={3} name="Expense" />

            </LineChart>

          </ResponsiveContainer>

        )}

      </div>

      <div className="bg-white p-6 rounded-xl shadow">

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