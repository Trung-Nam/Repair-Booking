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

                // Navigate to booking history immediately
                setTimeout(() => {
                    navigate('/booking-history');
                }, 1500);
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
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
                    <LoadingSpinner size="lg" />
                    <p className="mt-6 text-purple-200 text-xl font-medium">Đang tải thông tin dịch vụ...</p>
                </div>
            </div>
        );
    }

    if (error && !service) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
                <div className="max-w-lg w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-white/20">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-500/20 mb-6">
                        <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-white mb-4">Không thể tải trang đặt lịch</h1>
                    <p className="text-red-200 mb-8 text-lg">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-8 py-4 border-2 border-white/30 rounded-2xl text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105 font-bold text-lg"
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={() => navigate('/services')}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-black text-lg shadow-2xl hover:shadow-3xl"
                        >
                            Xem dịch vụ
                        </button>
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
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm mb-6">
                            <span className="text-purple-200 text-sm font-medium">📋 Đặt dịch vụ</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-6">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Đặt dịch vụ</span>
                        </h1>
                        <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
                            Điền thông tin chi tiết để đặt dịch vụ {service.name}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Service Info */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                        <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                                📋 Thông tin dịch vụ
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-8">Thông tin dịch vụ</h2>

                        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 group">
                            <img
                                src={service.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'}
                                alt={service.name}
                                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
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
                                            <span className="text-sm font-bold text-gray-800">{service.averageRating.toFixed(1)}</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-bold text-gray-600 px-2">Chưa có đánh giá</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-white">{service.name}</h3>
                            <p className="text-purple-200 text-lg leading-relaxed">{service.description}</p>

                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30">
                                <div className="flex items-center justify-between">
                                    <div className="text-lg text-purple-200 font-medium">
                                        <svg className="w-6 h-6 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Theo dự án
                                    </div>
                                    <div className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                                        {service.price.toLocaleString('vi-VN')}đ
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                        <div className="mb-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                                📝 Đặt dịch vụ
                            </span>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-8">Đặt dịch vụ</h2>

                        {success && (
                            <div className="mb-8 rounded-2xl bg-green-500/20 backdrop-blur-xl p-6 border border-green-400/30">
                                <div className="text-lg text-green-200 font-bold">{success}</div>
                            </div>
                        )}

                        {error && (
                            <div className="mb-8 rounded-2xl bg-red-500/20 backdrop-blur-xl p-6 border border-red-400/30">
                                <div className="text-lg text-red-200 font-bold">{error}</div>
                            </div>
                        )}

                        {/* Customer Info Display */}
                        <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-purple-400/30">
                            <h3 className="text-2xl font-black text-white mb-6">Thông tin khách hàng</h3>
                            <div className="space-y-4 text-lg">
                                <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                    <span className="text-purple-200 font-medium">Họ và tên:</span>
                                    <span className="font-bold text-white">{user?.fullname}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                    <span className="text-purple-200 font-medium">Email:</span>
                                    <span className="font-bold text-white">{user?.email}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                    <span className="text-purple-200 font-medium">Số điện thoại:</span>
                                    <span className="font-bold text-white">{user?.phoneNumber}</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                    <span className="text-purple-200 font-medium">Vai trò:</span>
                                    <span className="font-bold text-white">
                                        {useAuthStore.getState().getRoleName()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label htmlFor="address" className="block text-lg font-bold text-white mb-3">
                                    Địa chỉ thực hiện dịch vụ *
                                </label>
                                <textarea
                                    name="address"
                                    id="address"
                                    rows={4}
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="block w-full px-6 py-4 text-lg border-2 border-white/30 rounded-2xl shadow-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/5 backdrop-blur-xl text-white placeholder-gray-300"
                                    placeholder="Nhập địa chỉ chi tiết nơi thực hiện dịch vụ..."
                                    required
                                    style={{ color: 'white !important' }}
                                />
                                <p className="mt-2 text-sm text-purple-200">
                                    Ví dụ: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
                                </p>
                            </div>

                            <div>
                                <label htmlFor="hireAt" className="block text-lg font-bold text-white mb-3">
                                    Thời gian thực hiện dịch vụ *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="hireAt"
                                    id="hireAt"
                                    value={formData.hireAt}
                                    onChange={handleChange}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="block w-full px-6 py-4 text-lg border-2 border-white/30 rounded-2xl shadow-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/5 backdrop-blur-xl text-white"
                                    required
                                    style={{ color: 'white !important' }}
                                />
                                <p className="mt-2 text-sm text-purple-200">
                                    Chọn ngày và giờ phù hợp để thực hiện dịch vụ. Thời gian phải là trong tương lai.
                                </p>
                            </div>

                            <div>
                                <label htmlFor="note" className="block text-lg font-bold text-white mb-3">
                                    Ghi chú thêm
                                </label>
                                <textarea
                                    name="note"
                                    id="note"
                                    rows={4}
                                    value={formData.note}
                                    onChange={handleChange}
                                    className="block w-full px-6 py-4 text-lg border-2 border-white/30 rounded-2xl shadow-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/5 backdrop-blur-xl text-white placeholder-gray-300"
                                    placeholder="Nhập ghi chú thêm về yêu cầu dịch vụ (không bắt buộc)..."
                                    style={{ color: 'white !important' }}
                                />
                            </div>

                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl p-6 rounded-2xl border border-purple-400/30">
                                <h3 className="text-2xl font-black text-white mb-6">Tóm tắt đơn hàng</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                        <span className="text-purple-200 font-medium">Dịch vụ:</span>
                                        <span className="font-bold text-white">{service.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                        <span className="text-purple-200 font-medium">Thời gian:</span>
                                        <span className="font-bold text-white">
                                            {formData.hireAt ? new Date(formData.hireAt).toLocaleString('vi-VN') : 'Chưa chọn'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                        <span className="text-purple-200 font-medium">Địa chỉ:</span>
                                        <span className="font-bold text-white text-right max-w-xs truncate">
                                            {formData.address || 'Chưa nhập'}
                                        </span>
                                    </div>
                                    <hr className="my-4 border-purple-400/30" />
                                    <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                        <span className="text-2xl font-black text-white">Tổng cộng:</span>
                                        <span className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                                            {service.price.toLocaleString('vi-VN')}đ
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !formData.address.trim() || !formData.hireAt}
                                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-black py-6 px-8 text-2xl rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 shadow-2xl hover:shadow-purple-500/25 disabled:transform-none"
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
                                <p className="text-lg text-purple-200 text-center mt-4 font-medium">
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
