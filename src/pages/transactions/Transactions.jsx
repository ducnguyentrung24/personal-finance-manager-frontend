import TransactionTable from "../../components/transactions/TransactionTable"

function Transactions() {
  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Transactions
      </h1>

      <TransactionTable />

    </div>
  )
}

export default Transactions