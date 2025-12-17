"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock news data
const newsData = [
    {
        id: 1,
        title: "Khai trương tuyến xe Limousine Hà Nội - Sapa với giá ưu đãi",
        excerpt: "Chào mừng tuyến mới với nhiều ưu đãi hấp dẫn. Giảm 20% cho khách hàng đặt vé trong tuần đầu tiên.",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600",
        category: "Khuyến mãi",
        date: "2024-12-15",
        readTime: "3 phút",
    },
    {
        id: 2,
        title: "Hướng dẫn đặt vé online nhanh chóng chỉ trong 2 phút",
        excerpt: "Bài viết hướng dẫn chi tiết các bước đặt vé xe trên hệ thống, từ tìm kiếm đến thanh toán.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600",
        category: "Hướng dẫn",
        date: "2024-12-12",
        readTime: "5 phút",
    },
    {
        id: 3,
        title: "Top 10 địa điểm du lịch hot nhất mùa đông 2024",
        excerpt: "Khám phá những điểm đến tuyệt vời cho chuyến du lịch cuối năm cùng gia đình và bạn bè.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600",
        category: "Du lịch",
        date: "2024-12-10",
        readTime: "7 phút",
    },
    {
        id: 4,
        title: "Chương trình tích điểm đổi vé miễn phí",
        excerpt: "Thành viên tích lũy điểm qua mỗi chuyến đi và đổi vé xe hoàn toàn miễn phí.",
        image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600",
        category: "Khuyến mãi",
        date: "2024-12-08",
        readTime: "4 phút",
    },
    {
        id: 5,
        title: "Ra mắt ứng dụng di động - Đặt vé mọi lúc mọi nơi",
        excerpt: "Tải ngay ứng dụng VexereClone trên iOS và Android để trải nghiệm đặt vé tiện lợi hơn.",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600",
        category: "Tin tức",
        date: "2024-12-05",
        readTime: "2 phút",
    },
    {
        id: 6,
        title: "Lựa chọn ghế ngồi phù hợp khi đi xe đường dài",
        excerpt: "Mẹo chọn vị trí ghế thoải mái nhất cho các chuyến xe giường nằm và Limousine.",
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600",
        category: "Hướng dẫn",
        date: "2024-12-01",
        readTime: "4 phút",
    },
];

const categories = ["Tất cả", "Khuyến mãi", "Tin tức", "Hướng dẫn", "Du lịch"];

export default function NewsPage() {
    const [activeCategory, setActiveCategory] = React.useState("Tất cả");
    const [searchQuery, setSearchQuery] = React.useState("");

    // Filter news
    const filteredNews = newsData.filter((news) => {
        const matchCategory = activeCategory === "Tất cả" || news.category === activeCategory;
        const matchSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    // Format date
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Tin tức & Khuyến mãi</h1>
                    <p className="text-orange-100 text-lg max-w-2xl mx-auto">
                        Cập nhật những thông tin mới nhất về các chương trình ưu đãi, hướng dẫn và mẹo du lịch
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                        <TabsList className="flex-wrap h-auto gap-1">
                            {categories.map((cat) => (
                                <TabsTrigger key={cat} value={cat} className="text-sm">
                                    {cat}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Featured Article */}
                {filteredNews.length > 0 && activeCategory === "Tất cả" && !searchQuery && (
                    <Card className="overflow-hidden mb-8 group cursor-pointer hover:shadow-xl transition-shadow">
                        <div className="flex flex-col lg:flex-row">
                            <div className="relative lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                                <img
                                    src={filteredNews[0].image}
                                    alt={filteredNews[0].title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <Badge className="absolute top-4 left-4 bg-orange-500">
                                    {filteredNews[0].category}
                                </Badge>
                            </div>
                            <CardContent className="lg:w-1/2 p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(filteredNews[0].date)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {filteredNews[0].readTime}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">
                                    {filteredNews[0].title}
                                </h2>
                                <p className="text-slate-600 mb-6">{filteredNews[0].excerpt}</p>
                                <Button className="w-fit bg-orange-600 hover:bg-orange-700">
                                    Đọc tiếp <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </div>
                    </Card>
                )}

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(activeCategory === "Tất cả" && !searchQuery ? filteredNews.slice(1) : filteredNews).map((news) => (
                        <Card key={news.id} className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={news.image}
                                    alt={news.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <Badge className="absolute top-3 left-3 bg-white/90 text-slate-700 backdrop-blur-sm">
                                    <Tag className="w-3 h-3 mr-1" />
                                    {news.category}
                                </Badge>
                            </div>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(news.date)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {news.readTime}
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                    {news.title}
                                </h3>
                                <p className="text-sm text-slate-600 line-clamp-2 mb-4">{news.excerpt}</p>
                                <span className="text-sm font-medium text-orange-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Đọc thêm <ArrowRight className="w-4 h-4" />
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredNews.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-slate-500">Không tìm thấy bài viết nào</p>
                    </div>
                )}

                {/* Load More */}
                {filteredNews.length > 0 && (
                    <div className="text-center mt-12">
                        <Button variant="outline" size="lg">
                            Xem thêm bài viết
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
