import { useContext, useState } from "react"
import toast from "react-hot-toast"

import { AuthContext } from "../../context/AuthContext"
import authAPI from "../../api/auth.api"
import userAPI from "../../api/user.api"
import Modal from "../../components/common/Modal"

function Profile() {

  const { user, setUser } = useContext(AuthContext)

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })

  const [profileForm, setProfileForm] = useState({
    name: ""
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

  const openEditProfileModal = () => {
    setProfileForm({
      name: user?.name || ""
    })
    setIsEditProfileOpen(true)
  }

  const handleUpdateProfile = async (e) => {

    e.preventDefault()

    if (!profileForm.name.trim()) {
      toast.error("Tên không được để trống")
      return
    }

    if (profileForm.name.trim().length < 2) {
      toast.error("Tên phải có ít nhất 2 ký tự")
      return
    }

    try {

      const res = await userAPI.updateMe({
        name: profileForm.name.trim()
      })

      const updatedUser = res?.data?.data || res?.data || res
      setUser(updatedUser)

      toast.success("Cập nhật thông tin thành công")
      setIsEditProfileOpen(false)

    } catch (error) {

      console.error("Update profile error:", error)
      toast.error(error?.response?.data?.message || "Cập nhật thông tin thất bại")

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 border-b">

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
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

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
        <div className="border-t p-4 sm:p-6 flex flex-wrap gap-3">

          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Đổi mật khẩu
          </button>

          <button
            onClick={openEditProfileModal}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
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

      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Chỉnh sửa thông tin cá nhân"
      >

        <form onSubmit={handleUpdateProfile} className="space-y-4">

          <input
            type="text"
            placeholder="Họ và tên"
            className="border rounded-lg px-3 py-2 w-full"
            value={profileForm.name}
            onChange={(e) => setProfileForm({ name: e.target.value })}
            required
          />

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="px-4 py-2 rounded-lg bg-gray-100"
            >
              Hủy
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              Lưu thông tin
            </button>

          </div>

        </form>

      </Modal>

    </>

  )
}

export default Profile