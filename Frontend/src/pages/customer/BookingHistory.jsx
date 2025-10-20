import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import useAuthStore from '../../store/useAuthStore';
import LoadingSpinner from '../../components/LoadingSpinner';

// Confirm Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, type = 'danger' }) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600',
                    button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                };
            case 'warning':
                return {
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ),
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-600',
                    button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                };
            case 'danger':
            default:
                return {
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    ),
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                                <div className={styles.iconColor}>
                                    {styles.icon}
                                </div>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={`w-full inline-flex justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm ${styles.button} focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto transition-all duration-200`}
                        >
                            {confirmText || 'Xác nhận'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto transition-all duration-200"
                        >
                            {cancelText || 'Hủy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalItems: 0
    });

    // Rating modal states
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rating, setRating] = useState(0);
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [ratedBookings, setRatedBookings] = useState(new Set());

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'danger',
        onConfirm: null,
        confirmText: '',
        cancelText: 'Hủy'
    });

    const { user } = useAuthStore();

    useEffect(() => {
        fetchBookings();
    }, [pagination.currentPage, pagination.pageSize]);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await axiosInstance.get('/bookings', {
                params: {
                    PageNumber: pagination.currentPage,
                    PageSize: pagination.pageSize
                }
            });

            if (response.data.code === 1000) {
                const result = response.data.result;
                const bookingsData = result.items || [];
                setBookings(bookingsData);
                setPagination(prev => ({
                    ...prev,
                    totalPages: result.totalPages || 1,
                    totalItems: result.totalItems || 0
                }));

                // Kiểm tra xem booking nào đã được đánh giá
                await checkRatedBookings(bookingsData);
            } else {
                setError('Không thể tải lịch sử đặt dịch vụ.');
            }
        } catch (error) {
            setError('Không thể tải lịch sử đặt dịch vụ. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const checkRatedBookings = async (bookingsData) => {
        const ratedSet = new Set();

        // Sử dụng field hasRated từ backend response
        for (const booking of bookingsData) {
            if (booking.hasRated === true) {
                ratedSet.add(booking.id);
            }
        }

        setRatedBookings(ratedSet);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            0: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý' },      // PENDING
            1: { color: 'bg-blue-100 text-blue-800', text: 'Đã chấp nhận' },     // ACCEPTED
            2: { color: 'bg-green-100 text-green-800', text: 'Hoàn thành' },     // COMPLETED
            3: { color: 'bg-red-100 text-red-800', text: 'Đã hủy' }             // CANCELLED
        };

        const config = statusConfig[status] || statusConfig[0];

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({
            ...prev,
            currentPage: newPage
        }));
    };

    const handlePageSizeChange = (newPageSize) => {
        setPagination(prev => ({
            ...prev,
            pageSize: newPageSize,
            currentPage: 1
        }));
    };

    const handleRateService = (booking) => {
        setSelectedBooking(booking);
        setRating(0);
        setIsRatingModalOpen(true);
    };

    const handleCancelBooking = async (booking) => {
        setConfirmModal({
            isOpen: true,
            title: 'Hủy đơn đặt dịch vụ',
            message: 'Bạn có chắc chắn muốn hủy đơn đặt dịch vụ này? Hành động này không thể hoàn tác.',
            type: 'danger',
            confirmText: 'Hủy đơn',
            cancelText: 'Không',
            onConfirm: async () => {
                try {
                    const response = await axiosInstance.patch(`/bookings/${booking.id}/cancel`);

                    if (response.data.code === 1000) {
                        toast.success('Hủy đơn đặt dịch vụ thành công');
                        // Refresh danh sách booking
                        fetchBookings();
                    } else {
                        toast.error(response.data.message || 'Hủy đơn đặt dịch vụ thất bại');
                    }
                } catch (error) {
                    let errorMessage = 'Hủy đơn đặt dịch vụ thất bại';

                    if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response?.status === 400) {
                        errorMessage = 'Không thể hủy đơn đặt dịch vụ này';
                    } else if (error.response?.status === 401) {
                        errorMessage = 'Bạn không có quyền hủy đơn đặt dịch vụ này';
                    }

                    toast.error(errorMessage);
                } finally {
                    setConfirmModal({ ...confirmModal, isOpen: false });
                }
            }
        });
    };

    const handleSubmitRating = async () => {
        if (rating === 0) {
            toast.error('Vui lòng chọn điểm đánh giá');
            return;
        }

        try {
            setIsSubmittingRating(true);

            const response = await axiosInstance.post('/rating', {
                bookingId: selectedBooking.id,
                rate: rating
            });

            if (response.data.code === 1000) {
                toast.success('Đánh giá dịch vụ thành công!');
                setIsRatingModalOpen(false);
                setSelectedBooking(null);
                setRating(0);

                // Cập nhật state để ẩn nút đánh giá
                if (selectedBooking) {
                    setRatedBookings(prev => new Set([...prev, selectedBooking.id]));
                }

                // Refresh bookings to update rating status
                fetchBookings();
            } else {
                throw new Error(response.data.message || 'Đánh giá thất bại');
            }
        } catch (error) {
            let errorMessage = 'Đánh giá dịch vụ thất bại';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            } else if (error.response?.status === 403) {
                errorMessage = 'Bạn không có quyền đánh giá dịch vụ này.';
            } else if (error.response?.status === 400) {
                errorMessage = 'Dữ liệu đánh giá không hợp lệ.';
            }

            toast.error(errorMessage);
        } finally {
            setIsSubmittingRating(false);
        }
    };

    const closeRatingModal = () => {
        setIsRatingModalOpen(false);
        setSelectedBooking(null);
        setRating(0);
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        // Convert string filter to number for comparison
        const filterMap = {
            'pending': 0,
            'accepted': 1,
            'completed': 2,
            'cancelled': 3
        };
        return booking.status === filterMap[filter];
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch sử đặt dịch vụ</h1>
                <p className="text-gray-600">Quản lý và theo dõi các dịch vụ bạn đã đặt</p>
            </div>

            {/* Filter */}
            <div className="mb-6">
                <div className="flex space-x-4">
                    {[
                        { key: 'all', label: 'Tất cả' },
                        { key: 'pending', label: 'Chờ xử lý' },
                        { key: 'accepted', label: 'Đã chấp nhận' },
                        { key: 'completed', label: 'Hoàn thành' },
                        { key: 'cancelled', label: 'Đã hủy' }
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === key
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        {filter === 'all' ? 'Bạn chưa có đơn đặt dịch vụ nào' : 'Không có đơn nào với trạng thái này'}
                    </div>
                    <a
                        href="/"
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md"
                    >
                        Đặt dịch vụ ngay
                    </a>
                </div>
            ) : (
                <>
                    <div className="grid gap-6">
                        {filteredBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {booking.serviceName}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span>ID: #{booking.id}</span>
                                            <span>•</span>
                                            <span>Khách hàng: {booking.customerName}</span>
                                            {booking.hireAt && booking.hireAt !== "0001-01-01T00:00:00" && (
                                                <>
                                                    <span>•</span>
                                                    <span>{new Date(booking.hireAt).toLocaleDateString('vi-VN')}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 lg:mt-0">
                                        {getStatusBadge(booking.status || 0)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Thông tin dịch vụ</h4>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div>Dịch vụ: {booking.serviceName}</div>
                                            <div>Khách hàng: {booking.customerName}</div>
                                            {booking.employeeName && (
                                                <div>Nhân viên: {booking.employeeName}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Địa chỉ</h4>
                                        <div className="text-sm text-gray-600">
                                            {booking.address || 'Chưa có địa chỉ'}
                                        </div>
                                    </div>
                                </div>

                                {booking.note && booking.note !== "string" && (
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
                                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                            {booking.note}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
                                    <div className="text-lg font-semibold text-primary-600 mb-2 sm:mb-0">
                                        {booking.price ? booking.price.toLocaleString('vi-VN') + 'đ' : 'Chưa có giá'}
                                    </div>
                                    <div className="flex space-x-3">
                                        {booking.status === 2 && !ratedBookings.has(booking.id) && (
                                            <button
                                                onClick={() => handleRateService(booking)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                            >
                                                Đánh giá dịch vụ
                                            </button>
                                        )}
                                        {booking.status === 2 && ratedBookings.has(booking.id) && (
                                            <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-md text-sm font-medium">
                                                ✅ Đã đánh giá
                                            </span>
                                        )}
                                        {booking.status === 0 && (
                                            <button
                                                onClick={() => handleCancelBooking(booking)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                            >
                                                Hủy đơn
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
                            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                                <span className="text-sm text-gray-700">Hiển thị:</span>
                                <select
                                    value={pagination.pageSize}
                                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm text-gray-700">
                                    / {pagination.totalItems} đơn
                                </span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Trước
                                </button>

                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-1 border rounded-md text-sm ${pagination.currentPage === pageNum
                                                ? 'bg-primary-600 text-white border-primary-600'
                                                : 'border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Rating Modal */}
            {isRatingModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Đánh giá dịch vụ</h2>
                                    <p className="text-gray-600 mt-1">Chia sẻ trải nghiệm của bạn</p>
                                </div>
                                <button
                                    onClick={closeRatingModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {selectedBooking && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {selectedBooking.serviceName}
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Dịch vụ đã hoàn thành vào {new Date(selectedBooking.hireAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Đánh giá chất lượng dịch vụ *
                                </label>
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`w-12 h-12 rounded-full transition-all duration-200 transform hover:scale-110 ${star <= rating
                                                ? 'bg-yellow-400 text-white'
                                                : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                                }`}
                                        >
                                            <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    {rating === 0 && 'Vui lòng chọn điểm đánh giá'}
                                    {rating === 1 && 'Rất không hài lòng'}
                                    {rating === 2 && 'Không hài lòng'}
                                    {rating === 3 && 'Bình thường'}
                                    {rating === 4 && 'Hài lòng'}
                                    {rating === 5 && 'Rất hài lòng'}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={closeRatingModal}
                                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSubmitRating}
                                    disabled={rating === 0 || isSubmittingRating}
                                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                >
                                    {isSubmittingRating ? 'Đang gửi...' : 'Gửi đánh giá'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
            />
        </div>
    );
};

export default BookingHistory;


