"use client";

import * as React from "react";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    MessageCircle,
    Facebook,
    Instagram,
    Youtube,
    Loader2,
    CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// FAQ Data
const faqData = [
    {
        question: "Làm thế nào để đặt vé xe?",
        answer: "Bạn có thể đặt vé trực tiếp trên website bằng cách chọn điểm đi, điểm đến, ngày khởi hành và số lượng vé. Sau đó chọn chuyến xe phù hợp và tiến hành thanh toán.",
    },
    {
        question: "Tôi có thể hủy vé sau khi đã đặt không?",
        answer: "Có, bạn có thể hủy vé trước giờ khởi hành. Chính sách hoàn tiền phụ thuộc vào thời gian hủy: trước 24h được hoàn 100%, trước 12h được hoàn 70%, trước 6h được hoàn 50%.",
    },
    {
        question: "Phương thức thanh toán nào được chấp nhận?",
        answer: "Chúng tôi hỗ trợ thanh toán qua ví điện tử MoMo, chuyển khoản ngân hàng, và thanh toán khi lên xe (tùy nhà xe).",
    },
    {
        question: "Tôi cần mang theo gì khi lên xe?",
        answer: "Bạn cần mang theo CMND/CCCD và mã vé (có thể hiển thị trên điện thoại). Đối với trẻ em dưới 6 tuổi, cần có người lớn đi kèm.",
    },
    {
        question: "Làm sao để liên hệ nhà xe?",
        answer: "Bạn có thể xem thông tin liên hệ nhà xe trong chi tiết chuyến xe khi đặt vé, hoặc liên hệ hotline của chúng tôi để được hỗ trợ.",
    },
];

export default function ContactPage() {
    const [formState, setFormState] = React.useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [sending, setSending] = React.useState(false);
    const [sent, setSent] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setSending(false);
        setSent(true);

        // Reset form
        setFormState({ name: "", email: "", phone: "", subject: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold mb-4">Liên hệ với chúng tôi</h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc của bạn
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-6">
                                {/* Hotline */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Hotline</h3>
                                        <p className="text-2xl font-bold text-orange-600">1900 888 888</p>
                                        <p className="text-sm text-slate-500">Miễn phí cuộc gọi</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Email</h3>
                                        <p className="text-slate-600">support@vexereclone.vn</p>
                                        <p className="text-sm text-slate-500">Phản hồi trong 24h</p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Địa chỉ</h3>
                                        <p className="text-slate-600">123 Nguyễn Văn Linh, Quận 7</p>
                                        <p className="text-slate-600">TP. Hồ Chí Minh</p>
                                    </div>
                                </div>

                                {/* Working hours */}
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Giờ làm việc</h3>
                                        <p className="text-slate-600">Thứ 2 - Chủ nhật</p>
                                        <p className="text-slate-600">6:00 - 22:00</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Kết nối với chúng tôi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-3">
                                    <Button variant="outline" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                                        <Facebook className="w-5 h-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200">
                                        <Instagram className="w-5 h-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200">
                                        <Youtube className="w-5 h-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="rounded-full hover:bg-green-50 hover:text-green-600 hover:border-green-200">
                                        <MessageCircle className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle>Gửi tin nhắn cho chúng tôi</CardTitle>
                                <CardDescription>
                                    Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong thời gian sớm nhất
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {sent ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Gửi thành công!</h3>
                                        <p className="text-slate-600 mb-6">
                                            Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi qua email trong 24 giờ.
                                        </p>
                                        <Button onClick={() => setSent(false)} variant="outline">
                                            Gửi tin nhắn khác
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Họ và tên *</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formState.name}
                                                    onChange={handleChange}
                                                    placeholder="Nguyễn Văn A"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Số điện thoại *</Label>
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    value={formState.phone}
                                                    onChange={handleChange}
                                                    placeholder="0901234567"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formState.email}
                                                onChange={handleChange}
                                                placeholder="email@example.com"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Chủ đề</Label>
                                            <Select
                                                value={formState.subject}
                                                onValueChange={(v) => setFormState({ ...formState, subject: v })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn chủ đề" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="booking">Hỗ trợ đặt vé</SelectItem>
                                                    <SelectItem value="refund">Hoàn/hủy vé</SelectItem>
                                                    <SelectItem value="complaint">Khiếu nại</SelectItem>
                                                    <SelectItem value="partnership">Hợp tác</SelectItem>
                                                    <SelectItem value="other">Khác</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Nội dung *</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                value={formState.message}
                                                onChange={handleChange}
                                                placeholder="Nhập nội dung tin nhắn..."
                                                rows={5}
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-orange-600 hover:bg-orange-700"
                                            size="lg"
                                            disabled={sending}
                                        >
                                            {sending ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Đang gửi...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Gửi tin nhắn
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">Câu hỏi thường gặp</h2>
                        <p className="text-slate-600 mt-2">Tìm câu trả lời nhanh cho những thắc mắc phổ biến</p>
                    </div>

                    <Card className="max-w-3xl mx-auto">
                        <CardContent className="p-6">
                            <Accordion type="single" collapsible className="w-full">
                                {faqData.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-left hover:text-orange-600">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-slate-600">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
