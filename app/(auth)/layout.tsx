import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Container chính: Sử dụng CSS Grid để chia 2 cột bằng nhau trên màn hình lớn
    <div className="min-h-screen w-full grid lg:grid-cols-2">

      {/* --- CỘT TRÁI: FORM --- */}
      {/* Thêm h-full để đảm bảo cột này luôn cao ít nhất bằng màn hình */}
      <div className="flex flex-col justify-center h-full px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-white relative z-10">
        <Link href="/" className="absolute top-8 left-8 flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Link>
        <div className="mx-auto w-full max-w-sm lg:w-96">
            {children}
        </div>
      </div>

      {/* --- CỘT PHẢI: IMAGE BANNER --- */}
      {/* FIX: Bỏ các class 'w-0 flex-1' gây lỗi co ảnh. 
          Chỉ cần 'hidden lg:block relative h-full' là đủ để CSS Grid xử lý.
      */}
      <div className="hidden lg:block relative h-full w-full overflow-hidden bg-slate-900">
        <img
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          // Sử dụng ảnh có chiều dọc tốt hơn cho banner
          src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1974&auto=format&fit=crop"
          alt="Bus Travel Landscape"
        />
        
        {/* Overlay gradient tối dần xuống dưới để làm nổi bật text */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-slate-900/20" />

        {/* Nội dung text trên ảnh */}
        <div className="absolute inset-0 flex items-end p-16">
            <div className="text-white max-w-lg">
                <h2 className="text-3xl font-extrabold mb-4 tracking-tight leading-tight">
                    Mọi hành trình vạn dặm <br/> đều bắt đầu từ một bước chân.
                </h2>
                <p className="text-slate-200 text-lg leading-relaxed opacity-90">
                    Kết nối hàng triệu hành khách với những nhà xe uy tín nhất. Đặt vé dễ dàng, di chuyển an tâm.
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}