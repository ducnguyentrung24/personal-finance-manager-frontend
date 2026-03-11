import { useEffect, useState } from "react"

import TransactionTable from "../../components/transactions/TransactionTable"
import Modal from "../../components/common/Modal"
import AddTransactionForm from "../../components/transactions/AddTransactionForm"

import transactionAPI from "../../api/transaction.api"
import { getCache, setCache } from "../../utils/pageCache"

function Transactions() {

  const [open, setOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [editingTransaction, setEditingTransaction] = useState(null)

  const fetchTransactions = async () => {

    try {

      const cached = getCache("transactions-list")
      if (cached) {
        setTransactions(cached)
        return
      }

      const res = await transactionAPI.getAll()

      const data =
        Array.isArray(res?.data?.transactions)
          ? res.data.transactions
          : Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : []

      setTransactions(data)
      setCache("transactions-list", data, 5 * 60 * 1000)

    } catch (error) {

      console.error("Fetch transactions error:", error)
      setTransactions([])

    }

  }

  useEffect(() => {

    fetchTransactions()

  }, [])

  const handleTransactionSaved = (savedTransaction) => {

    if (!savedTransaction?._id) {
      fetchTransactions()
      return
    }

    setTransactions((prev) => {
      const exists = prev.some((t) => t._id === savedTransaction._id)
      if (exists) {
        const next = prev.map((t) => (t._id === savedTransaction._id ? savedTransaction : t))
        setCache("transactions-list", next, 5 * 60 * 1000)
        return next
      }
      const next = [savedTransaction, ...prev]
      setCache("transactions-list", next, 5 * 60 * 1000)
      return next
    })

  }

  const filteredTransactions = (transactions || [])
    .filter((t) =>
      (t.note || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) => {
      if (filter === "all") return true
      return t.categoryId?.type === filter
    })

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Transactions
        </h1>

        <button
          onClick={() => {
            setEditingTransaction(null)
            setOpen(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Thêm giao dịch
        </button>

      </div>

      <input
        type="text"
        placeholder="Tìm giao dịch..."
        className="border rounded-lg px-3 py-2 w-96"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-2">

        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-lg ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100"
          }`}
        >
          Tất cả
        </button>

        <button
          onClick={() => setFilter("income")}
          className={`px-3 py-1 rounded-lg ${
            filter === "income"
              ? "bg-green-600 text-white"
              : "bg-gray-100"
          }`}
        >
          Thu nhập
        </button>

        <button
          onClick={() => setFilter("expense")}
          className={`px-3 py-1 rounded-lg ${
            filter === "expense"
              ? "bg-red-600 text-white"
              : "bg-gray-100"
          }`}
        >
          Chi tiêu
        </button>

      </div>

      <TransactionTable
        transactions={filteredTransactions}
        setTransactions={setTransactions}
        onEdit={(t) => {
          setEditingTransaction(t)
          setOpen(true)
        }}
      />

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={
          editingTransaction
            ? "Chỉnh sửa giao dịch"
            : "Thêm giao dịch"
        }
      >
        <AddTransactionForm
          transaction={editingTransaction}
          onClose={() => setOpen(false)}
          refreshTransactions={fetchTransactions}
          onSaved={handleTransactionSaved}
        />
      </Modal>

    </div>
  )
}

export default Transactions