import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import {
  ArrowRight,
  CheckCircle2,
  LineChart,
  LockKeyhole,
  Mail,
  Sparkles,
  Wallet
} from "lucide-react"

import authAPI from "../../api/auth.api"
import { AuthContext } from "../../context/AuthContext"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const { fetchUser } = useContext(AuthContext)

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const res = await authAPI.login({
        email,
        password
      })

      const { token } = res.data

      localStorage.setItem("token", token)
      await fetchUser()

      toast.success("Đăng nhập thành công")

      navigate("/")

    } catch (error) {

      console.error(error)

      const status = error?.response?.status

      if (status === 403) {
        toast.error("Tài khoản này đã bị khóa, vui lòng liên hệ quản trị viên để được hỗ trợ")
      } else {
        toast.error("Email hoặc mật khẩu không đúng")
      }

    }

  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-white">

      <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-purple-500/30 blur-3xl rounded-full" />
      <div className="absolute top-24 right-1/2 w-56 h-56 bg-emerald-500/20 blur-3xl rounded-full" />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2 gap-10">

        <div className="hidden lg:flex flex-col justify-center px-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200 mb-6">
            <Sparkles size={14} />
            Personal Finance Manager
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Quản lý tài chính <span className="text-cyan-300">thông minh</span>,
            đơn giản và trực quan.
          </h1>
          <p className="text-slate-300 max-w-lg mb-8">
            Theo dõi thu chi, kiểm soát ngân sách và xây dựng thói quen tài chính bền vững trong một nền tảng duy nhất.
          </p>

          <div className="space-y-4 text-slate-200">
            {[
              "Cảnh báo chi tiêu vượt ngân sách theo thời gian thực.",
              "Báo cáo dòng tiền trực quan theo từng tháng.",
              "Bảo mật dữ liệu với chuẩn mã hóa hiện đại."
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-emerald-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Wallet className="text-cyan-300 mb-3" />
              <p className="text-sm text-slate-300">Ví thông minh</p>
              <p className="text-lg font-semibold">+24% tiết kiệm</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <LineChart className="text-purple-300 mb-3" />
              <p className="text-sm text-slate-300">Biểu đồ chi tiêu</p>
              <p className="text-lg font-semibold">Tự động cập nhật</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <CheckCircle2 className="text-emerald-300 mb-3" />
              <p className="text-sm text-slate-300">Quy tắc 50/30/20</p>
              <p className="text-lg font-semibold">Gợi ý tối ưu</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-cyan-500/40 via-purple-500/30 to-emerald-500/40 blur-xl" />
            <form
              onSubmit={handleSubmit}
              className="relative w-full rounded-[32px] border border-white/10 bg-white/10 backdrop-blur-2xl p-8 shadow-2xl"
            >
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.2em] text-cyan-200">Chào mừng trở lại</p>
                <h2 className="text-3xl font-semibold mt-2">Đăng nhập tài khoản</h2>
                <p className="text-slate-300 mt-2">Đăng nhập để tiếp tục quản lý tài chính mỗi ngày.</p>
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
              <div className="mb-6 flex items-center gap-2 rounded-2xl border border-white/20 bg-black/20 px-4">
                <LockKeyhole size={18} className="text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 text-slate-900 font-semibold py-3 hover:bg-cyan-300 transition"
              >
                Đăng nhập
                <ArrowRight size={18} />
              </button>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p className="font-semibold text-white mb-1">Mẹo hôm nay ✨</p>
                Hãy ghi nhận mọi khoản chi nhỏ để nhìn rõ bức tranh tài chính của bạn.
              </div>

              <p className="text-center text-slate-300 mt-6 text-sm">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="text-cyan-300 hover:text-cyan-200 font-semibold">
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Login