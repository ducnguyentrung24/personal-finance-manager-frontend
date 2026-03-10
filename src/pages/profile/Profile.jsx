import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

function Profile() {

  const { user } = useContext(AuthContext)

  if (!user) return <p>Loading...</p>

  return (
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

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Đổi mật khẩu
          </button>

          <button className="px-4 py-2 border rounded-lg hover:bg-gray-100">
            Chỉnh sửa thông tin
          </button>

        </div>

      </div>

    </div>
  )
}

export default Profile