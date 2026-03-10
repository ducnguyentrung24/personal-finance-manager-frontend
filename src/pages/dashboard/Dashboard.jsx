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
    return value.toLocaleString("vi-VN") + " ₫"
  }

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        const res = await reportAPI.getDashboard()

        setStats(res.data)

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
          title="Tiết kiệm"
          value={formatMoney(stats.savings)}
          color="text-purple-600"
        />

      </div>

      <IncomeExpenseChart />

    </div>
  )
}

export default Dashboard