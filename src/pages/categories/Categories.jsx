import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { Plus, Pencil, Trash2 } from "lucide-react"

import categoryAPI from "../../api/category.api"
import Modal from "../../components/common/Modal"
import ConfirmModal from "../../components/common/ConfirmModal"
import { getCache, setCache } from "../../utils/pageCache"

const EMPTY_FORM = {
  name: "",
  type: "expense"
}

function Categories() {

  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const [deletingCategory, setDeletingCategory] = useState(null)

  const fetchCategories = async (options = {}) => {
    const { showLoading = true } = options

    try {

      const cached = getCache("categories-list")
      if (cached) {
        setCategories(cached)
        return
      }

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
      setCache("categories-list", data, 5 * 60 * 1000)

    } catch (error) {

      console.error("Fetch categories error:", error)
      toast.error("Không tải được danh mục")
      setCategories([])

    }

  }

  useEffect(() => {

    fetchCategories()

  }, [])

  const filteredCategories = useMemo(() => {

    return categories
      .filter((c) => {
        if (filter === "all") return true
        return c.type === filter
      })
      .filter((c) =>
        (c.name || "").toLowerCase().includes(search.toLowerCase())
      )

  }, [categories, filter, search])

  const stats = useMemo(() => {

    const incomeCount = categories.filter((c) => c.type === "income").length
    const expenseCount = categories.filter((c) => c.type === "expense").length

    return {
      incomeCount,
      expenseCount
    }

  }, [categories])

  const incomeCategories = useMemo(() => {
    if (filter !== "all") return []
    return filteredCategories.filter((c) => c.type === "income")
  }, [filteredCategories, filter])

  const expenseCategories = useMemo(() => {
    if (filter !== "all") return []
    return filteredCategories.filter((c) => c.type === "expense")
  }, [filteredCategories, filter])

  const openCreateModal = () => {
    setEditingCategory(null)
    setForm(EMPTY_FORM)
    setIsModalOpen(true)
  }

  const openEditModal = (category) => {
    setEditingCategory(category)
    setForm({
      name: category.name || "",
      type: category.type || "expense"
    })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      let savedCategory = null

      if (editingCategory?._id) {
        const res = await categoryAPI.update(editingCategory._id, form)
        savedCategory = res?.data || res
        toast.success("Cập nhật danh mục thành công")
      } else {
        const res = await categoryAPI.create(form)
        savedCategory = res?.data || res
        toast.success("Thêm danh mục thành công")
      }

      if (savedCategory?._id) {
        setCategories((prev) => {
          const exists = prev.some((c) => c._id === savedCategory._id)
          const next = exists
            ? prev.map((c) => (c._id === savedCategory._id ? savedCategory : c))
            : [savedCategory, ...prev]
          setCache("categories-list", next, 5 * 60 * 1000)
          return next
        })
      } else {
        fetchCategories({ showLoading: false })
      }

      setIsModalOpen(false)
      setEditingCategory(null)
      setForm(EMPTY_FORM)

    } catch (error) {

      console.error("Save category error:", error)
      toast.error("Lưu danh mục thất bại")

    }

  }

  const handleDelete = async () => {

    if (!deletingCategory?._id) return

    try {

      await categoryAPI.delete(deletingCategory._id)
      toast.success("Xóa danh mục thành công")
      setDeletingCategory(null)
      setCategories((prev) => {
        const next = prev.filter((c) => c._id !== deletingCategory._id)
        setCache("categories-list", next, 5 * 60 * 1000)
        return next
      })

    } catch (error) {

      console.error("Delete category error:", error)
      toast.error("Xóa danh mục thất bại")

    }

  }

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Categories
        </h1>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Thêm danh mục
        </button>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Danh mục thu nhập</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.incomeCount}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Danh mục chi tiêu</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.expenseCount}</p>
        </div>

      </div>

      <div className="flex items-center justify-between gap-4">

        <input
          type="text"
          placeholder="Tìm danh mục..."
          className="border rounded-lg px-3 py-2 w-96 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-2">

          {[
            { key: "all", label: "Tất cả" },
            { key: "income", label: "Thu nhập" },
            { key: "expense", label: "Chi tiêu" }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-3 py-1 rounded-lg ${
                filter === item.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100"
              }`}
            >
              {item.label}
            </button>
          ))}

        </div>

      </div>

      {filter === "all" ? (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Thu nhập</h2>

            {incomeCategories.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
                Chưa có danh mục thu nhập
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomeCategories.map((category) => (
                  <div key={category._id} className="bg-white rounded-xl shadow p-4 border border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{category.name}</h3>
                        <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          {category.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                          title="Sửa"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(category)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Chi tiêu</h2>

            {expenseCategories.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
                Chưa có danh mục chi tiêu
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expenseCategories.map((category) => (
                  <div key={category._id} className="bg-white rounded-xl shadow p-4 border border-gray-100">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{category.name}</h3>
                        <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                          {category.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                          title="Sửa"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(category)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      ) : filteredCategories.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
          <p className="text-lg">📂 Chưa có danh mục phù hợp</p>
          <p className="text-sm mt-2">Hãy thêm danh mục đầu tiên của bạn</p>
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {filteredCategories.map((category) => (

            <div key={category._id} className="bg-white rounded-xl shadow p-4 border border-gray-100">

              <div className="flex items-start justify-between gap-3">

                <div>
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                      category.type === "income"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {category.type}
                  </span>
                </div>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() => openEditModal(category)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    title="Sửa"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => setDeletingCategory(category)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                    title="Xóa"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
      >

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Tên danh mục"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />

          <select
            className="border rounded-lg px-3 py-2 w-full"
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
            required
          >
            <option value="expense">Chi tiêu</option>
            <option value="income">Thu nhập</option>
          </select>

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-gray-100"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              {editingCategory ? "Lưu" : "Thêm"}
            </button>

          </div>

        </form>

      </Modal>

      <ConfirmModal
        isOpen={Boolean(deletingCategory)}
        title="Xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${deletingCategory?.name || ""}"?`}
        onCancel={() => setDeletingCategory(null)}
        onConfirm={handleDelete}
      />

    </div>
  )
}

export default Categories