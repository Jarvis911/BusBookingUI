"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { vi } from "date-fns/locale" // Để hiển thị lịch tiếng Việt
import {
  MapPin,
  Calendar as CalendarIcon,
  Search,
  Bus,
  Wifi,
  Star,
  ArrowRight,
  Loader2
} from "lucide-react"

// --- Real Shadcn Imports ---
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// --- API Imports ---
import { fetchRoutes } from "@/lib/api"
import { Route } from "@/lib/types"

export default function HomePage() {
  const router = useRouter()
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [origin, setOrigin] = React.useState("")
  const [destination, setDestination] = React.useState("")

  // Routes from API
  const [routes, setRoutes] = React.useState<Route[]>([])
  const [loading, setLoading] = React.useState(true)

  // Fetch routes on mount
  React.useEffect(() => {
    async function loadRoutes() {
      try {
        const data = await fetchRoutes()
        setRoutes(data)
      } catch (err) {
        console.error("Failed to fetch routes:", err)
      } finally {
        setLoading(false)
      }
    }
    loadRoutes()
  }, [])

  // Handle search
  const handleSearch = () => {
    const params = new URLSearchParams()
    if (origin) params.append('origin', origin)
    if (destination) params.append('destination', destination)
    if (date) params.append('date', format(date, 'yyyy-MM-dd'))
    router.push(`/search?${params.toString()}`)
  }

  // Route images (fallback)
  const routeImages = [
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559038465-e92fa44a3626?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* --- HERO SECTION & SEARCH --- */}
      <div className="relative bg-slate-900 pb-32">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2070&auto=format&fit=crop"
            alt="Bus Background"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90" />
        </div>

        {/* Header Content */}
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hành trình vạn dặm, <span className="text-orange-500">êm ái như mây</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-slate-300">
            Hệ thống đặt vé xe trực tuyến hàng đầu. Chọn chỗ ngồi yêu thích, thanh toán bảo mật.
          </p>
        </div>
      </div>

      {/* --- SEARCH WIDGET (Using Real Shadcn Components) --- */}
      <div className="relative -mt-24 px-4 sm:px-6 lg:px-8 z-10">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5">

          {/* Tabs: Một chiều / Khứ hồi */}
          <Tabs defaultValue="one-way" className="w-full mb-6">
            <TabsList className="grid w-[300px] grid-cols-2">
              <TabsTrigger value="one-way">Một chiều</TabsTrigger>
              <TabsTrigger value="round-trip">Khứ hồi</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 items-end">

            {/* Nơi đi */}
            <div className="col-span-1 md:col-span-3 space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase">Điểm đi</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input type="text" placeholder="Tỉnh/Thành phố" className="pl-9 h-11" value={origin} onChange={(e) => setOrigin(e.target.value)} />
              </div>
            </div>

            {/* Swap Button Visual */}
            <div className="hidden md:flex col-span-1 justify-center pb-1">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Button>
            </div>

            {/* Nơi đến */}
            <div className="col-span-1 md:col-span-3 space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase">Điểm đến</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input type="text" placeholder="Tỉnh/Thành phố" className="pl-9 h-11" value={destination} onChange={(e) => setDestination(e.target.value)} />
              </div>
            </div>

            {/* Ngày đi (Date Picker Shadcn) */}
            <div className="col-span-1 md:col-span-3 space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase">Ngày khởi hành</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full h-11 pl-3 text-left font-normal justify-start",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                    {date ? format(date, "P", { locale: vi }) : <span>Chọn ngày</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Số khách (Select Shadcn) */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <Label className="text-xs font-semibold text-slate-500 uppercase">Hành khách</Label>
              <Select defaultValue="1">
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Số khách" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Khách</SelectItem>
                  <SelectItem value="2">2 Khách</SelectItem>
                  <SelectItem value="3">3 Khách</SelectItem>
                  <SelectItem value="4">4+ Khách</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Search Button */}
          <div className="mt-6 flex justify-end">
            <Button size="lg" className="w-full md:w-auto px-8 bg-orange-600 hover:bg-orange-700 text-base font-semibold shadow-lg shadow-orange-200" onClick={handleSearch}>
              <Search className="mr-2 h-5 w-5" /> Tìm chuyến xe
            </Button>
          </div>
        </div>
      </div>

      {/* --- POPULAR ROUTES --- */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Tuyến đường phổ biến</h2>
          <Button variant="link" className="text-orange-600">
            Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="col-span-4 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            <span className="ml-3 text-slate-600">Đang tải tuyến đường...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {routes.slice(0, 4).map((route, idx) => (
              <Card key={route.id} className="group overflow-hidden border-0 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer" onClick={() => router.push(`/search?origin=${route.origin}&destination=${route.destination}`)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={routeImages[idx % routeImages.length]} alt="Route" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="backdrop-blur-md bg-white/90">{Math.floor(route.duration_hours)}h {Math.round((route.duration_hours % 1) * 60)}m</Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-900">{route.origin} <span className="text-slate-400 mx-1">→</span> {route.destination}</h3>
                  </div>
                  <div className="flex items-center text-sm text-slate-500 mb-4">
                    <Bus className="mr-2 h-4 w-4" />
                    <span>{route.points.length} điểm dừng</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <div>
                      <span className="text-xs text-slate-500">Giá từ</span>
                      <p className="text-lg font-bold text-orange-600">{route.base_price.toLocaleString()}đ</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800">
                      Đặt vé
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* --- FEATURES --- */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Tiện ích 5 sao</h2>
            <p className="mt-4 text-lg text-slate-600">Nâng tầm trải nghiệm di chuyển của bạn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-50">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-4">
                <Bus className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Dòng xe cao cấp</h3>
              <p className="text-sm text-slate-600">Limousine, Ghế ngả, Giường nằm đời mới nhất.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-50">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <Wifi className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Tiện nghi đầy đủ</h3>
              <p className="text-sm text-slate-600">Wifi 4G, chăn gối sạch sẽ, nước uống miễn phí.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-50">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">Dịch vụ chuẩn mực</h3>
              <p className="text-sm text-slate-600">Đúng giờ, không bắt khách dọc đường, nhân viên thân thiện.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}