import { Trash2 } from "lucide-react"
import toast from "react-hot-toast"

import transactionAPI from "../../api/transaction.api"

function TransactionTable({ transactions, setTransactions }) {

  const formatMoney = (value) => {
    return value.toLocaleString("vi-VN") + " ₫"
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN")
  }

  const handleDelete = async (id) => {

    if (!confirm("Bạn có chắc muốn xóa giao dịch này?")) return

    try {

      await transactionAPI.delete(id)

      setTransactions(transactions.filter(t => t._id !== id))

      toast.success("Đã xóa giao dịch")

    } catch (error) {

      toast.error("Xóa giao dịch thất bại")

    }

  }

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
            <th>Hành động</th>
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

              <td>

                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}

export default TransactionTable