import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { Lock, LockOpen, Pencil, Plus, Trash2 } from "lucide-react"

import userAPI from "../../api/user.api"
import Modal from "../../components/common/Modal"
import ConfirmModal from "../../components/common/ConfirmModal"

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "user"
}

function Users() {

  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const [deletingUser, setDeletingUser] = useState(null)

  const fetchUsers = async () => {

    try {

      setLoading(true)

      const res = await userAPI.getAll()
      const data = res?.data || res

      setUsers(Array.isArray(data) ? data : [])

    } catch (error) {

      console.error("Fetch users error:", error)
      toast.error("Không tải được danh sách user")
      setUsers([])

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {

    const q = search.trim().toLowerCase()

    if (!q) return users

    return users.filter((u) =>
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    )

  }, [users, search])

  const allFilteredSelected = filteredUsers.length > 0 &&
    filteredUsers.every((u) => selectedIds.includes(u._id))

  const toggleSelectAllFiltered = () => {

    if (allFilteredSelected) {
      const filteredIdSet = new Set(filteredUsers.map((u) => u._id))
      setSelectedIds((prev) => prev.filter((id) => !filteredIdSet.has(id)))
      return
    }

    setSelectedIds((prev) => {
      const set = new Set(prev)
      filteredUsers.forEach((u) => set.add(u._id))
      return [...set]
    })

  }

  const toggleUserSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const openCreateModal = () => {
    setEditingUser(null)
    setForm(EMPTY_FORM)
    setIsModalOpen(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "user"
    })
    setIsModalOpen(true)
  }

  const handleSaveUser = async (e) => {

    e.preventDefault()

    try {

      if (editingUser?._id) {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role
        }

        if (form.password.trim()) {
          payload.password = form.password.trim()
        }

        await userAPI.update(editingUser._id, payload)
        toast.success("Cập nhật user thành công")
      } else {
        await userAPI.create({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          role: form.role
        })
        toast.success("Tạo user thành công")
      }

      setIsModalOpen(false)
      setEditingUser(null)
      setForm(EMPTY_FORM)
      fetchUsers()

    } catch (error) {

      console.error("Save user error:", error)
      toast.error(error?.response?.data?.message || "Lưu user thất bại")

    }

  }

  const handleDeleteUser = async () => {

    if (!deletingUser?._id) return

    try {

      await userAPI.delete(deletingUser._id)
      toast.success("Xóa user thành công")
      setDeletingUser(null)
      setSelectedIds((prev) => prev.filter((id) => id !== deletingUser._id))
      fetchUsers()

    } catch (error) {

      console.error("Delete user error:", error)
      toast.error(error?.response?.data?.message || "Xóa user thất bại")

    }

  }

  const handleDeleteSelected = async () => {

    if (selectedIds.length === 0) return

    try {

      await userAPI.deleteMany(selectedIds)
      toast.success("Xóa các user đã chọn thành công")
      setSelectedIds([])
      fetchUsers()

    } catch (error) {

      console.error("Delete many users error:", error)
      toast.error(error?.response?.data?.message || "Xóa user hàng loạt thất bại")

    }

  }

  const handleToggleLock = async (user) => {

    try {

      if (user.isActive) {
        await userAPI.lock(user._id)
        toast.success("Đã khóa user")
      } else {
        await userAPI.unlock(user._id)
        toast.success("Đã mở khóa user")
      }

      fetchUsers()

    } catch (error) {

      console.error("Toggle lock user error:", error)
      toast.error(error?.response?.data?.message || "Thao tác khóa/mở khóa thất bại")

    }

  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between gap-4">

        <h1 className="text-2xl font-bold">Users Management</h1>

        <div className="flex items-center gap-2">

          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
          >
            Xóa đã chọn ({selectedIds.length})
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            <Plus size={18} />
            Thêm user
          </button>

        </div>

      </div>

      <input
        type="text"
        placeholder="Tìm theo tên hoặc email..."
        className="border rounded-lg px-3 py-2 bg-white w-full md:w-96"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">

        {loading ? (

          <div className="py-10 text-center text-gray-500">Đang tải danh sách user...</div>

        ) : filteredUsers.length === 0 ? (

          <div className="py-10 text-center text-gray-500">Không có user phù hợp</div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAllFiltered}
                    />
                  </th>
                  <th className="p-3">Tên</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Ngày tạo</th>
                  <th className="p-3">Hành động</th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                      />
                    </td>
                    <td className="p-3 font-medium">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {user.isActive ? "Active" : "Locked"}
                      </span>
                    </td>
                    <td className="p-3">{new Date(user.createdAt).toLocaleDateString("vi-VN")}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">

                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                          title="Sửa"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleToggleLock(user)}
                          className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-700"
                          title={user.isActive ? "Khóa" : "Mở khóa"}
                        >
                          {user.isActive ? <Lock size={16} /> : <LockOpen size={16} />}
                        </button>

                        <button
                          onClick={() => setDeletingUser(user)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Chỉnh sửa user" : "Thêm user mới"}
      >

        <form onSubmit={handleSaveUser} className="space-y-4">

          <input
            type="text"
            placeholder="Tên"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />

          <input
            type="password"
            placeholder={editingUser ? "Mật khẩu mới (không bắt buộc)" : "Mật khẩu"}
            className="border rounded-lg px-3 py-2 w-full"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required={!editingUser}
          />

          <select
            className="border rounded-lg px-3 py-2 w-full"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
            required
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
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
              {editingUser ? "Lưu" : "Tạo"}
            </button>

          </div>

        </form>

      </Modal>

      <ConfirmModal
        isOpen={Boolean(deletingUser)}
        title="Xóa user"
        message={`Bạn có chắc muốn xóa user "${deletingUser?.name || ""}"?`}
        onCancel={() => setDeletingUser(null)}
        onConfirm={handleDeleteUser}
      />

    </div>
  )
}

export default Users