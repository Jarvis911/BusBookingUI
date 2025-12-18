"use client"

import * as React from "react"
import { MapPin, Info, Loader2 } from "lucide-react"

// --- Shadcn Imports ---
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// --- API Imports ---
import { createBooking, createMoMoPayment, isLoggedIn } from "@/lib/api"
import { SeatInfo, RoutePoint } from "@/lib/types"

interface BookingFormProps {
    price: number
    tripId: number
    seatMap: SeatInfo[]
    pickupPoints: RoutePoint[]
    dropoffPoints: RoutePoint[]
}

export function BookingForm({ price, tripId, seatMap, pickupPoints, dropoffPoints }: BookingFormProps) {
    const [selectedSeats, setSelectedSeats] = React.useState<number[]>([])
    const [pickup, setPickup] = React.useState<string>(pickupPoints[0]?.id.toString() || "")
    const [dropoff, setDropoff] = React.useState<string>(dropoffPoints[0]?.id.toString() || "")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    // Split seat map into two floors (simulate 2-floor bus)
    const halfIndex = Math.ceil(seatMap.length / 2)
    const floor1 = seatMap.slice(0, halfIndex)
    const floor2 = seatMap.slice(halfIndex)

    // Logic chọn ghế
    const toggleSeat = (seatNumber: number) => {
        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter((n) => n !== seatNumber))
        } else {
            if (selectedSeats.length >= 5) {
                alert("Bạn chỉ được chọn tối đa 5 ghế")
                return
            }
            setSelectedSeats([...selectedSeats, seatNumber])
        }
    }

    // Calculate surcharges from pickup and dropoff points
    const selectedPickup = pickupPoints.find(p => p.id.toString() === pickup)
    const selectedDropoff = dropoffPoints.find(p => p.id.toString() === dropoff)
    const pickupSurcharge = selectedPickup?.surcharge || 0
    const dropoffSurcharge = selectedDropoff?.surcharge || 0
    const totalSurcharge = (Number(pickupSurcharge) + Number(dropoffSurcharge)) * selectedSeats.length
    const totalPrice = (selectedSeats.length * price) + totalSurcharge

    // Handle booking submission
    const handleBooking = async () => {
        if (!isLoggedIn()) {
            alert("Vui lòng đăng nhập để đặt vé!")
            window.location.href = "/login"
            return
        }

        if (selectedSeats.length === 0) {
            setError("Vui lòng chọn ít nhất một ghế")
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Create bookings for all selected seats
            const bookingIds: number[] = []

            for (const seatNumber of selectedSeats) {
                const result = await createBooking({
                    trip: tripId,
                    seat_number: seatNumber,
                    pickup_point: parseInt(pickup),
                    dropoff_point: parseInt(dropoff),
                })
                bookingIds.push(result.data.id)
            }

            // Redirect to payment page with all booking IDs
            const bookingIdsParam = bookingIds.join(',')
            window.location.href = `/payment?booking_ids=${bookingIdsParam}`
        } catch (err: any) {
            console.error("Booking failed:", err)
            setError(err.message || "Đặt vé thất bại. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-slate-50 p-4 sm:p-6 border-t animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-19 gap-8">

                {/* --- COL 1: SEAT SELECTION (5/12 columns) --- */}
                <div className="lg:col-span-7 flex flex-col items-center">
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

                        {/* Render seat grids */}
                        <SeatGrid
                            floorData={floor1}
                            tabValue="floor1"
                            selectedSeats={selectedSeats}
                            onToggle={toggleSeat}
                        />
                        <SeatGrid
                            floorData={floor2}
                            tabValue="floor2"
                            selectedSeats={selectedSeats}
                            onToggle={toggleSeat}
                        />
                    </Tabs>
                </div>

                {/* --- COL 2: PICKUP/DROPOFF (4/12 columns) --- */}
                <div className="lg:col-span-7 border-l pl-0 lg:pl-8 border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4">Điểm đón trả</h4>

                    <ScrollArea className="h-[400px] pr-4">
                        {/* Điểm đón */}
                        <div className="mb-6">
                            <Label className="text-orange-600 font-bold mb-2 block uppercase text-xs">Điểm đón</Label>
                            {pickupPoints.length > 0 ? (
                                <RadioGroup value={pickup} onValueChange={setPickup} className="space-y-3">
                                    {pickupPoints.map((p) => (
                                        <div
                                            key={p.id}
                                            className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${pickup === p.id.toString() ? 'border-orange-500 bg-orange-50' : 'border-slate-100 bg-white'
                                                }`}
                                        >
                                            <RadioGroupItem value={p.id.toString()} id={`pickup-${p.id}`} className="mt-1 text-orange-600" />
                                            <Label htmlFor={`pickup-${p.id}`} className="cursor-pointer w-full">
                                                <div className="font-bold text-slate-800">{p.name}</div>
                                                <div className="text-xs text-slate-500 mt-1">{p.address}</div>
                                                {p.surcharge > 0 && (
                                                    <div className="text-xs text-orange-600 mt-1">+{p.surcharge.toLocaleString()}đ</div>
                                                )}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <p className="text-sm text-slate-500">Chưa có điểm đón</p>
                            )}
                        </div>

                        {/* Điểm trả */}
                        <div>
                            <Label className="text-orange-600 font-bold mb-2 block uppercase text-xs">Điểm trả</Label>
                            {dropoffPoints.length > 0 ? (
                                <RadioGroup value={dropoff} onValueChange={setDropoff} className="space-y-3">
                                    {dropoffPoints.map((p) => (
                                        <div
                                            key={p.id}
                                            className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${dropoff === p.id.toString() ? 'border-orange-500 bg-orange-50' : 'border-slate-100 bg-white'
                                                }`}
                                        >
                                            <RadioGroupItem value={p.id.toString()} id={`dropoff-${p.id}`} className="mt-1 text-orange-600" />
                                            <Label htmlFor={`dropoff-${p.id}`} className="cursor-pointer w-full">
                                                <div className="font-bold text-slate-800">{p.name}</div>
                                                <div className="text-xs text-slate-500 mt-1">{p.address}</div>
                                                {p.surcharge > 0 && (
                                                    <div className="text-xs text-orange-600 mt-1">+{p.surcharge.toLocaleString()}đ</div>
                                                )}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <p className="text-sm text-slate-500">Chưa có điểm trả</p>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* --- COL 3: SUMMARY (3/12 columns) --- */}
                <div className="lg:col-span-5 flex flex-col justify-between bg-white rounded-xl border p-5 h-fit shadow-sm">
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
                                <span className="font-bold">{price.toLocaleString()}đ × {selectedSeats.length}</span>
                            </div>
                            {totalSurcharge > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Phụ thu điểm đón/trả:</span>
                                    <span className="font-bold text-orange-500">+{totalSurcharge.toLocaleString()}đ</span>
                                </div>
                            )}
                            <Separator />
                            <div className="flex justify-between items-end gap-2">
                                <span className="font-bold text-slate-900">Tổng cộng:</span>
                                <span className="text-2xl font-bold text-orange-600">{totalPrice.toLocaleString()}đ</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="mt-8 space-y-3">
                        <Button
                            className="w-full h-12 text-base font-bold bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
                            disabled={selectedSeats.length === 0 || loading}
                            onClick={handleBooking}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Tiếp tục"
                            )}
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

// --- SUB-COMPONENT: SEAT GRID ---
interface SeatGridProps {
    floorData: SeatInfo[]
    tabValue: string
    selectedSeats: number[]
    onToggle: (seatNumber: number) => void
}

function SeatGrid({ floorData, tabValue, selectedSeats, onToggle }: SeatGridProps) {
    return (
        <TabsContent value={tabValue} className="mt-0">
            <div className="bg-white p-6 rounded-xl border shadow-inner relative">
                {/* Vô lăng giả lập */}
                <div className="absolute -top-3 left-6 text-slate-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2v20" /><path d="M2 12h20" /></svg>
                </div>

                {/* Lưới ghế 3 cột */}
                <div className="grid grid-cols-3 gap-x-8 gap-y-4 mt-4">
                    {floorData.map((seat) => {
                        const isSelected = selectedSeats.includes(seat.number)
                        const isSold = seat.is_booked

                        return (
                            <button
                                key={seat.number}
                                disabled={isSold}
                                onClick={() => onToggle(seat.number)}
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

                                <span className="text-xs font-bold mt-2">{seat.number}</span>

                                {/* Tooltip giá tiền khi hover */}
                                {!isSold && (
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-20">
                                        Ghế số {seat.number}
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