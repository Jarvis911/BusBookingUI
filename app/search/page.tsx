"use client";

import * as React from "react";
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

// --- Mock Data ---
const tickets = [
  {
    id: 1,
    operator: "Sao Việt",
    type: "Limousine 9 chỗ",
    from: "Hà Nội",
    to: "Sapa",
    startTime: "22:00",
    endTime: "03:30",
    duration: "5h 30m",
    price: 350000,
    originalPrice: 400000,
    rating: 4.8,
    reviewCount: 1240,
    seatsAvailable: 5,
    pickup: "Bến xe Mỹ Đình",
    dropoff: "VP Sapa",
    features: ["wifi", "water", "usb"],
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: 2,
    operator: "Hà Sơn Hải Vân",
    type: "Giường nằm Royal",
    from: "Hà Nội",
    to: "Sapa",
    startTime: "07:00",
    endTime: "12:30",
    duration: "5h 30m",
    price: 280000,
    rating: 4.5,
    reviewCount: 856,
    seatsAvailable: 20,
    pickup: "Bến xe Giáp Bát",
    dropoff: "Bến xe Sapa",
    features: ["wifi", "blanket"],
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=300&auto=format&fit=crop",
  },
  // Thêm data mẫu khác...
];

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* --- Header: Breadcrumb & Info --- */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <span>Trang chủ</span> <span className="text-xs">/</span>{" "}
              <span>Hà Nội - Sapa</span>
            </div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Hà Nội <ArrowRight className="h-5 w-5 text-slate-400" /> Sapa
              <span className="ml-3 text-base font-normal text-slate-500">
                (24 kết quả)
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
                <button className="text-xs text-orange-600 font-semibold hover:underline">
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
                        <Checkbox id="sang" />
                        <label htmlFor="sang" className="text-sm">
                          Sáng sớm (00:00 - 06:00)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sang2" />
                        <label htmlFor="sang2" className="text-sm">
                          Buổi sáng (06:00 - 12:00)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="chieu" />
                        <label htmlFor="chieu" className="text-sm">
                          Buổi chiều (12:00 - 18:00)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="toi" />
                        <label htmlFor="toi" className="text-sm">
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
                        defaultValue={[0, 100]}
                        max={100}
                        step={1}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-xs font-medium text-slate-500">
                        <span>0đ</span>
                        <span>1.000.000đ+</span>
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
                        <Checkbox id="ghe" />
                        <label htmlFor="ghe" className="text-sm">
                          Ghế ngồi
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="giuong" />
                        <label htmlFor="giuong" className="text-sm">
                          Giường nằm
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="limousine" />
                        <label htmlFor="limousine" className="text-sm">
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
            {tickets.map((ticket) => (
              <TicketCard key={ticket.id} data={ticket} />
            ))}

            <div className="pt-8 flex justify-center">
              <Button variant="outline" className="w-full sm:w-auto">
                Xem thêm chuyến xe khác
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: TICKET CARD (Quan trọng) ---
function TicketCard({ data }: { data: any }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);

  return (
    <Card className="overflow-hidden border-0 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0">
          <img
            src={data.image}
            alt={data.operator}
            className="h-full w-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge className="bg-orange-500 hover:bg-orange-600">
              Yêu thích
            </Badge>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          {/* Header: Name & Rating */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                {data.operator}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="font-normal text-slate-600 bg-slate-100"
                >
                  {data.type}
                </Badge>
                <span className="flex items-center text-sm font-bold text-yellow-500">
                  <Star className="w-3 h-3 fill-current mr-1" /> {data.rating}
                </span>
                <span className="text-xs text-slate-400">
                  ({data.reviewCount} đánh giá)
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-orange-600">
                {data.price.toLocaleString()}đ
              </div>
              {data.originalPrice && (
                <div className="text-sm text-slate-400 line-through">
                  {data.originalPrice.toLocaleString()}đ
                </div>
              )}
            </div>
          </div>

          {/* Route Timeline */}
          <div className="flex items-center gap-8 mb-4">
            <div className="relative z-10">
              <div className="text-xl font-bold text-slate-800">
                {data.startTime}
              </div>
              <div className="text-xs text-slate-500 mt-1 max-w-[100px] truncate">
                {data.pickup}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center relative px-2">
              <div className="text-xs text-slate-400 mb-1">{data.duration}</div>
              <div className="w-full h-[2px] bg-slate-200 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500"></div>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 bg-slate-50 px-2 rounded-full border">
                Không dừng nghỉ
              </div>
            </div>

            <div className="text-right relative z-10">
              <div className="text-xl font-bold text-slate-800">
                {data.endTime}
              </div>
              <div className="text-xs text-slate-500 mt-1 max-w-[100px] truncate">
                {data.dropoff}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-dashed">
            <div className="flex gap-3 text-slate-400">
              {/* Feature Icons */}
              <Wifi className="w-4 h-4" />
              <Utensils className="w-4 h-4" />
              <Armchair className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500">
                Còn {data.seatsAvailable} chỗ trống
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
                    className={`ml-1 h-4 w-4 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </Button>
                <Button
                  className="bg-orange-600 hover:bg-orange-700 text-white min-w-[100px]"
                  onClick={() => setIsBookingOpen(!isBookingOpen)} // Toggle form
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
              <TabsTrigger
                value="reviews"
                className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 data-[state=active]:text-orange-600 rounded-none h-full px-6 bg-transparent"
              >
                Đánh giá
              </TabsTrigger>
            </TabsList>
            <div className="bg-white border border-t-0 p-4 rounded-b-lg">
              <TabsContent value="images" className="mt-0">
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-24 bg-slate-200 rounded-md"></div>
                  <div className="h-24 bg-slate-200 rounded-md"></div>
                  <div className="h-24 bg-slate-200 rounded-md"></div>
                  <div className="h-24 bg-slate-200 rounded-md flex items-center justify-center text-xs text-slate-500">
                    +5 ảnh
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="utilities" className="mt-0">
                <p className="text-sm text-slate-600">
                  Xe được trang bị đầy đủ tiện nghi: Wifi tốc độ cao, nước uống
                  miễn phí, cổng sạc USB tại mỗi ghế...
                </p>
              </TabsContent>
              {/* Các tabs khác tương tự */}
            </div>
          </Tabs>
        </div>
      )}
      {isBookingOpen && (
                <div className="border-t border-slate-100">
                  <BookingForm price={data.price} />
                </div>
              )}
    </Card>
  );
}
