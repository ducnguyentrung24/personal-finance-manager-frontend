import { useState } from "react"
import { Trash2, Pencil } from "lucide-react"
import toast from "react-hot-toast"
import transactionAPI from "../../api/transaction.api"
import ConfirmModal from "../common/ConfirmModal"

function TransactionTable({ transactions, setTransactions, onEdit }) {

  const [deleteId, setDeleteId] = useState(null)

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

  const confirmDelete = (id) => {
    setDeleteId(id)
  }

  const handleDelete = async () => {

    try {

      await transactionAPI.delete(deleteId)

      setTransactions(prev =>
        prev.filter(t => t._id !== deleteId)
      )

      toast.success("Đã xóa giao dịch")

    } catch (error) {

      console.error(error)
      toast.error("Xóa giao dịch thất bại")

    }

    setDeleteId(null)

  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">

      <h2 className="font-semibold text-lg mb-4">
        Giao dịch
      </h2>

      {transactions.length === 0 && (

        <div className="text-center py-12 text-gray-500">

          <p className="text-lg">
            Chưa có giao dịch
          </p>

          <p className="text-sm mt-2">
            Hãy thêm giao dịch đầu tiên của bạn
          </p>

        </div>

      )}

      {transactions.length > 0 && (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 border-b text-sm text-gray-600">

              <tr>

                <th className="text-left py-3 px-6">
                  Danh mục
                </th>

                <th className="text-left py-3 px-6">
                  Type
                </th>

                <th className="text-right py-3 px-10">
                  Số tiền
                </th>

                <th className="text-left py-3 px-10">
                  Ngày/Tháng/Năm
                </th>

                <th className="text-left py-3 px-6">
                  Ghi chú
                </th>

                <th className="text-center py-3 px-6">
                  Hành động
                </th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {transactions.map((t) => (

                <tr
                  key={t._id}
                  className="hover:bg-gray-50 transition"
                >

                  <td className="py-4 px-6 font-medium text-gray-800">
                    {t.categoryId?.name || "N/A"}
                  </td>

                  <td
                    className={`py-4 px-6 font-medium ${
                      t.categoryId?.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {t.categoryId?.type === "income"
                      ? "Income"
                      : "Expense"}
                  </td>

                  <td
                    className={`py-4 px-10 text-right font-semibold ${
                      t.categoryId?.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatMoney(t.amount, t.categoryId?.type)}
                  </td>

                  <td className="py-4 px-10 text-gray-600">
                    {formatDate(t.date)}
                  </td>

                  <td className="py-4 px-6">
                    {t.note || "-"}
                  </td>

                  <td className="py-4 px-6">

                    <div className="flex justify-center gap-3">

                      <button
                        onClick={() => onEdit(t)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => confirmDelete(t._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Xóa giao dịch"
        message="Bạn có chắc muốn xóa giao dịch này?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />

    </div>
  )
}

export default TransactionTable