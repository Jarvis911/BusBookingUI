"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { register } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()

  const [username, setUsername] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password1, setPassword1] = React.useState("")
  const [password2, setPassword2] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setFieldErrors({})

    // Client-side validation
    if (password1 !== password2) {
      setError("Mật khẩu nhập lại không khớp")
      setLoading(false)
      return
    }

    if (password1.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự")
      setLoading(false)
      return
    }

    try {
      await register(username, email, password1, password2)
      // Registration successful, redirect to home
      router.push("/")
    } catch (err: any) {
      console.error("Registration failed:", err)

      // Handle field-specific errors from API
      if (err.data && typeof err.data === 'object') {
        const errors: Record<string, string[]> = {}
        for (const [key, value] of Object.entries(err.data)) {
          if (Array.isArray(value)) {
            errors[key] = value as string[]
          }
        }
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors)
        } else {
          setError(err.message || "Đăng ký thất bại")
        }
      } else {
        setError(err.message || "Đăng ký thất bại")
      }
    } finally {
      setLoading(false)
    }
  }

  const getFieldError = (field: string) => {
    return fieldErrors[field]?.[0]
  }

  return (
    <>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tạo tài khoản mới</h1>
        <p className="mt-2 text-sm text-slate-600">
          Nhận ngay ưu đãi 10% cho lần đặt vé đầu tiên.
        </p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
                className={getFieldError('username') ? 'border-red-500' : ''}
              />
              {getFieldError('username') && (
                <p className="text-xs text-red-500">{getFieldError('username')}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={getFieldError('email') ? 'border-red-500' : ''}
              />
              {getFieldError('email') && (
                <p className="text-xs text-red-500">{getFieldError('email')}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                disabled={loading}
                required
                className={getFieldError('password1') ? 'border-red-500' : ''}
              />
              {getFieldError('password1') && (
                <p className="text-xs text-red-500">{getFieldError('password1')}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Nhập lại mật khẩu</Label>
              <Input
                id="confirm-password"
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                disabled={loading}
                required
                className={getFieldError('password2') ? 'border-red-500' : ''}
              />
              {getFieldError('password2') && (
                <p className="text-xs text-red-500">{getFieldError('password2')}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                "Đăng ký tài khoản"
              )}
            </Button>
          </div>
        </form>

        <p className="text-xs text-center text-slate-500 px-4">
          Bằng việc đăng ký, bạn đồng ý với <Link href="#" className="underline">Điều khoản dịch vụ</Link> và <Link href="#" className="underline">Chính sách bảo mật</Link> của chúng tôi.
        </p>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Đã có tài khoản?
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full" asChild disabled={loading}>
          <Link href="/login">Đăng nhập</Link>
        </Button>
      </div>
    </>
  )
}