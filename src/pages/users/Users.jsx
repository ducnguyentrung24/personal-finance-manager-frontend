import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { Lock, LockOpen, Trash2 } from "lucide-react"

import userAPI from "../../api/user.api"
import ConfirmModal from "../../components/common/ConfirmModal"
import Modal from "../../components/common/Modal"
import { getCache, setCache } from "../../utils/pageCache"

function Users() {

  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(true)

  const [deletingUser, setDeletingUser] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isActive: true
  })

  const fetchUsers = async (options = {}) => {
    const { showLoading = true } = options

    try {

      if (showLoading) {
        setLoading(true)
      }

      const cached = getCache("users-list")
      if (cached) {
        setUsers(cached)
        return
      }

      const res = await userAPI.getAll()
      const data = res?.data || res

      const nextUsers = Array.isArray(data) ? data : []
      setUsers(nextUsers)
      setCache("users-list", nextUsers, 5 * 60 * 1000)

    } catch (error) {

      console.error("Fetch users error:", error)
      toast.error("Không tải được danh sách user")
      setUsers([])

    } finally {

      if (showLoading) {
        setLoading(false)
      }

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

  const handleDeleteUser = async () => {

    if (!deletingUser?._id) return

    try {

      await userAPI.delete(deletingUser._id)
      toast.success("Xóa user thành công")
      setDeletingUser(null)
      setSelectedIds((prev) => prev.filter((id) => id !== deletingUser._id))
      setUsers((prev) => {
        const next = prev.filter((user) => user._id !== deletingUser._id)
        setCache("users-list", next, 5 * 60 * 1000)
        return next
      })

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
      setUsers((prev) => {
        const next = prev.filter((user) => !selectedIds.includes(user._id))
        setCache("users-list", next, 5 * 60 * 1000)
        return next
      })
      setSelectedIds([])

    } catch (error) {

      console.error("Delete many users error:", error)
      toast.error(error?.response?.data?.message || "Xóa user hàng loạt thất bại")

    }

  }

  const handleToggleLock = async (user) => {

    try {

      const updated = user.isActive
        ? await userAPI.lock(user._id)
        : await userAPI.unlock(user._id)

      const updatedUser = updated?.data || updated

      if (user.isActive) {
        toast.success("Đã khóa user")
      } else {
        toast.success("Đã mở khóa user")
      }

      if (updatedUser?._id) {
        setUsers((prev) => {
          const next = prev.map((item) => (item._id === updatedUser._id ? updatedUser : item))
          setCache("users-list", next, 5 * 60 * 1000)
          return next
        })
      } else {
        fetchUsers({ showLoading: false })
      }

    } catch (error) {

      console.error("Toggle lock user error:", error)
      toast.error(error?.response?.data?.message || "Thao tác khóa/mở khóa thất bại")

    }

  }

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "user",
      isActive: true
    })
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()

    try {

      setCreating(true)

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        isActive: form.isActive
      }

      const res = await userAPI.create(payload)
      const created = res?.data || res

      if (created?._id) {
        setUsers((prev) => {
          const next = [created, ...prev]
          setCache("users-list", next, 5 * 60 * 1000)
          return next
        })
      } else {
        fetchUsers({ showLoading: false })
      }

      toast.success("Thêm user thành công")
      setIsCreateOpen(false)
      resetForm()

    } catch (error) {

      console.error("Create user error:", error)
      toast.error(error?.response?.data?.message || "Thêm user thất bại")

    } finally {

      setCreating(false)

    }
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <h1 className="text-2xl font-bold">Users Management</h1>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Thêm user
          </button>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
          >
            Xóa đã chọn ({selectedIds.length})
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

      <ConfirmModal
        isOpen={Boolean(deletingUser)}
        title="Xóa user"
        message={`Bạn có chắc muốn xóa user "${deletingUser?.name || ""}"?`}
        onCancel={() => setDeletingUser(null)}
        onConfirm={handleDeleteUser}
      />

      <Modal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false)
          resetForm()
        }}
        title="Thêm user mới"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
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
            placeholder="Mật khẩu"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />

          <select
            className="border rounded-lg px-3 py-2 w-full"
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <select
            className="border rounded-lg px-3 py-2 w-full"
            value={form.isActive ? "active" : "locked"}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, isActive: e.target.value === "active" }))
            }
          >
            <option value="active">Active</option>
            <option value="locked">Locked</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCreateOpen(false)
                resetForm()
              }}
              className="px-4 py-2 rounded-lg bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
            >
              {creating ? "Đang tạo..." : "Tạo user"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  )
}

export default Users