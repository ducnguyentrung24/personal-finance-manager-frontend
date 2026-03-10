import StatCard from "../../components/common/StatCard"
import IncomeExpenseChart from "../../components/charts/IncomeExpenseChart"

function Dashboard() {

  const formatMoney = (value) => {
    return value.toLocaleString("vi-VN") + " ₫"
  }

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">

        <StatCard
          title="Tổng số dư"
          value={formatMoney(12450000)}
          color="text-blue-600"
        />

        <StatCard
          title="Thu nhập"
          value={formatMoney(8200000)}
          color="text-green-600"
        />

        <StatCard
          title="Chi tiêu"
          value={formatMoney(3400000)}
          color="text-red-600"
        />

        <StatCard
          title="Tiết kiệm"
          value={formatMoney(1850000)}
          color="text-purple-600"
        />

      </div>

      <IncomeExpenseChart />

    </div>
  )
}

export default Dashboard