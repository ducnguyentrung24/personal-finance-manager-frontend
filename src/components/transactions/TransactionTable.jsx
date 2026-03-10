function TransactionTable() {

  const transactions = [
    {
      id: 1,
      title: "Lương",
      category: "Salary",
      amount: 10000000,
      type: "income",
      date: "2026-03-01"
    },
    {
      id: 2,
      title: "Ăn uống",
      category: "Food",
      amount: 200000,
      type: "expense",
      date: "2026-03-02"
    },
    {
      id: 3,
      title: "Mua sách",
      category: "Education",
      amount: 150000,
      type: "expense",
      date: "2026-03-03"
    }
  ]

  const formatMoney = (value) => {
    return value.toLocaleString("vi-VN") + " ₫"
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN")
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="font-semibold mb-4">
        Giao dịch gần đây
      </h2>

      <table className="w-full text-left">

        <thead className="border-b bg-gray-50">
          <tr>
            <th className="py-3">Tiêu đề</th>
            <th>Danh mục</th>
            <th>Số tiền</th>
            <th>Ngày</th>
          </tr>
        </thead>

        <tbody>

          {transactions.map((t) => (
            <tr
              key={t.id}
              className="border-b hover:bg-gray-50 transition"
            >

              <td className="py-3 font-medium">
                {t.title}
              </td>

              <td>
                {t.category}
              </td>

              <td
                className={
                  t.type === "income"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {formatMoney(t.amount)}
              </td>

              <td>
                {formatDate(t.date)}
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}

export default TransactionTable