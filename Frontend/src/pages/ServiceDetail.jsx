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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Đang tải thông tin dịch vụ...</p>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 rounded-xl p-8 max-w-md mx-auto">
                        <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div className="text-red-600 mb-6 font-medium text-lg">{error || 'Không tìm thấy dịch vụ'}</div>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Quay lại
                            </button>
                            <Link
                                to="/services"
                                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-4">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-gray-500">
                                    <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    <span className="sr-only">Trang chủ</span>
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <Link to="/services" className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700">
                                        Dịch vụ
                                    </Link>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-4 text-sm font-medium text-gray-500" aria-current="page">
                                        {service.name}
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Service Detail Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Service Image */}
                        <div className="mb-8">
                            <div className="relative rounded-2xl overflow-hidden shadow-lg">
                                <img
                                    src={service.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'}
                                    alt={service.name}
                                    className="w-full h-96 object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/90 backdrop-blur-sm text-primary-700 border border-primary-200">
                                        {service.category}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-2">
                                        {service.averageRating && service.averageRating > 0 ? (
                                            <>
                                                <svg className="w-5 h-5 text-yellow-400 fill-current mr-2" viewBox="0 0 20 20">
                                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                </svg>
                                                <span className="text-lg font-medium text-gray-700">
                                                    {service.averageRating.toFixed(1)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-sm font-medium text-gray-500 px-2">
                                                Chưa có đánh giá
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Info */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.name}</h1>

                            <div className="mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mô tả dịch vụ</h2>
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {service.description}
                                </p>
                            </div>

                            {/* Service Features */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Đặc điểm dịch vụ</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Chất lượng đảm bảo</h3>
                                            <p className="text-sm text-gray-600">Sử dụng vật liệu cao cấp</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Thi công nhanh chóng</h3>
                                            <p className="text-sm text-gray-600">Hoàn thành đúng tiến độ</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Giá cả hợp lý</h3>
                                            <p className="text-sm text-gray-600">Báo giá minh bạch</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75 9.75 0 019.75-9.75z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Bảo hành dài hạn</h3>
                                            <p className="text-sm text-gray-600">Từ 6 tháng đến 2 năm</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Process Steps */}
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quy trình thực hiện</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">
                                            1
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Tư vấn & Khảo sát</h3>
                                            <p className="text-gray-600">Tư vấn miễn phí và khảo sát hiện trạng để đưa ra giải pháp tối ưu</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">
                                            2
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Báo giá & Ký hợp đồng</h3>
                                            <p className="text-gray-600">Báo giá chi tiết, minh bạch và ký kết hợp đồng rõ ràng</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">
                                            3
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Thi công & Giám sát</h3>
                                            <p className="text-gray-600">Thi công chuyên nghiệp với sự giám sát chất lượng liên tục</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 flex-shrink-0">
                                            4
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Nghiệm thu & Bảo hành</h3>
                                            <p className="text-gray-600">Nghiệm thu kỹ lưỡng và cam kết bảo hành dài hạn</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            {/* Price Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                                <div className="text-center mb-6">
                                    <div className="text-4xl font-bold text-primary-600 mb-2">
                                        {service.price.toLocaleString('vi-VN')}đ
                                    </div>
                                    <div className="text-gray-600">Giá dịch vụ</div>
                                </div>

                                {/* Chỉ hiển thị nút đặt dịch vụ cho Customer (role = 0) */}
                                {isLoggedIn && user?.role === 0 && (
                                    <button
                                        onClick={handleBookService}
                                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl mb-4"
                                    >
                                        Đặt dịch vụ ngay
                                    </button>
                                )}

                                {/* Hiển thị thông báo cho Admin và Employee */}
                                {isLoggedIn && user?.role !== 0 && (
                                    <div className="w-full bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-blue-800 font-medium">
                                                {user?.role === 1 ? 'Admin' : user?.role === 2 ? 'Employee' : 'Customer'} không thể đặt dịch vụ
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Hiển thị nút đăng nhập cho user chưa đăng nhập */}
                                {!isLoggedIn && (
                                    <Link
                                        to="/login"
                                        className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl mb-4 block text-center"
                                    >
                                        Đăng nhập để đặt dịch vụ
                                    </Link>
                                )}

                                <div className="text-center">
                                    <Link
                                        to="/contact"
                                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                    >
                                        Cần tư vấn? Liên hệ ngay
                                    </Link>
                                </div>
                            </div>

                            {/* Service Info */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin dịch vụ</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Danh mục:</span>
                                        <span className="font-medium text-gray-900">{service.category}</span>
                                    </div>

                                    {service.averageRating && service.averageRating > 0 && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Đánh giá:</span>
                                            <div className="flex items-center">
                                                <svg className="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                </svg>
                                                <span className="font-medium text-gray-900">{service.averageRating.toFixed(1)}/5</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Thời gian:</span>
                                        <span className="font-medium text-gray-900">Theo dự án</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Bảo hành:</span>
                                        <span className="font-medium text-gray-900">6-24 tháng</span>
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
