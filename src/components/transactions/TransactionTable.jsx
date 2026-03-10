import { useEffect, useState } from "react"
import transactionAPI from "../../api/transaction.api"

function TransactionTable() {

  const [transactions, setTransactions] = useState([])

  const formatMoney = (value) => {
    return value.toLocaleString("vi-VN") + " ₫"
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN")
  }

  useEffect(() => {

    const fetchTransactions = async () => {
      try {
        const res = await transactionAPI.getAll()
        setTransactions(res.data)
      } catch (error) {
        console.error("Fetch transactions error:", error)
      }
    }

    fetchTransactions()

  }, [])

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="font-semibold mb-4">
        Giao dịch
      </h2>

      <table className="w-full text-left">

        <thead className="border-b bg-gray-50">
          <tr>
            <th className="py-3">Tiêu đề</th>
            <th>Danh mục</th>
            <th>Số tiền</th>
            <th>Ngày</th>
          </tr>
        </thead>

        <tbody>

          {transactions.map((t) => (
            <tr key={t._id} className="border-b hover:bg-gray-50">

              <td className="py-3 font-medium">
                {t.title}
              </td>

              <td>
                {t.category?.name || "N/A"}
              </td>

              <td
                className={
                  t.type === "income"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {formatMoney(t.amount)}
              </td>

              <td>
                {formatDate(t.date)}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}

export default TransactionTable