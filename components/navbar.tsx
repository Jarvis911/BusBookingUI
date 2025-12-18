"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Search, User, LogOut, Ticket, Phone, Bell, Settings, CheckCheck, Loader2 } from "lucide-react"

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
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { fetchNotifications, fetchUnreadNotificationCount, markNotificationRead, createNotification } from "@/lib/api"
import { Notification } from "@/lib/types"

export function Navbar() {
  const router = useRouter()
  const { user, isAuthenticated, logout, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  // Notification state
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [notifLoading, setNotifLoading] = React.useState(false)
  const [bellShaking, setBellShaking] = React.useState(false)

  const navLinks = [
    { name: "Trang chủ", href: "/" },
    { name: "Lịch trình", href: "/search" },
    { name: "Tra cứu vé", href: "/lookup" },
    { name: "Tin tức", href: "/news" },
    { name: "Liên hệ", href: "/contact" },
  ]

  // Fetch unread count on mount
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadNotificationCount().then(setUnreadCount).catch(console.error)
    }
  }, [isAuthenticated])

  // Listen for login event to create greeting notification
  React.useEffect(() => {
    const handleUserLoggedIn = async (event: Event) => {
      const customEvent = event as CustomEvent<{ username: string }>
      const { username } = customEvent.detail

      try {
        // Create greeting notification
        await createNotification(
          `Chào mừng ${username}! 👋`,
          'Chúc bạn có trải nghiệm đặt vé tuyệt vời tại DT Bus Lines!',
          'SYSTEM',
          '/my-bookings'
        )

        // Update unread count
        setUnreadCount(prev => prev + 1)

        // Trigger bell shake animation
        setBellShaking(true)
        setTimeout(() => setBellShaking(false), 2000)

        // Show toast popup
        toast.success(`Chào mừng ${username}! 👋`, {
          description: 'Chúc bạn có trải nghiệm đặt vé tuyệt vời!',
        })
      } catch (err) {
        console.error('Failed to create greeting notification:', err)
      }
    }

    window.addEventListener('user-logged-in', handleUserLoggedIn as EventListener)
    return () => window.removeEventListener('user-logged-in', handleUserLoggedIn as EventListener)
  }, [])

  // Fetch notifications when dropdown opens
  const handleNotifOpen = async (open: boolean) => {
    if (open && isAuthenticated) {
      setNotifLoading(true)
      try {
        const data = await fetchNotifications()
        setNotifications(data)
      } catch (err) {
        console.error(err)
      } finally {
        setNotifLoading(false)
      }
    }
  }

  // Mark all as read
  const handleMarkAllRead = async () => {
    try {
      await markNotificationRead(undefined, true)
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error(err)
    }
  }

  // Mark single notification as read
  const handleNotifClick = async (notif: Notification) => {
    if (!notif.is_read) {
      try {
        await markNotificationRead(notif.id)
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch (err) {
        console.error(err)
      }
    }
    if (notif.link) {
      router.push(notif.link)
    }
  }

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
    router.push("/")
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase()
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)

    if (mins < 1) return "Vừa xong"
    if (mins < 60) return `${mins} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    return `${days} ngày trước`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* --- LEFT: LOGO --- */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt="Duc Tri Bus Lines"
              className="h-13 w-13 rounded-lg object-cover"
            />
            <span className="hidden text-2xl tracking-wide text-slate-900 sm:inline-block font-[family-name:var(--font-bebas)]">
              DT BUS LINES
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
              {/* Notification Dropdown */}
              <DropdownMenu onOpenChange={handleNotifOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className={`relative text-slate-500 ${bellShaking ? 'animate-bell-shake' : ''}`}>
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Thông báo</span>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-orange-600 hover:text-orange-700"
                        onClick={handleMarkAllRead}
                      >
                        <CheckCheck className="h-3 w-3 mr-1" />
                        Đọc tất cả
                      </Button>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-[300px]">
                    {notifLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                        <Bell className="h-10 w-10 mb-2" />
                        <p className="text-sm">Không có thông báo</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <DropdownMenuItem
                          key={notif.id}
                          className={`flex flex-col items-start p-3 cursor-pointer ${!notif.is_read ? 'bg-orange-50' : ''}`}
                          onClick={() => handleNotifClick(notif)}
                        >
                          <div className="flex items-start gap-2 w-full">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.is_read ? 'bg-orange-500' : 'bg-slate-200'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{notif.title}</p>
                              <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{formatTime(notif.created_at)}</p>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

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
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
              <div className="flex flex-col h-full">

                {/* Header */}
                <div className="flex items-center gap-3 p-6 border-b bg-slate-50">
                  <img
                    src="/logo.png"
                    alt="Duc Tri Bus Lines"
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <span className="text-xl tracking-wide text-slate-900 font-[family-name:var(--font-bebas)]">DT BUS LINES</span>
                </div>

                {/* User Info (if logged in) */}
                {isAuthenticated && user && (
                  <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-white">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-orange-200">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username}`} alt={user.username} />
                        <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900">{user.username}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <span className="text-base font-medium">{link.name}</span>
                      </Link>
                    ))}
                  </div>

                  {/* Logged in user actions */}
                  {isAuthenticated && user && (
                    <>
                      <div className="my-4 border-t" />
                      <div className="space-y-1">
                        <Link
                          href="/my-bookings"
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <Ticket className="h-5 w-5" />
                          <span className="text-base font-medium">Vé của tôi</span>
                          <Badge className="ml-auto bg-orange-600 h-5 px-1.5 text-xs">Mới</Badge>
                        </Link>
                        <Link
                          href="/settings"
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          <Settings className="h-5 w-5" />
                          <span className="text-base font-medium">Cài đặt</span>
                        </Link>
                      </div>
                    </>
                  )}
                </nav>

                {/* Footer Actions */}
                <div className="border-t p-4 space-y-3 bg-slate-50">
                  {/* Hotline */}
                  <div className="flex items-center justify-center gap-2 py-3 rounded-lg bg-white border text-slate-700">
                    <Phone className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold">1900 888 888</span>
                  </div>

                  {!isAuthenticated ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/login" onClick={closeMobileMenu}>Đăng nhập</Link>
                      </Button>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                        <Link href="/register" onClick={closeMobileMenu}>Đăng ký</Link>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
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