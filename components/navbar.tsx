"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Search, User, LogOut, Ticket, Phone, Bell, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const router = useRouter()
  const { user, isAuthenticated, logout, loading } = useAuth()

  const navLinks = [
    { name: "Trang chủ", href: "/" },
    { name: "Lịch trình", href: "/search" },
    { name: "Tra cứu vé", href: "/lookup" },
    { name: "Tin tức", href: "/news" },
    { name: "Liên hệ", href: "/contact" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* --- LEFT: LOGO --- */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600 text-white">
              <span className="text-xl font-bold">V</span>
            </div>
            <span className="hidden text-xl font-bold text-slate-900 sm:inline-block">
              Vexere<span className="text-orange-600">Clone</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-orange-600"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* --- RIGHT: ACTIONS --- */}
        <div className="flex items-center gap-4">

          {/* Hotline (Hidden on small mobile) */}
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900">
            <Phone className="h-4 w-4 text-orange-600" />
            <span>1900 888 888</span>
          </div>

          {!loading && isAuthenticated && user ? (
            // --- LOGGED IN STATE ---
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative text-slate-500">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username}`} alt={user.username} />
                      <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" /> Tài khoản của tôi
                  </DropdownMenuItem>
                  <Link href="/my-bookings">
                    <DropdownMenuItem>
                      <Ticket className="mr-2 h-4 w-4" /> Vé của tôi
                      <Badge className="ml-auto bg-orange-600 h-5 px-1.5">Mới</Badge>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" /> Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : !loading ? (
            // --- GUEST STATE ---
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
                <Link href="/register">Đăng ký</Link>
              </Button>
            </div>
          ) : null}

          {/* --- MOBILE MENU (Sheet) --- */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-xl font-bold">Vexere Clone</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium text-slate-900 hover:text-orange-600"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 mt-4 border-t pt-6">
                  {!isAuthenticated ? (
                    <>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/login">Đăng nhập</Link>
                      </Button>
                      <Button className="w-full justify-start bg-orange-600 hover:bg-orange-700" asChild>
                        <Link href="/register">Đăng ký tài khoản</Link>
                      </Button>
                    </>
                  ) : (
                    <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                      Đăng xuất
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}