import { useEffect, useState } from "react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

import reportAPI from "../../api/report.api"
import { getCache, setCache } from "../../utils/pageCache"

function IncomeExpenseChart() {

  const [data, setData] = useState([])

  const formatMoney = (value) => {
    return value.toLocaleString("vi-VN") + " ₫"
  }

  useEffect(() => {

    const fetchMonthly = async () => {

      const cached = getCache("dashboard-data")
      if (cached?.monthly) {
        const formatted = cached.monthly.map((item) => ({
          month: item.month,
          income: Number(item.income || 0),
          expense: Number(item.expense || 0)
        }))
        setData(formatted)
        return
      }

      try {

        const res = await reportAPI.getMonthly()

        const formatted = (res.data || []).map((item) => ({
          month: item.month,
          income: Number(item.income || 0),
          expense: Number(item.expense || 0)
        }))

        setData(formatted)

      } catch (error) {

        console.error("Chart error:", error)

      }

    }

    fetchMonthly()

  }, [])

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="font-semibold mb-4">
        Income vs Expense
      </h2>

      {data.length === 0 ? (

        <div className="text-center text-gray-500 py-10">
          Chưa có dữ liệu để hiển thị
        </div>

      ) : (

        <ResponsiveContainer width="100%" height={300}>

          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 50,
              bottom: 0
            }}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis
              domain={[0, "auto"]}
              tickFormatter={(value) =>
                value.toLocaleString("vi-VN")
              }
            />

            <Tooltip
              formatter={(value) => formatMoney(value)}
            />

            <Line
              type="monotone"
              dataKey="income"
              stroke="#16a34a"
              strokeWidth={3}
              name="Income"
            />

            <Line
              type="monotone"
              dataKey="expense"
              stroke="#dc2626"
              strokeWidth={3}
              name="Expense"
            />

          </LineChart>

        </ResponsiveContainer>

      )}

    </div>
  )
}

export default IncomeExpenseChart