import { useContext, useState } from "react"
import toast from "react-hot-toast"

import { AuthContext } from "../../context/AuthContext"
import authAPI from "../../api/auth.api"
import Modal from "../../components/common/Modal"

function Profile() {

  const { user } = useContext(AuthContext)

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })

  if (!user) return <p>Loading...</p>

  const handleChangePassword = async (e) => {

    e.preventDefault()

    const { oldPassword, newPassword, confirmNewPassword } = passwordForm

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự")
      return
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Xác nhận mật khẩu không khớp")
      return
    }

    try {

      await authAPI.changePassword({ oldPassword, newPassword })
      toast.success("Đổi mật khẩu thành công")

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      })
      setIsChangePasswordOpen(false)

    } catch (error) {

      console.error("Change password error:", error)
      toast.error(error?.response?.data?.message || "Đổi mật khẩu thất bại")

    }

  }

  return (
    <>
      <div className="max-w-3xl">

      <h1 className="text-2xl font-bold mb-6">
        Tài khoản của tôi
      </h1>

      <div className="bg-white rounded-xl shadow">

        {/* HEADER */}
        <div className="flex items-center gap-6 p-6 border-b">

          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="text-lg font-semibold">
              {user.name}
            </p>

            <p className="text-gray-500">
              {user.email}
            </p>
          </div>

        </div>

        {/* INFO */}
        <div className="p-6 grid grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Tên
            </p>

            <p className="font-medium">
              {user.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-medium">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Role
            </p>

            <p className="font-medium capitalize">
              {user.role}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Ngày tạo
            </p>

            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="border-t p-6 flex gap-4">

          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Đổi mật khẩu
          </button>

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Chỉnh sửa thông tin
          </button>

        </div>

      </div>

      </div>

      <Modal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        title="Đổi mật khẩu"
      >

      <form onSubmit={handleChangePassword} className="space-y-4">

        <input
          type="password"
          placeholder="Mật khẩu cũ"
          className="border rounded-lg px-3 py-2 w-full"
          value={passwordForm.oldPassword}
          onChange={(e) => setPasswordForm((prev) => ({
            ...prev,
            oldPassword: e.target.value
          }))}
          required
        />

        <input
          type="password"
          placeholder="Mật khẩu mới"
          className="border rounded-lg px-3 py-2 w-full"
          value={passwordForm.newPassword}
          onChange={(e) => setPasswordForm((prev) => ({
            ...prev,
            newPassword: e.target.value
          }))}
          required
        />

        <input
          type="password"
          placeholder="Xác nhận mật khẩu mới"
          className="border rounded-lg px-3 py-2 w-full"
          value={passwordForm.confirmNewPassword}
          onChange={(e) => setPasswordForm((prev) => ({
            ...prev,
            confirmNewPassword: e.target.value
          }))}
          required
        />

        <div className="flex justify-end gap-2">

          <button
            type="button"
            onClick={() => setIsChangePasswordOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-100"
          >
            Hủy
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Lưu mật khẩu
          </button>

        </div>

      </form>

      </Modal>

    </>

  )
}

export default Profile