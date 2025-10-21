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
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen px-4 pt-32 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 transition-opacity bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className="inline-block translate-y-full align-bottom bg-white/10 backdrop-blur-xl rounded-3xl text-left overflow-hidden shadow-2xl transform translate-y-8 transition-all sm:my-8 sm:max-w-lg sm:w-full border border-white/20">
                    <div className="bg-white/5 backdrop-blur-xl px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-2xl ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                                <div className={styles.iconColor}>
                                    {styles.icon}
                                </div>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                                <h3 className="text-lg font-bold leading-6 text-white">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-purple-200">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={`w-full inline-flex justify-center rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg ${styles.button} focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto transition-all duration-300 transform hover:scale-105`}
                        >
                            {confirmText || 'Xác nhận'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-2xl px-6 py-3 text-sm font-bold text-purple-200 bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto transition-all duration-300 transform hover:scale-105"
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
            0: { color: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white', text: 'Chờ xử lý' },      // PENDING
            1: { color: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white', text: 'Đã chấp nhận' },     // ACCEPTED
            2: { color: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white', text: 'Hoàn thành' },     // COMPLETED
            3: { color: 'bg-gradient-to-r from-red-500 to-pink-500 text-white', text: 'Đã hủy' }             // CANCELLED
        };

        const config = statusConfig[status] || statusConfig[0];

        return (
            <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${config.color}`}>
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
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
                    <LoadingSpinner size="lg" />
                    <p className="mt-6 text-purple-200 text-xl font-medium">Đang tải lịch sử đặt dịch vụ...</p>
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
                            <span className="text-purple-200 text-sm font-medium">📋 Lịch sử đặt dịch vụ</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-6">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Lịch sử đặt dịch vụ</span>
                        </h1>
                        <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
                            Quản lý và theo dõi các dịch vụ bạn đã đặt
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                {/* Filter */}
                <div className="mb-8">
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Bộ lọc trạng thái</h3>
                        <div className="flex flex-wrap gap-3">
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
                                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${filter === key
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/25'
                                        : 'bg-white/10 backdrop-blur-xl text-purple-200 hover:bg-white/20 border border-white/30'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 bg-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-red-400/30">
                        <div className="text-sm text-red-200 font-medium">{error}</div>
                    </div>
                )}

                {filteredBookings.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">
                                {filter === 'all' ? 'Bạn chưa có đơn đặt dịch vụ nào' : 'Không có đơn nào với trạng thái này'}
                            </h3>
                            <p className="text-purple-200 mb-8">
                                {filter === 'all'
                                    ? 'Hãy đặt dịch vụ đầu tiên để bắt đầu trải nghiệm'
                                    : 'Thử chọn trạng thái khác để xem thêm đơn hàng'
                                }
                            </p>
                            <a
                                href="/"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
                            >
                                Đặt dịch vụ ngay
                            </a>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-8">
                            {filteredBookings.map((booking) => (
                                <div key={booking.id} className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-black text-white mb-3">
                                                {booking.serviceName}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-sm text-purple-200">
                                                <span className="bg-white/10 backdrop-blur-xl rounded-full px-3 py-1">ID: #{booking.id}</span>
                                                <span>•</span>
                                                <span>Khách hàng: {booking.customerName}</span>
                                                {booking.hireAt && booking.hireAt !== "0001-01-01T00:00:00" && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="bg-purple-500/20 backdrop-blur-xl rounded-full px-3 py-1">
                                                            {new Date(booking.hireAt).toLocaleDateString('vi-VN')}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-4 lg:mt-0">
                                            {getStatusBadge(booking.status || 0)}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                                            <h4 className="font-bold text-white mb-4 text-lg">Thông tin dịch vụ</h4>
                                            <div className="text-sm text-purple-200 space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Dịch vụ:</span>
                                                    <span className="font-bold text-white">{booking.serviceName}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Khách hàng:</span>
                                                    <span className="font-bold text-white">{booking.customerName}</span>
                                                </div>
                                                {booking.employeeName && (
                                                    <div className="flex justify-between">
                                                        <span>Nhân viên:</span>
                                                        <span className="font-bold text-white">{booking.employeeName}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                                            <h4 className="font-bold text-white mb-4 text-lg">Địa chỉ</h4>
                                            <div className="text-sm text-purple-200">
                                                {booking.address || 'Chưa có địa chỉ'}
                                            </div>
                                        </div>
                                    </div>

                                    {booking.note && booking.note !== "string" && (
                                        <div className="mb-6">
                                            <h4 className="font-bold text-white mb-3 text-lg">Ghi chú</h4>
                                            <div className="text-sm text-purple-200 bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                                                {booking.note}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-white/20">
                                        <div className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4 sm:mb-0">
                                            {booking.price ? booking.price.toLocaleString('vi-VN') + 'đ' : 'Chưa có giá'}
                                        </div>
                                        <div className="flex space-x-3">
                                            {booking.status === 2 && !ratedBookings.has(booking.id) && (
                                                <button
                                                    onClick={() => handleRateService(booking)}
                                                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
                                                >
                                                    ⭐ Đánh giá dịch vụ
                                                </button>
                                            )}
                                            {booking.status === 2 && ratedBookings.has(booking.id) && (
                                                <span className="bg-white/10 backdrop-blur-xl text-purple-200 px-6 py-3 rounded-2xl text-sm font-bold border border-white/20">
                                                    ✅ Đã đánh giá
                                                </span>
                                            )}
                                            {booking.status === 0 && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking)}
                                                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
                                                >
                                                    ❌ Hủy đơn
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-12">
                                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm text-purple-200 font-medium">Hiển thị:</span>
                                            <select
                                                value={pagination.pageSize}
                                                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                                                className="border border-white/30 rounded-2xl px-4 py-2 text-sm bg-white/5 backdrop-blur-xl text-white"
                                            >
                                                <option value={5} className="bg-gray-800 text-white">5</option>
                                                <option value={10} className="bg-gray-800 text-white">10</option>
                                                <option value={20} className="bg-gray-800 text-white">20</option>
                                                <option value={50} className="bg-gray-800 text-white">50</option>
                                            </select>
                                            <span className="text-sm text-purple-200 font-medium">
                                                / {pagination.totalItems} đơn
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                disabled={pagination.currentPage === 1}
                                                className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                                            >
                                                Trước
                                            </button>

                                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                                const pageNum = i + 1;
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-110 ${pagination.currentPage === pageNum
                                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/25'
                                                            : 'bg-white/10 backdrop-blur-xl border border-white/30 text-purple-200 hover:bg-white/20'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                disabled={pagination.currentPage === pagination.totalPages}
                                                className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                                            >
                                                Sau
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Rating Modal */}
                {isRatingModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center pt-32 z-[9999]">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full mx-4 transform translate-y-8 transition-all border border-white/20">
                            {/* Header */}
                            <div className="sticky top-0 bg-white/5 backdrop-blur-xl border-b border-white/20 px-6 py-4 rounded-t-3xl">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Đánh giá dịch vụ</h2>
                                        <p className="text-purple-200 mt-1">Chia sẻ trải nghiệm của bạn</p>
                                    </div>
                                    <button
                                        onClick={closeRatingModal}
                                        className="text-purple-300 hover:text-white transition-colors"
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
                                    <div className="mb-6 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                                        <h3 className="text-lg font-bold text-white mb-2">
                                            {selectedBooking.serviceName}
                                        </h3>
                                        <p className="text-purple-200 text-sm">
                                            Dịch vụ đã hoàn thành vào {new Date(selectedBooking.hireAt).toLocaleDateString('vi-VN')}
                                        </p>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-white mb-4">
                                        Đánh giá chất lượng dịch vụ *
                                    </label>
                                    <div className="flex space-x-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className={`w-14 h-14 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg ${star <= rating
                                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-yellow-500/25'
                                                    : 'bg-white/10 backdrop-blur-xl text-purple-300 hover:bg-white/20 border border-white/30'
                                                    }`}
                                            >
                                                <svg className="w-7 h-7 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-3 text-sm text-purple-200 font-medium">
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
                            <div className="sticky bottom-0 bg-white/5 backdrop-blur-xl border-t border-white/20 px-6 py-4 rounded-b-3xl">
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={closeRatingModal}
                                        className="px-6 py-3 border border-white/30 rounded-2xl text-purple-200 hover:bg-white/10 transition-all duration-300 font-bold"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleSubmitRating}
                                        disabled={rating === 0 || isSubmittingRating}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
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
        </div>
    );
};

export default BookingHistory;


