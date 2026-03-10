import { useEffect, useState } from "react"

import TransactionTable from "../../components/transactions/TransactionTable"
import Modal from "../../components/common/Modal"
import AddTransactionForm from "../../components/transactions/AddTransactionForm"

import transactionAPI from "../../api/transaction.api"

function Transactions() {

  const [open, setOpen] = useState(false)
  const [transactions, setTransactions] = useState([])

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

      <TransactionTable
        transactions={transactions}
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