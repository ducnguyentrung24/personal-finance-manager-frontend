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
  const [loading, setLoading] = useState(true)

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

      } catch (error) {

        console.error("Fetch reports error:", error)
        setDashboard({ totalIncome: 0, totalExpense: 0, balance: 0 })
        setMonthly([])

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

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold">Reports</h1>

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

    </div>
  )
}

export default Reports