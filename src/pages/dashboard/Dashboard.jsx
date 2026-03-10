import { useEffect, useState } from "react"

import StatCard from "../../components/common/StatCard"
import IncomeExpenseChart from "../../components/charts/IncomeExpenseChart"

import reportAPI from "../../api/report.api"

function Dashboard() {

  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    savings: 0
  })

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("vi-VN") + " ₫"
  }

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const [dashboardRes, monthlyRes] = await Promise.all([
          reportAPI.getDashboard(),
          reportAPI.getMonthly()
        ])

        const data = dashboardRes.data || dashboardRes
        const monthlyData = monthlyRes.data || monthlyRes

        const totalIncome = Number(data.totalIncome || 0)
        const totalExpense = Number(data.totalExpense || 0)
        const balance = Number(
          data.balance ?? data.totalBalance ?? (totalIncome - totalExpense)
        )

        const latestMonth = Array.isArray(monthlyData) && monthlyData.length > 0
          ? monthlyData[monthlyData.length - 1]
          : null

        const monthlySavings = latestMonth
          ? Number(latestMonth.income || 0) - Number(latestMonth.expense || 0)
          : 0

        setStats({
          totalBalance: balance,
          totalIncome,
          totalExpense,
          savings: monthlySavings
        })

      } catch (error) {

        console.error("Dashboard error:", error)

      }

    }

    fetchDashboard()

  }, [])

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      {/* STAT CARDS */}

      <div className="grid grid-cols-4 gap-6">

        <StatCard
          title="Tổng số dư"
          value={formatMoney(stats.totalBalance)}
          color="text-blue-600"
        />

        <StatCard
          title="Thu nhập"
          value={formatMoney(stats.totalIncome)}
          color="text-green-600"
        />

        <StatCard
          title="Chi tiêu"
          value={formatMoney(stats.totalExpense)}
          color="text-red-600"
        />

        <StatCard
          title="Tiết kiệm (tháng)"
          value={formatMoney(stats.savings)}
          color="text-purple-600"
        />

      </div>

      {/* CHART */}

      <IncomeExpenseChart />

    </div>
  )
}

export default Dashboard