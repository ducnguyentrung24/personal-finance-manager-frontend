import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

import categoryAPI from "../../api/category.api"
import transactionAPI from "../../api/transaction.api"

function AddTransactionForm({ onClose }) {

  const today = new Date().toISOString().split("T")[0]

  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    date: today
  })

  const [categories, setCategories] = useState([])

  // Load categories from backend
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

      onClose()

      // reload table
      window.location.reload()

    } catch (error) {
      console.error("Create transaction error:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* TITLE */}

      <input
        type="text"
        name="title"
        placeholder="Tiêu đề"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.title}
        onChange={handleChange}
      />

      {/* AMOUNT */}

      <input
        type="number"
        name="amount"
        placeholder="Số tiền"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.amount}
        onChange={handleChange}
      />

      {/* TYPE */}

      <div className="relative">

        <select
          name="type"
          className="w-full border rounded-lg px-3 py-2 pr-10 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* CATEGORY */}

      <div className="relative">

        <select
          name="category"
          className="w-full border rounded-lg px-3 py-2 pr-10 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* DATE */}

      <input
        type="date"
        name="date"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={form.date}
        onChange={handleChange}
      />

      {/* BUTTON */}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Thêm giao dịch
      </button>

    </form>
  )
}

export default AddTransactionForm