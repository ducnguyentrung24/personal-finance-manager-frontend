import { Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import transactionAPI from "../../api/transaction.api"

function TransactionTable({ transactions, setTransactions }) {

  const formatMoney = (value, type) => {

    const money = Number(value).toLocaleString("vi-VN") + " ₫"

    return type === "income"
      ? `+ ${money}`
      : `- ${money}`
  }

  const formatDate = (date) => {

    if (!date) return ""

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return ""

    return parsedDate.toLocaleDateString("vi-VN")
  }

  const handleDelete = async (id) => {

    if (!window.confirm("Bạn có chắc muốn xóa giao dịch này?")) return

    try {

      await transactionAPI.delete(id)

      setTransactions((prev) =>
        prev.filter((t) => t._id !== id)
      )

      toast.success("Đã xóa giao dịch")

    } catch (error) {

      console.error(error)
      toast.error("Xóa giao dịch thất bại")

    }

  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="font-semibold mb-4">
        Giao dịch
      </h2>

      {transactions.length === 0 && (

        <div className="text-center py-10 text-gray-500">

          <p className="text-lg">
            📭 Chưa có giao dịch
          </p>

          <p className="text-sm mt-2">
            Hãy thêm giao dịch đầu tiên của bạn
          </p>

        </div>

      )}

      {transactions.length > 0 && (

        <table className="w-full text-left">

          <thead className="border-b bg-gray-50">
            <tr>
              <th className="py-3">Ghi chú</th>
              <th>Danh mục</th>
              <th className="text-right">Số tiền</th>
              <th>Ngày</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>

            {transactions.map((t) => (

              <tr key={t._id} className="border-b hover:bg-gray-50">

                <td className="py-3 font-medium">
                  {t.note || "-"}
                </td>

                <td>
                  {t.categoryId?.name || "N/A"}
                </td>

                <td
                  className={`text-right font-semibold ${
                    t.categoryId?.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatMoney(t.amount, t.categoryId?.type)}
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

      )}

    </div>
  )
}

export default TransactionTable