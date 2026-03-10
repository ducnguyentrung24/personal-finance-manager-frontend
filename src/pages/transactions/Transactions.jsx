import { useEffect, useState } from "react"

import TransactionTable from "../../components/transactions/TransactionTable"
import Modal from "../../components/common/Modal"
import AddTransactionForm from "../../components/transactions/AddTransactionForm"

import transactionAPI from "../../api/transaction.api"

function Transactions() {

  const [open, setOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [search, setSearch] = useState("")

  const fetchTransactions = async () => {

    try {

      const res = await transactionAPI.getAll()

      setTransactions(res.data)

    } catch (error) {

      console.error(error)

    }

  }

  useEffect(() => {

    fetchTransactions()

  }, [])

  const filteredTransactions = transactions.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

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

      <input
        type="text"
        placeholder="Tìm giao dịch..."
        className="border rounded-lg px-3 py-2 w-100"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TransactionTable
        transactions={filteredTransactions}
        setTransactions={setTransactions}
      />

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