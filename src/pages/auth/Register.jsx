import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  LockKeyhole,
  Mail,
  Sparkles,
  User
} from "lucide-react"

import authAPI from "../../api/auth.api"

function Register() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      if (password !== confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp")
        return
      }

      const res = await authAPI.register({
        name,
        email,
        password
      })

      toast.success("Đăng ký thành công, vui lòng đăng nhập")

      navigate("/login")

    } catch (error) {

      console.error(error)

      const status = error?.response?.status
      const message = error?.response?.data?.message

      if (status === 400 && message?.toLowerCase().includes("email")) {
        toast.error("Email đã được sử dụng, vui lòng chọn email khác")
      } else {
        toast.error("Không thể đăng ký, vui lòng kiểm tra lại thông tin")
      }

    }

  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white">

      <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-500/30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-cyan-500/30 blur-3xl rounded-full" />
      <div className="absolute top-24 left-1/2 w-56 h-56 bg-emerald-500/20 blur-3xl rounded-full" />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2 gap-10">

        <div className="flex items-center justify-center p-6 order-2 lg:order-1">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-purple-500/40 via-cyan-500/30 to-emerald-500/40 blur-xl" />
            <form
              onSubmit={handleSubmit}
              className="relative w-full rounded-[32px] border border-white/10 bg-white/10 backdrop-blur-2xl p-8 shadow-2xl"
            >
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.2em] text-purple-200">Bắt đầu hành trình</p>
                <h2 className="text-3xl font-semibold mt-2">Tạo tài khoản mới</h2>
                <p className="text-slate-300 mt-2">Thiết lập hồ sơ tài chính và cá nhân hóa mục tiêu của bạn.</p>
              </div>

              <label className="block text-sm text-slate-300 mb-2">Họ và tên</label>
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/20 bg-black/20 px-4">
                <User size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full bg-transparent py-3 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <label className="block text-sm text-slate-300 mb-2">Email</label>
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/20 bg-black/20 px-4">
                <Mail size={18} className="text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-transparent py-3 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <label className="block text-sm text-slate-300 mb-2">Mật khẩu</label>
              <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/20 bg-black/20 px-4">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full bg-transparent py-3 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <label className="block text-sm text-slate-300 mb-2">Xác nhận mật khẩu</label>
              <div className="mb-6 flex items-center gap-2 rounded-2xl border border-white/20 bg-black/20 px-4">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="w-full bg-transparent py-3 outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-400 text-slate-900 font-semibold py-3 hover:bg-purple-300 transition"
              >
                Đăng ký miễn phí
                <ArrowRight size={18} />
              </button>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white mb-1">Bảo mật nâng cao 🔒</p>
                Tài khoản của bạn được bảo vệ bằng xác thực an toàn và lưu trữ mã hóa.
              </div>

              <p className="text-center text-slate-300 mt-6 text-sm">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-purple-200 hover:text-purple-100 font-semibold">
                  Đăng nhập ngay
                </Link>
              </p>
            </form>
          </div>
        </div>

        <div className="hidden lg:flex flex-col justify-center px-16 order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-purple-200 mb-6">
            <Sparkles size={14} />
            Personal Finance Manager
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Nắm quyền <span className="text-purple-300">kiểm soát</span> dòng tiền
            ngay hôm nay.
          </h1>
          <p className="text-slate-300 max-w-lg mb-8">
            Thiết lập mục tiêu, theo dõi ngân sách và nhận đề xuất thông minh giúp bạn luôn chủ động với tài chính.
          </p>

          <div className="space-y-4 text-slate-200">
            {[
              "Tạo mục tiêu tiết kiệm rõ ràng và bám sát kế hoạch.",
              "Theo dõi thu chi theo danh mục cá nhân hóa.",
              "Nhận báo cáo tự động và nhắc nhở định kỳ."
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <BadgeCheck size={20} className="text-purple-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Banknote className="text-emerald-300 mb-3" />
              <p className="text-sm text-slate-300">Chi tiêu tối ưu</p>
              <p className="text-lg font-semibold">Tự động phân bổ</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <BadgeCheck className="text-purple-300 mb-3" />
              <p className="text-sm text-slate-300">Mục tiêu rõ ràng</p>
              <p className="text-lg font-semibold">Theo dõi tiến độ</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Register