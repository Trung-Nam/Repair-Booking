import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../store/useAuthStore';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuthStore();
    const [service, setService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchServiceDetail();
    }, [id]);

    const fetchServiceDetail = async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await axiosInstance.get(`/services/${id}`);

            if (response.data.code === 1000) {
                setService(response.data.result);
            } else {
                setError('Không tìm thấy dịch vụ');
            }
        } catch (error) {
            setError('Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBookService = () => {
        navigate(`/booking/${id}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-purple-200">Đang tải thông tin dịch vụ...</p>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md mx-auto border border-white/20 shadow-2xl">
                        <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div className="text-red-200 mb-6 font-medium text-lg">{error || 'Không tìm thấy dịch vụ'}</div>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 border border-white/30"
                            >
                                Quay lại
                            </button>
                            <Link
                                to="/services"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                            >
                                Xem tất cả dịch vụ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-4">
                            <li>
                                <Link to="/" className="text-purple-300 hover:text-white transition-colors">
                                    <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    <span className="sr-only">Trang chủ</span>
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <Link to="/services" className="ml-4 text-sm font-medium text-purple-300 hover:text-white transition-colors">
                                        Dịch vụ
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-4 text-sm font-medium text-white" aria-current="page">
                                        {service.name}
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {/* Service Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm mb-6">
                            <span className="text-purple-200 text-sm font-medium">🛠️ Chi tiết dịch vụ</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-6">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {service.name}
                            </span>
                        </h1>
                        <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
                            {service.description}
                        </p>
                    </div>
                </div>
            </div>

            {/* Service Detail Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Service Image */}
                        <div className="mb-8">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                                <img
                                    src={service.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'}
                                    alt={service.name}
                                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute top-6 left-6">
                                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                                        {service.category}
                                    </span>
                                </div>
                                <div className="absolute top-6 right-6">
                                    <div className="flex items-center bg-white/90 backdrop-blur-xl rounded-full px-4 py-2 shadow-lg">
                                        {service.averageRating && service.averageRating > 0 ? (
                                            <>
                                                <svg className="w-5 h-5 text-yellow-400 fill-current mr-2" viewBox="0 0 20 20">
                                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                </svg>
                                                <span className="text-lg font-bold text-gray-800">
                                                    {service.averageRating.toFixed(1)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-sm font-bold text-gray-600 px-2">
                                                Chưa có đánh giá
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Features */}
                        <div className="mb-8">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                                <h2 className="text-3xl font-black text-white mb-8 text-center">Đặc điểm dịch vụ</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2">
                                        <div className="flex items-center">
                                            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">Chất lượng đảm bảo</h3>
                                                <p className="text-purple-200">Sử dụng vật liệu cao cấp</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2">
                                        <div className="flex items-center">
                                            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">Thi công nhanh chóng</h3>
                                                <p className="text-purple-200">Hoàn thành đúng tiến độ</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2">
                                        <div className="flex items-center">
                                            <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">Giá cả hợp lý</h3>
                                                <p className="text-purple-200">Báo giá minh bạch</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-2">
                                        <div className="flex items-center">
                                            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75 9.75 0 019.75-9.75z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-2">Bảo hành dài hạn</h3>
                                                <p className="text-purple-200">Từ 6 tháng đến 2 năm</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Process Steps */}
                        <div className="mb-8">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                                <h2 className="text-3xl font-black text-white mb-8 text-center">Quy trình thực hiện</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start group">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            1
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex-1 group-hover:bg-white/10 transition-all duration-300">
                                            <h3 className="text-xl font-bold text-white mb-2">Tư vấn & Khảo sát</h3>
                                            <p className="text-purple-200 leading-relaxed">Tư vấn miễn phí và khảo sát hiện trạng để đưa ra giải pháp tối ưu</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start group">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            2
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex-1 group-hover:bg-white/10 transition-all duration-300">
                                            <h3 className="text-xl font-bold text-white mb-2">Báo giá & Ký hợp đồng</h3>
                                            <p className="text-purple-200 leading-relaxed">Báo giá chi tiết, minh bạch và ký kết hợp đồng rõ ràng</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start group">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            3
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex-1 group-hover:bg-white/10 transition-all duration-300">
                                            <h3 className="text-xl font-bold text-white mb-2">Thi công & Giám sát</h3>
                                            <p className="text-purple-200 leading-relaxed">Thi công chuyên nghiệp với sự giám sát chất lượng liên tục</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start group">
                                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            4
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex-1 group-hover:bg-white/10 transition-all duration-300">
                                            <h3 className="text-xl font-bold text-white mb-2">Nghiệm thu & Bảo hành</h3>
                                            <p className="text-purple-200 leading-relaxed">Nghiệm thu kỹ lưỡng và cam kết bảo hành dài hạn</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Price Card */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                                <div className="text-center mb-8">
                                    <div className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4">
                                        {service.price.toLocaleString('vi-VN')}đ
                                    </div>
                                    <div className="text-purple-200 text-lg font-medium">Giá dịch vụ</div>
                                </div>

                                {/* Chỉ hiển thị nút đặt dịch vụ cho Customer (role = 0) */}
                                {isLoggedIn && user?.role === 0 && (
                                    <button
                                        onClick={handleBookService}
                                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 mb-6"
                                    >
                                        Đặt dịch vụ ngay
                                    </button>
                                )}

                                {/* Hiển thị thông báo cho Admin và Employee */}
                                {isLoggedIn && user?.role !== 0 && (
                                    <div className="w-full bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 rounded-2xl p-4 mb-6">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-blue-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-blue-200 font-medium">
                                                {user?.role === 1 ? 'Admin' : user?.role === 2 ? 'Employee' : 'Customer'} không thể đặt dịch vụ
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Hiển thị nút đăng nhập cho user chưa đăng nhập */}
                                {!isLoggedIn && (
                                    <Link
                                        to="/login"
                                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 mb-6 block text-center"
                                    >
                                        Đăng nhập để đặt dịch vụ
                                    </Link>
                                )}

                                <div className="text-center">
                                    <Link
                                        to="/contact"
                                        className="text-purple-300 hover:text-white font-medium text-sm transition-colors duration-300"
                                    >
                                        Cần tư vấn? Liên hệ ngay
                                    </Link>
                                </div>
                            </div>

                            {/* Service Info */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                                <h3 className="text-2xl font-bold text-white mb-6 text-center">Thông tin dịch vụ</h3>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                        <span className="text-purple-200 font-medium">Danh mục:</span>
                                        <span className="font-bold text-white">{service.category}</span>
                                    </div>

                                    <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                        <span className="text-purple-200 font-medium">Thời gian:</span>
                                        <span className="font-bold text-white">Theo dự án</span>
                                    </div>

                                    <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                        <span className="text-purple-200 font-medium">Bảo hành:</span>
                                        <span className="font-bold text-white">6-24 tháng</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
