import { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const contactInfo = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Địa chỉ',
            content: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
            description: 'Trụ sở chính của công ty'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: 'Điện thoại',
            content: '0123 456 789',
            description: 'Hotline hỗ trợ 24/7'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Email',
            content: 'info@repairbooking.com.vn',
            description: 'Liên hệ qua email'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Giờ làm việc',
            content: 'Thứ 2 - Thứ 6: 8:00 - 18:00',
            description: 'Thứ 7: 8:00 - 12:00'
        }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            toast.error('Gửi liên hệ thất bại. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.12),transparent_50%)]"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center px-6 py-3 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm">
                                <span className="text-purple-200 text-sm font-medium">Liên hệ</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black leading-tight">
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Liên hệ với chúng tôi</span>
                            </h1>
                            <p className="text-xl text-purple-200 max-w-2xl">
                                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ để được tư vấn miễn phí!
                            </p>
                        </div>
                        <div className="relative">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <div className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-1">24/7</div>
                                        <div className="text-purple-200 text-sm">Hỗ trợ</div>
                                    </div>
                                    <div className="text-center bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <div className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-1">1000+</div>
                                        <div className="text-purple-200 text-sm">Khách hàng</div>
                                    </div>
                                    <div className="text-center bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <div className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-1">15+</div>
                                        <div className="text-purple-200 text-sm">Năm kinh nghiệm</div>
                                    </div>
                                    <div className="text-center bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <div className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-1">50+</div>
                                        <div className="text-purple-200 text-sm">Nhân viên</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div>
                        <h2 className="text-3xl font-black mb-8">Thông tin liên hệ</h2>
                        <div className="space-y-6">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="flex items-start space-x-4 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:bg-white/20 transition-all">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                        {info.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">{info.title}</h3>
                                        <p className="text-purple-100 font-medium mb-1">{info.content}</p>
                                        <p className="text-purple-200 text-sm">{info.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Map Placeholder */}
                        <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl h-64 border border-white/20 flex items-center justify-center">
                            <div className="text-center text-purple-200">
                                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-lg font-bold text-white">Bản đồ vị trí</p>
                                <p className="text-sm">123 Đường ABC, Quận 1, TP. Hồ Chí Minh</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                            <h2 className="text-3xl font-black text-white mb-6">Gửi tin nhắn</h2>
                            <p className="text-purple-200 mb-8">
                                Hãy điền thông tin bên dưới và chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-bold text-white mb-2">
                                            Họ và tên *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/5 backdrop-blur-xl text-white placeholder-gray-300"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/5 backdrop-blur-xl text-white placeholder-gray-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-bold text-white mb-2">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/5 backdrop-blur-xl text-white placeholder-gray-300"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-bold text-white mb-2">
                                        Chủ đề *
                                    </label>
                                    <select
                                        name="subject"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/5 backdrop-blur-xl text-white"
                                        required
                                    >
                                        <option value="" className="bg-gray-800 text-white">Chọn chủ đề</option>
                                        <option value="tuvan" className="bg-gray-800 text-white">Tư vấn dịch vụ</option>
                                        <option value="baogia" className="bg-gray-800 text-white">Báo giá</option>
                                        <option value="khieunai" className="bg-gray-800 text-white">Khiếu nại</option>
                                        <option value="gop_y" className="bg-gray-800 text-white">Góp ý</option>
                                        <option value="khac" className="bg-gray-800 text-white">Khác</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-bold text-white mb-2">
                                        Nội dung tin nhắn *
                                    </label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 bg-white/5 backdrop-blur-xl text-white placeholder-gray-300"
                                        placeholder="Mô tả chi tiết yêu cầu của bạn..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-white mb-4">Câu hỏi thường gặp</h2>
                        <p className="text-lg text-purple-200">Những câu hỏi phổ biến mà khách hàng thường hỏi</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold text-white mb-3">Làm thế nào để đặt dịch vụ?</h3>
                                <p className="text-purple-200">
                                    Bạn có thể đặt dịch vụ trực tiếp trên website hoặc gọi hotline 0123 456 789.
                                    Chúng tôi sẽ liên hệ lại để tư vấn chi tiết.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold text-white mb-3">Thời gian thi công bao lâu?</h3>
                                <p className="text-purple-200">
                                    Thời gian thi công tùy thuộc vào quy mô công trình. Dự án nhỏ thường hoàn thành
                                    trong 1-3 ngày, dự án lớn có thể mất 1-2 tuần.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold text-white mb-3">Có bảo hành không?</h3>
                                <p className="text-purple-200">
                                    Tất cả dịch vụ đều có bảo hành từ 6 tháng đến 2 năm tùy theo loại công việc.
                                    Chúng tôi cam kết sửa chữa miễn phí nếu có lỗi do thi công.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold text-white mb-3">Thanh toán như thế nào?</h3>
                                <p className="text-purple-200">
                                    Chúng tôi chấp nhận thanh toán bằng tiền mặt, chuyển khoản hoặc thẻ tín dụng.
                                    Có thể thanh toán trước 50% và 50% sau khi hoàn thành.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold text-white mb-3">Có làm việc cuối tuần không?</h3>
                                <p className="text-purple-200">
                                    Chúng tôi làm việc từ thứ 2 đến thứ 6 (8:00-18:00) và thứ 7 (8:00-12:00).
                                    Có thể sắp xếp làm việc ngoài giờ nếu cần thiết.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold text-white mb-3">Có tư vấn miễn phí không?</h3>
                                <p className="text-purple-200">
                                    Chúng tôi cung cấp dịch vụ tư vấn miễn phí tại nhà. Chỉ thu phí khảo sát
                                    nếu bạn không sử dụng dịch vụ của chúng tôi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;


