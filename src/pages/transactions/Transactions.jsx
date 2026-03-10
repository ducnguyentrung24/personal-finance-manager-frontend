import { useEffect, useState } from "react"

import TransactionTable from "../../components/transactions/TransactionTable"
import Modal from "../../components/common/Modal"
import AddTransactionForm from "../../components/transactions/AddTransactionForm"

import transactionAPI from "../../api/transaction.api"

function Transactions() {

  const [open, setOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const fetchTransactions = async () => {

    try {

      const res = await transactionAPI.getAll()

      setTransactions(res.data)

    } catch (error) {

      console.error("Fetch transactions error:", error)

    }

  }

  useEffect(() => {

    fetchTransactions()

  }, [])

  const filteredTransactions = transactions
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) => {
      if (filter === "all") return true
      return t.type === filter
    })

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Transactions
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Thêm giao dịch
        </button>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Tìm giao dịch..."
        className="border rounded-lg px-3 py-2 w-96"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER */}

      <div className="flex gap-2">

        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-lg ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("income")}
          className={`px-3 py-1 rounded-lg ${
            filter === "income"
              ? "bg-green-600 text-white"
              : "bg-gray-100"
          }`}
        >
          Income
        </button>

        <button
          onClick={() => setFilter("expense")}
          className={`px-3 py-1 rounded-lg ${
            filter === "expense"
              ? "bg-red-600 text-white"
              : "bg-gray-100"
          }`}
        >
          Expense
        </button>

      </div>

      {/* TABLE */}

      <TransactionTable
        transactions={filteredTransactions}
        setTransactions={setTransactions}
      />

      {/* MODAL */}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Thêm giao dịch"
      >
        <AddTransactionForm
          onClose={() => setOpen(false)}
          refreshTransactions={fetchTransactions}
        />
      </Modal>

    </div>
  )
}

export default Transactions