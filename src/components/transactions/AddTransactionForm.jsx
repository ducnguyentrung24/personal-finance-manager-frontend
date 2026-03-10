import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import toast from "react-hot-toast"

import categoryAPI from "../../api/category.api"
import transactionAPI from "../../api/transaction.api"

function AddTransactionForm({ onClose, refreshTransactions }) {

  const today = new Date().toISOString().split("T")[0]

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: today
  })

  const [categories, setCategories] = useState([])

  useEffect(() => {

    const fetchCategories = async () => {

      try {

        const res = await categoryAPI.getAll()

        setCategories(res.data)

      } catch (error) {

        console.error("Fetch categories error:", error)

      }

    }

    fetchCategories()

  }, [])

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      await transactionAPI.create({
        title: form.title,
        amount: Number(form.amount),
        type: form.type,
        category: form.category,
        date: form.date
      })

      toast.success("Thêm giao dịch thành công")

      await refreshTransactions()

      onClose()

    } catch (error) {

      toast.error("Không thể thêm giao dịch")

    }

  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        type="text"
        name="title"
        placeholder="Tiêu đề"
        className="w-full border rounded-lg px-3 py-2"
        value={form.title}
        onChange={handleChange}
      />

      <input
        type="number"
        name="amount"
        placeholder="Số tiền"
        className="w-full border rounded-lg px-3 py-2"
        value={form.amount}
        onChange={handleChange}
      />

      <div className="relative">

        <select
          name="type"
          className="w-full border rounded-lg px-3 py-2 pr-10 appearance-none"
          value={form.type}
          onChange={handleChange}
        >
          <option value="expense">Chi tiêu</option>
          <option value="income">Thu nhập</option>
        </select>

        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        />

      </div>

      <div className="relative">

        <select
          name="category"
          className="w-full border rounded-lg px-3 py-2 pr-10 appearance-none"
          value={form.category}
          onChange={handleChange}
        >
          <option value="">Chọn danh mục</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}

        </select>

        <ChevronDown
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        />

      </div>

      <input
        type="date"
        name="date"
        className="w-full border rounded-lg px-3 py-2"
        value={form.date}
        onChange={handleChange}
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Thêm giao dịch
      </button>

    </form>
  )
}

export default AddTransactionForm