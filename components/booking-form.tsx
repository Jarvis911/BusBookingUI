"use client"

import * as React from "react"
import { MapPin, Info } from "lucide-react"

// --- Shadcn Imports ---
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// --- Mock Data: Sơ đồ ghế (3 dãy) ---
// Tầng 1
const floor1 = [
  { id: "A01", status: "sold" }, { id: "B01", status: "available" }, { id: "C01", status: "available" },
  { id: "A03", status: "available" }, { id: "B03", status: "available" }, { id: "C03", status: "available" },
  { id: "A05", status: "available" }, { id: "B05", status: "sold" }, { id: "C05", status: "available" },
  { id: "A07", status: "available" }, { id: "B07", status: "available" }, { id: "C07", status: "available" },
  { id: "A09", status: "available" }, { id: "B09", status: "available" }, { id: "C09", status: "available" },
]
// Tầng 2
const floor2 = [
  { id: "A02", status: "available" }, { id: "B02", status: "available" }, { id: "C02", status: "available" },
  { id: "A04", status: "available" }, { id: "B04", status: "available" }, { id: "C04", status: "available" },
  { id: "A06", status: "sold" }, { id: "B06", status: "sold" }, { id: "C06", status: "available" },
  { id: "A08", status: "available" }, { id: "B08", status: "available" }, { id: "C08", status: "available" },
  { id: "A10", status: "available" }, { id: "B10", status: "available" }, { id: "C10", status: "available" },
]

// Mock Data: Điểm đón trả
const pickupPoints = [
    { id: "p1", time: "22:00", name: "Bến xe Mỹ Đình", address: "Số 20 Phạm Hùng" },
    { id: "p2", time: "22:30", name: "Ngã tư Sở (Dọc đường)", address: "Cây xăng đường Láng" },
    { id: "p3", time: "23:00", name: "Sân bay Nội Bài", address: "Sảnh E - T1" },
]

const dropoffPoints = [
    { id: "d1", time: "03:30", name: "Văn phòng Sapa", address: "571 Điện Biên Phủ" },
    { id: "d2", time: "04:00", name: "Khách sạn De la Coupole", address: "Trung tâm thị trấn" },
]

