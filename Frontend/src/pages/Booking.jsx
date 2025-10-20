import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/LoadingSpinner';

const Booking = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuthStore();

    const [service, setService] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        address: '',
        hireAt: '',
        note: ''
    });

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        if (!serviceId || isNaN(serviceId)) {
            setError('ID dịch vụ không hợp lệ.');
            setIsLoading(false);
            return;
        }

        fetchService();
    }, [serviceId, isLoggedIn, navigate]);

    const fetchService = async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await axiosInstance.get(`/services/${serviceId}`);

            if (response.data.code === 1000) {
                setService(response.data.result);
            } else {
                setError('Không thể tải thông tin dịch vụ. Dịch vụ có thể không tồn tại.');
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setError('Dịch vụ không tồn tại hoặc đã bị xóa.');
            } else if (error.response?.status === 403) {
                setError('Bạn không có quyền truy cập dịch vụ này.');
            } else {
                setError('Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        // Validate form data
        if (!formData.address.trim()) {
            setError('Vui lòng nhập địa chỉ thực hiện dịch vụ.');
            setIsSubmitting(false);
            return;
        }

        if (!formData.hireAt) {
            setError('Vui lòng chọn thời gian thực hiện dịch vụ.');
            setIsSubmitting(false);
            return;
        }

        // Check if selected time is in the future
        const selectedTime = new Date(formData.hireAt);
        const now = new Date();
        if (selectedTime <= now) {
            setError('Thời gian thực hiện dịch vụ phải là thời gian trong tương lai.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Check if user is logged in and has valid token
            if (!isLoggedIn || !user) {
                setError('Vui lòng đăng nhập để đặt dịch vụ.');
                toast.error('Vui lòng đăng nhập để đặt dịch vụ.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
                return;
            }

            const bookingData = {
                serviceId: parseInt(serviceId),
                hireAt: new Date(formData.hireAt).toISOString(), // Convert to ISO 8601 format
                address: formData.address.trim(),
                note: formData.note.trim() || "string" // Use "string" as default if empty
            };


            const response = await axiosInstance.post('/bookings', bookingData);

            if (response.data.code === 1000) {
                const successMessage = response.data.result || 'Đặt dịch vụ thành công! Chúng tôi sẽ liên hệ lại sớm nhất.';
                setSuccess(successMessage);
                toast.success(successMessage);

                // Navigate to booking history after 3 seconds
                setTimeout(() => {
                    navigate('/booking-history');
                }, 3000);
            } else {
                const errorMessage = response.data.message || 'Đặt dịch vụ thất bại. Vui lòng thử lại.';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            let errorMessage = 'Đặt dịch vụ thất bại. Vui lòng thử lại.';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else if (error.response?.status === 403) {
                errorMessage = 'Bạn không có quyền thực hiện hành động này. Vui lòng kiểm tra lại tài khoản.';
            } else if (error.response?.status === 400) {
                errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
            } else if (error.response?.status === 500) {
                errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
                    <LoadingSpinner size="lg" />
                    <p className="mt-6 text-gray-600 text-xl font-medium">Đang tải thông tin dịch vụ...</p>
                </div>
            </div>
        );
    }

    if (error && !service) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-white/20">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                        <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4">Không thể tải trang đặt lịch</h1>
                    <p className="text-red-600 mb-8 text-lg">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 font-bold text-lg"
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={() => navigate('/services')}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-black text-lg shadow-2xl hover:shadow-3xl"
                        >
                            Xem dịch vụ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Service Info */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                        <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                                📋 Thông tin dịch vụ
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-8">Thông tin dịch vụ</h1>

                        <img
                            src={service.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'}
                            alt={service.name}
                            className="w-full h-80 object-cover rounded-2xl mb-6 shadow-xl"
                            loading="lazy"
                        />

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                                    {service.category}
                                </span>
                                <div className="flex items-center bg-white/80 backdrop-blur-xl rounded-full px-3 py-2 shadow-lg">
                                    {service.averageRating && service.averageRating > 0 ? (
                                        <>
                                            <svg className="w-5 h-5 text-yellow-400 fill-current mr-2" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                            <span className="text-sm font-bold text-gray-800">{service.averageRating.toFixed(1)}</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-bold text-gray-500 px-2">Chưa có đánh giá</span>
                                    )}
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-gray-900">{service.name}</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">{service.description}</p>

                            <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                                <div className="text-lg text-gray-600 font-medium">
                                    <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Theo dự án
                                </div>
                                <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {service.price.toLocaleString('vi-VN')}đ
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                        <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                                📝 Đặt dịch vụ
                            </span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-8">Đặt dịch vụ</h1>

                        {success && (
                            <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 border border-green-200">
                                <div className="text-lg text-green-700 font-bold">{success}</div>
                            </div>
                        )}

                        {error && (
                            <div className="mb-8 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 p-6 border border-red-200">
                                <div className="text-lg text-red-700 font-bold">{error}</div>
                            </div>
                        )}

                        {/* Customer Info Display */}
                        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                            <h3 className="text-2xl font-black text-gray-900 mb-6">Thông tin khách hàng</h3>
                            <div className="space-y-4 text-lg">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">Họ và tên:</span>
                                    <span className="font-black text-gray-900">{user?.fullname}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">Email:</span>
                                    <span className="font-black text-gray-900">{user?.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">Số điện thoại:</span>
                                    <span className="font-black text-gray-900">{user?.phoneNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 font-medium">Vai trò:</span>
                                    <span className="font-black text-gray-900">
                                        {useAuthStore.getState().getRoleName()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label htmlFor="address" className="block text-lg font-bold text-gray-800 mb-3">
                                    Địa chỉ thực hiện dịch vụ *
                                </label>
                                <textarea
                                    name="address"
                                    id="address"
                                    rows={4}
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="block w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-xl"
                                    placeholder="Nhập địa chỉ chi tiết nơi thực hiện dịch vụ..."
                                    required
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Ví dụ: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
                                </p>
                            </div>

                            <div>
                                <label htmlFor="hireAt" className="block text-lg font-bold text-gray-800 mb-3">
                                    Thời gian thực hiện dịch vụ *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="hireAt"
                                    id="hireAt"
                                    value={formData.hireAt}
                                    onChange={handleChange}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="block w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-xl"
                                    required
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    Chọn ngày và giờ phù hợp để thực hiện dịch vụ. Thời gian phải là trong tương lai.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="note" className="block text-lg font-bold text-gray-800 mb-3">
                                    Ghi chú thêm
                                </label>
                                <textarea
                                    name="note"
                                    id="note"
                                    rows={4}
                                    value={formData.note}
                                    onChange={handleChange}
                                    className="block w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl shadow-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-xl"
                                    placeholder="Nhập ghi chú thêm về yêu cầu dịch vụ (không bắt buộc)..."
                                />
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200">
                                <h3 className="text-2xl font-black text-gray-900 mb-6">Tóm tắt đơn hàng</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Dịch vụ:</span>
                                        <span className="font-black text-gray-900">{service.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Thời gian:</span>
                                        <span className="font-black text-gray-900">
                                            {formData.hireAt ? new Date(formData.hireAt).toLocaleString('vi-VN') : 'Chưa chọn'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Địa chỉ:</span>
                                        <span className="font-black text-gray-900 text-right max-w-xs truncate">
                                            {formData.address || 'Chưa nhập'}
                                        </span>
                                    </div>
                                    <hr className="my-4 border-gray-300" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-black text-gray-900">Tổng cộng:</span>
                                        <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {service.price.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.address.trim() || !formData.hireAt}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black py-6 px-8 text-2xl rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 shadow-2xl hover:shadow-3xl disabled:transform-none"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <LoadingSpinner size="sm" />
                                        <span className="ml-3">Đang xử lý...</span>
                                    </div>
                                ) : (
                                    'Đặt dịch vụ ngay'
                                )}
                            </button>

                            {(!formData.address.trim() || !formData.hireAt) && (
                                <p className="text-lg text-gray-500 text-center mt-4 font-medium">
                                    Vui lòng điền đầy đủ thông tin bắt buộc để tiếp tục
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
