import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { ChevronDown } from "lucide-react"

import transactionAPI from "../../api/transaction.api"
import categoryAPI from "../../api/category.api"

function AddTransactionForm({ transaction, onClose, refreshTransactions }) {

  const [note, setNote] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [date, setDate] = useState("")
  const [categories, setCategories] = useState([])

  useEffect(() => {

    fetchCategories()

    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")

    setDate(`${year}-${month}-${day}`)

    if (transaction) {

      setNote(transaction.note)
      setAmount(transaction.amount)
      setType(transaction.categoryId?.type || "")
      setCategoryId(transaction.categoryId?._id || "")
      setDate(formatDateForInput(transaction.date))

    }

  }, [transaction])

  const fetchCategories = async () => {

    try {

      const res = await categoryAPI.getAll()

      const data =
        Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : []

      setCategories(data)

    } catch (error) {

      console.error(error)
      toast.error("Không tải được danh mục")

    }

  }

  const filteredCategories =
    type === ""
      ? []
      : categories.filter((c) => c.type === type)

  const handleTypeChange = (value) => {
    setType(value)
    setCategoryId("")
  }

  const formatDateForInput = (date) => {

    if (!date) return ""

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) return ""

    return parsedDate.toISOString().split("T")[0]

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const payload = {
        amount: Number(amount),
        categoryId,
        date,
        note
      }

      if (transaction) {

        await transactionAPI.update(transaction._id, payload)
        toast.success("Cập nhật giao dịch thành công")

      } else {

        await transactionAPI.create(payload)
        toast.success("Thêm giao dịch thành công")

      }

      refreshTransactions()
      onClose()

    } catch (error) {

      console.error(error)
      toast.error("Thao tác thất bại")

    }

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* TYPE */}

      <div className="relative">

        <select
          className="border rounded-lg px-3 py-2 w-full appearance-none"
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
          required
        >

          <option value="">
            Chọn loại giao dịch
          </option>

          <option value="expense">
            Chi tiêu
          </option>

          <option value="income">
            Thu nhập
          </option>

        </select>

        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />

      </div>

      {/* CATEGORY */}

      <div className="relative">

        <select
          className="border rounded-lg px-3 py-2 w-full appearance-none"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={!type}
          required
        >

          <option value="">
            Chọn danh mục
          </option>

          {filteredCategories.map((c) => (

            <option key={c._id} value={c._id}>
              {c.name}
            </option>

          ))}

        </select>

        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />

      </div>

      {/* AMOUNT */}

      <input
        type="number"
        placeholder="Số tiền"
        className="border rounded-lg px-3 py-2 w-full"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      {/* DATE */}

      <input
        type="date"
        className="border rounded-lg px-3 py-2 w-full"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {/* NOTE */}

      <input
        type="text"
        placeholder="Ghi chú"
        className="border rounded-lg px-3 py-2 w-full"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {/* SUBMIT */}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        {transaction ? "Cập nhật giao dịch" : "Thêm giao dịch"}
      </button>

    </form>
  )
}

export default AddTransactionForm