export function BookingForm({ price }: { price: number }) {
  const [selectedSeats, setSelectedSeats] = React.useState<string[]>([])
  const [pickup, setPickup] = React.useState(pickupPoints[0].id)
  const [dropoff, setDropoff] = React.useState(dropoffPoints[0].id)

  // Logic chọn ghế
  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId))
    } else {
        if(selectedSeats.length >= 5) {
            alert("Bạn chỉ được chọn tối đa 5 ghế")
            return
        }
        setSelectedSeats([...selectedSeats, seatId])
    }
  }

  const totalPrice = selectedSeats.length * price

  return (
    <div className="bg-slate-50 p-4 sm:p-6 border-t animate-in fade-in zoom-in-95 duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- COL 1: SEAT SELECTION (5/12 columns) --- */}
        <div className="lg:col-span-5 flex flex-col items-center">
            <h4 className="font-bold text-slate-900 mb-4 w-full text-left">Chọn ghế</h4>
            
            {/* Chú thích màu */}
            <div className="flex gap-4 text-xs text-slate-500 mb-6 w-full justify-center bg-white p-2 rounded-lg border">
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-slate-100 border rounded"></div> Trống</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-orange-500 rounded"></div> Đang chọn</div>
                <div className="flex items-center gap-1"><div className="w-4 h-4 bg-slate-300 cursor-not-allowed rounded"></div> Đã bán</div>
            </div>

            <Tabs defaultValue="floor1" className="w-full max-w-[300px]">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="floor1">Tầng dưới</TabsTrigger>
                    <TabsTrigger value="floor2">Tầng trên</TabsTrigger>
                </TabsList>
                
                {/* Hàm render lưới ghế */}
                <SeatGrid floorData={floor1} tabValue="floor1" selectedSeats={selectedSeats} onToggle={toggleSeat} />
                <SeatGrid floorData={floor2} tabValue="floor2" selectedSeats={selectedSeats} onToggle={toggleSeat} />
            </Tabs>
        </div>

        {/* --- COL 2: PICKUP/DROPOFF (4/12 columns) --- */}
        <div className="lg:col-span-4 border-l pl-0 lg:pl-8 border-slate-200">
            <h4 className="font-bold text-slate-900 mb-4">Điểm đón trả</h4>
            
            <ScrollArea className="h-[400px] pr-4">
                {/* Điểm đón */}
                <div className="mb-6">
                    <Label className="text-orange-600 font-bold mb-2 block uppercase text-xs">Điểm đón</Label>
                    <RadioGroup value={pickup} onValueChange={setPickup} className="space-y-3">
                        {pickupPoints.map((p) => (
                            <div key={p.id} className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${pickup === p.id ? 'border-orange-500 bg-orange-50' : 'border-slate-100 bg-white'}`}>
                                <RadioGroupItem value={p.id} id={p.id} className="mt-1 text-orange-600" />
                                <Label htmlFor={p.id} className="cursor-pointer w-full">
                                    <div className="font-bold text-slate-800">{p.time} • {p.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">{p.address}</div>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                {/* Điểm trả */}
                <div>
                    <Label className="text-orange-600 font-bold mb-2 block uppercase text-xs">Điểm trả</Label>
                    <RadioGroup value={dropoff} onValueChange={setDropoff} className="space-y-3">
                         {dropoffPoints.map((p) => (
                            <div key={p.id} className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${dropoff === p.id ? 'border-orange-500 bg-orange-50' : 'border-slate-100 bg-white'}`}>
                                <RadioGroupItem value={p.id} id={p.id} className="mt-1 text-orange-600" />
                                <Label htmlFor={p.id} className="cursor-pointer w-full">
                                    <div className="font-bold text-slate-800">{p.time} • {p.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">{p.address}</div>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </ScrollArea>
        </div>

        {/* --- COL 3: SUMMARY (3/12 columns) --- */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-white rounded-xl border p-5 h-fit shadow-sm">
            <div>
                <h4 className="font-bold text-lg mb-4">Thông tin đặt vé</h4>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Số lượng ghế:</span>
                        <span className="font-bold">{selectedSeats.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Số ghế:</span>
                        <span className="font-bold text-orange-600">{selectedSeats.join(", ") || "-"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Giá vé:</span>
                        <span className="font-bold">{price.toLocaleString()}đ</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-end">
                        <span className="font-bold text-slate-900">Tổng cộng:</span>
                        <span className="text-2xl font-bold text-orange-600">{totalPrice.toLocaleString()}đ</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-3">
                <Button 
                    className="w-full h-12 text-base font-bold bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                    disabled={selectedSeats.length === 0}
                >
                    Tiếp tục
                </Button>
                <p className="text-xs text-center text-slate-400">
                    Bằng việc nhấn tiếp tục, bạn đồng ý với <a href="#" className="underline">Chính sách bảo mật</a> của chúng tôi.
                </p>
            </div>
        </div>

      </div>
    </div>
  )
}

// --- SUB-COMPONENT: GHẾ ---
function SeatGrid({ floorData, tabValue, selectedSeats, onToggle }: any) {
    return (
        <TabsContent value={tabValue} className="mt-0">
            <div className="bg-white p-6 rounded-xl border shadow-inner relative">
                {/* Vô lăng giả lập */}
                <div className="absolute -top-3 left-6 text-slate-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>
                </div>
                
                {/* Lưới ghế 3 cột (Giả lập xe giường nằm) */}
                <div className="grid grid-cols-3 gap-x-8 gap-y-4 mt-4">
                    {floorData.map((seat: any) => {
                        const isSelected = selectedSeats.includes(seat.id)
                        const isSold = seat.status === 'sold'
                        
                        return (
                            <button
                                key={seat.id}
                                disabled={isSold}
                                onClick={() => onToggle(seat.id)}
                                className={cn(
                                    "relative w-12 h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200 group",
                                    isSold 
                                        ? "bg-slate-200 border-slate-200 cursor-not-allowed opacity-60" 
                                        : isSelected
                                            ? "bg-orange-500 border-orange-600 text-white shadow-md scale-105 z-10"
                                            : "bg-white border-slate-200 hover:border-orange-400 hover:shadow-sm text-slate-500"
                                )}
                            >
                                {/* Hình dáng ghế mô phỏng */}
                                <div className={cn(
                                    "absolute top-1 w-8 h-2 rounded-sm opacity-50",
                                    isSelected ? "bg-white" : "bg-slate-300"
                                )}></div>
                                
                                <span className="text-xs font-bold mt-2">{seat.id}</span>
                                
                                {/* Tooltip giá tiền khi hover */}
                                {!isSold && (
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20">
                                        Giá vé thường
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>
        </TabsContent>
    )
}