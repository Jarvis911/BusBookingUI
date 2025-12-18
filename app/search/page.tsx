"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  Bus,
  MapPin,
  Clock,
  Wifi,
  Filter,
  Star,
  Armchair,
  Utensils,
  ArrowRight,
  ChevronDown,
  ArrowUpDown,
  Loader2,
} from "lucide-react";

// --- Imports Shadcn UI ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingForm } from "@/components/booking-form";

// --- API Imports ---
import { fetchTrips } from "@/lib/api";
import { Trip } from "@/lib/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [trips, setTrips] = React.useState<Trip[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Get search params
  const origin = searchParams.get('origin') || undefined;
  const destination = searchParams.get('destination') || undefined;
  const date = searchParams.get('date') || undefined;

  // --- FILTER STATE ---
  // Time slot filters (24h format ranges)
  const [timeSlots, setTimeSlots] = React.useState({
    earlyMorning: false,  // 00:00 - 06:00
    morning: false,       // 06:00 - 12:00
    afternoon: false,     // 12:00 - 18:00
    evening: false,       // 18:00 - 24:00
  });

  // Price range filter (in VND, max 1,000,000)
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1000000]);

  // Bus type filters
  const [busTypes, setBusTypes] = React.useState({
    gheNgoi: false,     // Ghế ngồi
    giuongNam: false,   // Giường nằm
    limousine: false,   // Limousine
  });

  // Load trips based on search params
  React.useEffect(() => {
    async function loadTrips() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTrips({ origin, destination, date });
        setTrips(data);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
        setError("Không thể tải danh sách chuyến xe. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, [origin, destination, date]);

  // --- FILTER LOGIC ---
  const filteredTrips = React.useMemo(() => {
    return trips.filter((trip) => {
      // Time slot filter
      const hasTimeFilter = timeSlots.earlyMorning || timeSlots.morning || timeSlots.afternoon || timeSlots.evening;
      if (hasTimeFilter) {
        const departureHour = new Date(trip.departure_time).getHours();
        const matchesTime =
          (timeSlots.earlyMorning && departureHour >= 0 && departureHour < 6) ||
          (timeSlots.morning && departureHour >= 6 && departureHour < 12) ||
          (timeSlots.afternoon && departureHour >= 12 && departureHour < 18) ||
          (timeSlots.evening && departureHour >= 18 && departureHour < 24);
        if (!matchesTime) return false;
      }

      // Price range filter
      const price = trip.route.base_price;
      if (price < priceRange[0] || price > priceRange[1]) return false;

      // Bus type filter
      const hasBusTypeFilter = busTypes.gheNgoi || busTypes.giuongNam || busTypes.limousine;
      if (hasBusTypeFilter) {
        const busType = trip.bus.bus_type.toLowerCase();
        const matchesBusType =
          (busTypes.gheNgoi && busType.includes('ghế')) ||
          (busTypes.giuongNam && busType.includes('giường')) ||
          (busTypes.limousine && busType.includes('limousine'));
        if (!matchesBusType) return false;
      }

      return true;
    });
  }, [trips, timeSlots, priceRange, busTypes]);

  // Reset all filters
  const resetFilters = () => {
    setTimeSlots({ earlyMorning: false, morning: false, afternoon: false, evening: false });
    setPriceRange([0, 1000000]);
    setBusTypes({ gheNgoi: false, giuongNam: false, limousine: false });
  };

  // Calculate available seats
  const getAvailableSeats = (trip: Trip) => {
    return trip.seat_map.filter((seat) => !seat.is_booked).length;
  };

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format duration
  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m > 0 ? `${m}m` : ""}`.trim();
  };

  // Format price for display
  const formatPrice = (value: number) => {
    if (value >= 1000000) return '1.000.000đ+';
    return `${value.toLocaleString('vi-VN')}đ`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* --- Header: Breadcrumb & Info --- */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <span>Trang chủ</span> <span className="text-xs">/</span>{" "}
              <span>Tìm chuyến xe</span>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Danh sách chuyến xe
              <span className="ml-3 text-base font-normal text-slate-500">
                ({filteredTrips.length} kết quả)
              </span>
            </h1>
          </div>
          {/* Quick Sort Mobile/Desktop */}
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-white">
              <ArrowUpDown className="h-4 w-4" /> Sắp xếp: Mặc định
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* --- LEFT SIDEBAR: FILTERS --- */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Bộ lọc tìm kiếm</h3>
                <button
                  className="text-xs text-orange-600 font-semibold hover:underline"
                  onClick={resetFilters}
                >
                  Bỏ lọc
                </button>
              </div>

              <Accordion
                type="multiple"
                defaultValue={["hours", "price", "type"]}
                className="w-full"
              >
                {/* Giờ đi */}
                <AccordionItem value="hours">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    Giờ đi
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sang"
                          checked={timeSlots.earlyMorning}
                          onCheckedChange={(checked) =>
                            setTimeSlots(prev => ({ ...prev, earlyMorning: !!checked }))
                          }
                        />
                        <label htmlFor="sang" className="text-sm cursor-pointer">
                          Sáng sớm (00:00 - 06:00)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sang2"
                          checked={timeSlots.morning}
                          onCheckedChange={(checked) =>
                            setTimeSlots(prev => ({ ...prev, morning: !!checked }))
                          }
                        />
                        <label htmlFor="sang2" className="text-sm cursor-pointer">
                          Buổi sáng (06:00 - 12:00)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="chieu"
                          checked={timeSlots.afternoon}
                          onCheckedChange={(checked) =>
                            setTimeSlots(prev => ({ ...prev, afternoon: !!checked }))
                          }
                        />
                        <label htmlFor="chieu" className="text-sm cursor-pointer">
                          Buổi chiều (12:00 - 18:00)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="toi"
                          checked={timeSlots.evening}
                          onCheckedChange={(checked) =>
                            setTimeSlots(prev => ({ ...prev, evening: !!checked }))
                          }
                        />
                        <label htmlFor="toi" className="text-sm cursor-pointer">
                          Buổi tối (18:00 - 24:00)
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Giá vé */}
                <AccordionItem value="price">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    Giá vé
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4 px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={(value) => setPriceRange(value as [number, number])}
                        max={1000000}
                        step={50000}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-xs font-medium text-slate-500">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Loại xe */}
                <AccordionItem value="type">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    Loại xe
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="ghe"
                          checked={busTypes.gheNgoi}
                          onCheckedChange={(checked) =>
                            setBusTypes(prev => ({ ...prev, gheNgoi: !!checked }))
                          }
                        />
                        <label htmlFor="ghe" className="text-sm cursor-pointer">
                          Ghế ngồi
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="giuong"
                          checked={busTypes.giuongNam}
                          onCheckedChange={(checked) =>
                            setBusTypes(prev => ({ ...prev, giuongNam: !!checked }))
                          }
                        />
                        <label htmlFor="giuong" className="text-sm cursor-pointer">
                          Giường nằm
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="limousine"
                          checked={busTypes.limousine}
                          onCheckedChange={(checked) =>
                            setBusTypes(prev => ({ ...prev, limousine: !!checked }))
                          }
                        />
                        <label htmlFor="limousine" className="text-sm cursor-pointer">
                          Limousine
                        </label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </aside>

          {/* --- RIGHT CONTENT: TICKET LIST --- */}
          <main className="lg:col-span-3 space-y-4">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <span className="ml-3 text-slate-600">Đang tải chuyến xe...</span>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
                <p className="text-red-600 font-medium">{error}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Thử lại
                </Button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredTrips.length === 0 && (
              <div className="rounded-xl border bg-white p-8 text-center">
                <p className="text-slate-500">Không tìm thấy chuyến xe nào.</p>
              </div>
            )}

            {/* Trip List */}
            {!loading &&
              !error &&
              filteredTrips.map((trip) => (
                <TicketCard
                  key={trip.id}
                  trip={trip}
                  availableSeats={getAvailableSeats(trip)}
                  formatTime={formatTime}
                  formatDuration={formatDuration}
                />
              ))}

            {!loading && !error && filteredTrips.length > 0 && (
              <div className="pt-8 flex justify-center">
                <Button variant="outline" className="w-full sm:w-auto">
                  Xem thêm chuyến xe khác
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: TICKET CARD ---
interface TicketCardProps {
  trip: Trip;
  availableSeats: number;
  formatTime: (iso: string) => string;
  formatDuration: (hours: number) => string;
}

function TicketCard({ trip, availableSeats, formatTime, formatDuration }: TicketCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);

  const { route, bus } = trip;
  const price = route.base_price;
  const startTime = formatTime(trip.departure_time);
  const endTime = formatTime(trip.arrival_time);
  const duration = formatDuration(route.duration_hours);

  // Get pickup and dropoff points
  const pickupPoints = route.points.filter((p) => p.point_type === "PICKUP");
  const dropoffPoints = route.points.filter((p) => p.point_type === "DROPOFF");

  return (
    <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0">
          <img
            src={bus.main_image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=300&auto=format&fit=crop"}
            alt={bus.bus_type}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge className="bg-orange-500 hover:bg-orange-600">
              {bus.bus_type}
            </Badge>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          {/* Header: Name & Rating */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                {route.origin} → {route.destination}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="font-normal text-slate-600 bg-slate-100"
                >
                  {bus.bus_type}
                </Badge>
                <span className="flex items-center text-sm font-bold text-yellow-500">
                  <Star className="w-3 h-3 fill-current mr-1" /> {bus.average_rating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-orange-600">
                {price.toLocaleString()}đ
              </div>
            </div>
          </div>

          {/* Route Timeline */}
          <div className="flex items-center gap-8 mb-4">
            <div className="relative z-10">
              <div className="text-xl font-bold text-slate-800">
                {startTime}
              </div>
              <div className="text-xs text-slate-500 mt-1 max-w-[100px] truncate">
                {pickupPoints[0]?.name || route.origin}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center relative px-2">
              <div className="text-xs text-slate-400 mb-1">{duration}</div>
              <div className="w-full h-[2px] bg-slate-200 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500"></div>
              </div>
            </div>

            <div className="text-right relative z-10">
              <div className="text-xl font-bold text-slate-800">
                {endTime}
              </div>
              <div className="text-xs text-slate-500 mt-1 max-w-[100px] truncate">
                {dropoffPoints[0]?.name || route.destination}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-dashed">
            <div className="flex gap-3 text-slate-400">
              {/* Feature Icons from amenities */}
              {bus.amenities.slice(0, 3).map((amenity) => (
                <span key={amenity.id} title={amenity.name}>
                  <Wifi className="w-4 h-4" />
                </span>
              ))}
              {bus.amenities.length === 0 && (
                <>
                  <Wifi className="w-4 h-4" />
                  <Utensils className="w-4 h-4" />
                  <Armchair className="w-4 h-4" />
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500">
                Còn {availableSeats} chỗ trống
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  Thông tin chi tiết{" "}
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""
                      }`}
                  />
                </Button>
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white min-w-[100px]"
                  onClick={() => setIsBookingOpen(!isBookingOpen)}
                  disabled={availableSeats === 0}
                >
                  {isBookingOpen ? "Đóng lại" : "Chọn chuyến"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXPANDED CONTENT (Tabs) */}
      {isExpanded && (
        <div className="border-t bg-slate-50/50 p-4 animate-in slide-in-from-top-2 duration-200">
          <Tabs defaultValue="images" className="w-full">
            <TabsList className="bg-white border w-full justify-start h-10 p-0 rounded-none border-b-0">
              <TabsTrigger
                value="images"
                className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none h-full px-6 bg-transparent"
              >
                Hình ảnh
              </TabsTrigger>
              <TabsTrigger
                value="utilities"
                className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none h-full px-6 bg-transparent"
              >
                Tiện ích
              </TabsTrigger>
              <TabsTrigger
                value="policy"
                className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none h-full px-6 bg-transparent"
              >
                Chính sách
              </TabsTrigger>
            </TabsList>
            <div className="bg-white border border-t-0 p-4 rounded-b-lg">
              <TabsContent value="images" className="mt-0">
                <div className="grid grid-cols-4 gap-2">
                  {bus.images.length > 0 ? (
                    bus.images.slice(0, 4).map((img, idx) => (
                      <div key={img.id} className="h-24 bg-slate-200 rounded-md overflow-hidden">
                        <img src={img.image} alt={img.caption} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="h-24 bg-slate-200 rounded-md"></div>
                      <div className="h-24 bg-slate-200 rounded-md"></div>
                      <div className="h-24 bg-slate-200 rounded-md"></div>
                      <div className="h-24 bg-slate-200 rounded-md flex items-center justify-center text-xs text-slate-500">
                        Chưa có ảnh
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="utilities" className="mt-0">
                {bus.amenities.length > 0 ? (
                  <ul className="space-y-2">
                    {bus.amenities.map((amenity) => (
                      <li key={amenity.id} className="text-sm text-slate-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        {amenity.name}: {amenity.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">
                    Xe được trang bị đầy đủ tiện nghi.
                  </p>
                )}
              </TabsContent>
              <TabsContent value="policy" className="mt-0">
                <p className="text-sm text-slate-600 whitespace-pre-line">
                  {bus.policy || "Chính sách hủy vé linh hoạt, hoàn tiền 100% trước 24h."}
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}

      {/* Booking Form */}
      {isBookingOpen && (
        <div className="border-t border-slate-100">
          <BookingForm
            price={price}
            tripId={trip.id}
            seatMap={trip.seat_map}
            pickupPoints={pickupPoints}
            dropoffPoints={dropoffPoints}
          />
        </div>
      )}
    </Card>
  );
}
