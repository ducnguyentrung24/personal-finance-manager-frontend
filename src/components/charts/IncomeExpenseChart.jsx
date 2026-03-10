import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

const data = [
  { month: "Jan", income: 5000000, expense: 2000000 },
  { month: "Feb", income: 6000000, expense: 2500000 },
  { month: "Mar", income: 5500000, expense: 3000000 },
  { month: "Apr", income: 7000000, expense: 3500000 },
  { month: "May", income: 6500000, expense: 3200000 },
]

function IncomeExpenseChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="font-semibold mb-4">
        Thu nhập vs Chi tiêu
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#16a34a"
            strokeWidth={3}
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#dc2626"
            strokeWidth={3}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  )
}

export default IncomeExpenseChart