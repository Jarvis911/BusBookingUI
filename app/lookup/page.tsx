"use client";

import * as React from "react";
import { Search, Ticket, Loader2, CheckCircle2, Clock, XCircle, MapPin, Calendar, Bus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchMyBookings, isLoggedIn } from "@/lib/api";
import { BookingDetail } from "@/lib/types";

export default function LookupPage() {
    const [searchMethod, setSearchMethod] = React.useState<"phone" | "code">("code");
    const [searchValue, setSearchValue] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [searched, setSearched] = React.useState(false);
    const [bookings, setBookings] = React.useState<BookingDetail[]>([]);
    const [error, setError] = React.useState<string | null>(null);

    // Format date/time
    const formatDate = (iso: string) => {
        return new Date(iso).toLocaleDateString("vi-VN", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatTime = (iso: string) => {
        return new Date(iso).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Handle search
    const handleSearch = async () => {
        if (!searchValue.trim()) {
            setError("Vui lòng nhập thông tin tra cứu");
            return;
        }

        setLoading(true);
        setError(null);
        setSearched(true);

        try {
            // If logged in, try to fetch user's bookings
            if (isLoggedIn()) {
                const data = await fetchMyBookings();
                // Filter by booking ID if searching by code
                if (searchMethod === "code") {
                    const filtered = data.filter((b) => b.id.toString() === searchValue);
                    setBookings(filtered);
                } else {
                    setBookings(data);
                }
            } else {
                // For demo, show message to login
                setBookings([]);
            }
        } catch (err) {
            console.error("Search failed:", err);
            setError("Không thể tìm kiếm. Vui lòng đăng nhập để tra cứu vé.");
        } finally {
            setLoading(false);
        }
    };

    // Status badge
    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" /> Chờ thanh toán
                    </Badge>
                );
            case "CONFIRMED":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Đã xác nhận
                    </Badge>
                );
            case "CANCELLED":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <XCircle className="w-3 h-3 mr-1" /> Đã hủy
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 font-sans">
            <div className="mx-auto max-w-2xl px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <Ticket className="w-8 h-8 text-orange-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Tra cứu vé xe</h1>
                    <p className="text-slate-500 mt-2">Kiểm tra thông tin và trạng thái vé đã đặt</p>
                </div>

                {/* Search Card */}
                <Card className="shadow-lg mb-8">
                    <CardHeader>
                        <CardTitle>Nhập thông tin tra cứu</CardTitle>
                        <CardDescription>Tra cứu bằng mã vé hoặc số điện thoại đặt vé</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Search method tabs */}
                        <Tabs value={searchMethod} onValueChange={(v) => setSearchMethod(v as "phone" | "code")}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="code">Mã vé</TabsTrigger>
                                <TabsTrigger value="phone">Số điện thoại</TabsTrigger>
                            </TabsList>

                            <TabsContent value="code" className="mt-4">
                                <div className="space-y-2">
                                    <Label>Mã vé (Booking ID)</Label>
                                    <Input
                                        type="text"
                                        placeholder="VD: 12345"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="phone" className="mt-4">
                                <div className="space-y-2">
                                    <Label>Số điện thoại</Label>
                                    <Input
                                        type="tel"
                                        placeholder="VD: 0901234567"
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>

                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                        )}

                        <Button
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            size="lg"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang tìm kiếm...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4 mr-2" />
                                    Tra cứu
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results */}
                {searched && !loading && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Kết quả tra cứu ({bookings.length} vé)
                        </h2>

                        {bookings.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500">
                                        {isLoggedIn()
                                            ? "Không tìm thấy vé nào với thông tin này"
                                            : "Vui lòng đăng nhập để tra cứu vé của bạn"}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            bookings.map((booking) => (
                                <Card key={booking.id} className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Bus Image */}
                                            <div className="relative w-full md:w-32 h-24 md:h-auto shrink-0 bg-slate-100">
                                                <img
                                                    src={booking.trip.bus.main_image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=200"}
                                                    alt="Bus"
                                                    className="h-full w-full object-cover"
                                                />
                                                <Badge className="absolute top-2 left-2 bg-orange-500">
                                                    #{booking.id}
                                                </Badge>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-slate-900">
                                                        {booking.trip.route.origin} → {booking.trip.route.destination}
                                                    </h3>
                                                    <StatusBadge status={booking.status} />
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4 text-orange-500" />
                                                        {formatDate(booking.trip.departure_time)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4 text-orange-500" />
                                                        {formatTime(booking.trip.departure_time)}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Bus className="w-4 h-4 text-slate-400" />
                                                        Ghế {booking.seat_number}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4 text-green-500" />
                                                        {booking.pickup_point.name}
                                                    </div>
                                                </div>

                                                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                                                    <span className="text-lg font-bold text-orange-600">
                                                        {booking.price_paid.toLocaleString()}đ
                                                    </span>
                                                    <Button size="sm" variant="outline">
                                                        Xem chi tiết
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
