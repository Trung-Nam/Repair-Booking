import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import useAuthStore from '../../store/useAuthStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const RateService = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [hasRated, setHasRated] = useState(false);

    const [formData, setFormData] = useState({
        rating: 5,
        comment: ''
    });

    useEffect(() => {
        // Kiểm tra role - chỉ CUSTOMER mới có thể đánh giá
        if (user?.role !== 0) {
            navigate('/');
            toast.error('Chỉ khách hàng mới có thể đánh giá dịch vụ');
            return;
        }

        fetchBooking();
    }, [bookingId, user, navigate]);

    const fetchBooking = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(`/bookings/${bookingId}`);

            if (response.data.code === 1000) {
                const bookingData = response.data.result;
                setBooking(bookingData);

                // Kiểm tra xem booking có status COMPLETED không
                if (bookingData.status !== 2) {
                    setError('Chỉ có thể đánh giá dịch vụ đã hoàn thành');
                    return;
                }

                // Kiểm tra xem đã đánh giá chưa
                await checkExistingRating(bookingData.serviceId);
            } else {
                setError('Không tìm thấy đơn đặt dịch vụ');
            }
        } catch (error) {
            setError('Không thể tải thông tin đơn đặt dịch vụ');
        } finally {
            setIsLoading(false);
        }
    };

    const checkExistingRating = async (serviceId) => {
        try {
            // Kiểm tra xem customer đã đánh giá service này chưa
            const response = await axiosInstance.get(`/rating/check?serviceId=${serviceId}&customerId=${user.id}`);
            if (response.data.code === 1000 && response.data.result.hasRated) {
                setHasRated(true);
                setError('Bạn đã đánh giá dịch vụ này rồi. Mỗi khách hàng chỉ được đánh giá 1 lần cho mỗi dịch vụ.');
            }
        } catch (error) {
            // Nếu API không tồn tại hoặc lỗi, coi như chưa đánh giá
            console.warn('Could not check existing rating:', error);
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

    const handleRatingChange = (rating) => {
        setFormData({
            ...formData,
            rating
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra lại role và trạng thái đánh giá
        if (user?.role !== 0) {
            toast.error('Chỉ khách hàng mới có thể đánh giá dịch vụ');
            return;
        }

        if (hasRated) {
            toast.error('Bạn đã đánh giá dịch vụ này rồi');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const ratingData = {
                bookingId: parseInt(bookingId),
                rate: formData.rating,
                comment: formData.comment
            };

            const response = await axiosInstance.post('/rating', ratingData);

            if (response.data.code === 1000) {
                const successMessage = 'Cảm ơn bạn đã đánh giá! Đánh giá của bạn rất quan trọng với chúng tôi.';
                setSuccess(successMessage);
                toast.success(successMessage);
                setHasRated(true);

                // Navigate back to booking history after 3 seconds
                setTimeout(() => {
                    navigate('/booking-history');
                }, 3000);
            } else {
                throw new Error(response.data.message || 'Gửi đánh giá thất bại');
            }
        } catch (error) {
            let errorMessage = 'Gửi đánh giá thất bại. Vui lòng thử lại.';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 400) {
                errorMessage = 'Dữ liệu đánh giá không hợp lệ';
            } else if (error.response?.status === 403) {
                errorMessage = 'Bạn không có quyền đánh giá dịch vụ này';
            } else if (error.response?.status === 409) {
                errorMessage = 'Bạn đã đánh giá dịch vụ này rồi';
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const StarRating = ({ rating, onRatingChange, readonly = false }) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => !readonly && onRatingChange(star)}
                        disabled={readonly}
                        className={`w-8 h-8 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                            } transition-transform`}
                    >
                        <svg
                            className={`w-full h-full ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                ))}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error && !booking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 mb-4">{error}</div>
                    <button
                        onClick={() => navigate('/booking-history')}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md"
                    >
                        Quay lại lịch sử đặt
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đánh giá dịch vụ</h1>
                        <p className="text-gray-600">Chia sẻ trải nghiệm của bạn về dịch vụ</p>
                    </div>

                    {/* Booking Info */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin dịch vụ</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Dịch vụ:</span>
                                <span className="font-medium">{booking.serviceName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Ngày thực hiện:</span>
                                <span className="font-medium">
                                    {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Khung giờ:</span>
                                <span className="font-medium">{booking.timeSlot}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Địa chỉ:</span>
                                <span className="font-medium text-right max-w-xs">{booking.address}</span>
                            </div>
                        </div>
                    </div>

                    {success && (
                        <div className="mb-6 rounded-md bg-green-50 p-4">
                            <div className="text-sm text-green-700">{success}</div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    {hasRated ? (
                        <div className="text-center py-8">
                            <div className="text-green-600 text-lg font-medium mb-4">
                                ✅ Bạn đã đánh giá dịch vụ này rồi
                            </div>
                            <p className="text-gray-600 mb-6">
                                Cảm ơn bạn đã đánh giá! Mỗi khách hàng chỉ được đánh giá 1 lần cho mỗi dịch vụ.
                            </p>
                            <button
                                onClick={() => navigate('/booking-history')}
                                className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-6 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Quay lại lịch sử đặt
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Đánh giá của bạn *
                                </label>
                                <StarRating
                                    rating={formData.rating}
                                    onRatingChange={handleRatingChange}
                                    readonly={isSubmitting}
                                />
                                <div className="mt-2 text-sm text-gray-500">
                                    {formData.rating === 5 && 'Tuyệt vời!'}
                                    {formData.rating === 4 && 'Rất tốt!'}
                                    {formData.rating === 3 && 'Tốt'}
                                    {formData.rating === 2 && 'Tạm được'}
                                    {formData.rating === 1 && 'Không hài lòng'}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nhận xét chi tiết
                                </label>
                                <textarea
                                    name="comment"
                                    id="comment"
                                    rows={4}
                                    value={formData.comment}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Nhận xét của bạn sẽ giúp chúng tôi cải thiện chất lượng dịch vụ.
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/booking-history')}
                                    disabled={isSubmitting}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? <LoadingSpinner size="sm" /> : 'Gửi đánh giá'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RateService;
