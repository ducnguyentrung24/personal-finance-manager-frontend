function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </h2>

    </div>
  )
}

export default StatCard