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
            case 'info':
                return {
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
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

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [isUpdating, setIsUpdating] = useState(null);

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: null,
        confirmText: '',
        cancelText: 'Hủy'
    });

    const { user } = useAuthStore();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await axiosInstance.get('/bookings', {
                params: {
                    PageNumber: 1,
                    PageSize: 50
                }
            });

            // API trả về format {code: 1000, result: {items: [...]}}
            if (response.data.code === 1000 && response.data.result?.items) {
                const bookings = response.data.result.items.map(booking => ({
                    ...booking,
                    status: booking.status // status từ API (0=PENDING, 1=ACCEPTED, 2=COMPLETED)
                }));
                setBookings(bookings);
            } else {
                setError('Không thể tải danh sách đơn đặt dịch vụ.');
            }
        } catch (error) {
            let errorMessage = 'Không thể tải danh sách đơn đặt dịch vụ';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            } else if (error.response?.status === 403) {
                errorMessage = 'Bạn không có quyền xem danh sách booking.';
            } else if (error.response?.status === 404) {
                errorMessage = 'Không tìm thấy dữ liệu booking.';
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            0: { color: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý' },      // PENDING
            1: { color: 'bg-blue-100 text-blue-800', text: 'Đã chấp nhận' },     // ACCEPTED
            2: { color: 'bg-green-100 text-green-800', text: 'Hoàn thành' }      // COMPLETED
        };

        const config = statusConfig[status] || statusConfig[0];

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const handleUpdateStatus = async (bookingId, action) => {
        // Determine modal content based on action
        const modalConfig = {
            accept: {
                title: 'Chấp nhận đơn đặt dịch vụ',
                message: 'Bạn có chắc chắn muốn chấp nhận đơn đặt dịch vụ này?',
                type: 'info',
                confirmText: 'Chấp nhận',
                successMessage: 'Đã chấp nhận booking thành công!'
            },
            finish: {
                title: 'Hoàn thành đơn đặt dịch vụ',
                message: 'Xác nhận rằng dịch vụ đã được hoàn thành và khách hàng đã thanh toán?',
                type: 'success',
                confirmText: 'Hoàn thành',
                successMessage: 'Đã hoàn thành booking thành công!'
            }
        };

        const config = modalConfig[action];
        if (!config) {
            toast.error('Action không hợp lệ');
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: config.title,
            message: config.message,
            type: config.type,
            confirmText: config.confirmText,
            cancelText: 'Hủy',
            onConfirm: async () => {
                setIsUpdating(bookingId);

                try {
                    let response;

                    // Sử dụng API thực tế dựa trên action
                    if (action === 'accept') {
                        response = await axiosInstance.patch(`/bookings/${bookingId}/accept`);
                    } else if (action === 'finish') {
                        response = await axiosInstance.patch(`/bookings/${bookingId}/finish`);
                    } else {
                        throw new Error('Action không hợp lệ');
                    }

                    if (response.data.code === 1000) {
                        // Refresh danh sách booking sau khi cập nhật thành công
                        await fetchBookings();
                        toast.success(config.successMessage);
                    } else {
                        throw new Error(response.data.message || 'Cập nhật trạng thái thất bại');
                    }
                } catch (error) {
                    let errorMessage = 'Cập nhật trạng thái thất bại';

                    if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response?.status === 401) {
                        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
                    } else if (error.response?.status === 403) {
                        errorMessage = 'Bạn không có quyền cập nhật trạng thái booking này.';
                    } else if (error.response?.status === 404) {
                        errorMessage = 'Booking không tồn tại hoặc đã bị xóa.';
                    } else if (error.response?.status === 400) {
                        errorMessage = 'Không thể cập nhật trạng thái. Booking có thể đã được xử lý.';
                    }

                    toast.error(errorMessage);
                } finally {
                    setIsUpdating(null);
                    setConfirmModal({ ...confirmModal, isOpen: false });
                }
            }
        });
    };

    const getStatusActions = (booking) => {
        const actions = [];

        // Status 0 = PENDING - Hiển thị nút Accept
        if (booking.status === 0) {
            actions.push(
                <button
                    key="accept"
                    onClick={() => handleUpdateStatus(booking.id, 'accept')}
                    disabled={isUpdating === booking.id}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {isUpdating === booking.id ? <LoadingSpinner size="sm" /> : 'Chấp nhận'}
                </button>
            );
        }

        // Status 1 = ACCEPTED - Hiển thị nút Hoàn thành
        if (booking.status === 1) {
            actions.push(
                <button
                    key="finish"
                    onClick={() => handleUpdateStatus(booking.id, 'finish')}
                    disabled={isUpdating === booking.id}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
                >
                    {isUpdating === booking.id ? <LoadingSpinner size="sm" /> : 'Hoàn thành'}
                </button>
            );
        }

        return actions;
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        // Convert string filter to number for comparison
        const filterMap = {
            'pending': 0,
            'accepted': 1,
            'completed': 2
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách booking</h1>
                <p className="text-gray-600">Quản lý và xử lý các đơn đặt dịch vụ</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            {/* Filter */}
            <div className="mb-6">
                <div className="flex space-x-4">
                    {[
                        { key: 'all', label: 'Tất cả' },
                        { key: 'pending', label: 'Chờ xử lý' },
                        { key: 'accepted', label: 'Đã chấp nhận' },
                        { key: 'completed', label: 'Hoàn thành' }
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

            {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-4">
                        {filter === 'all' ? 'Chưa có booking nào' : 'Không có booking nào với trạng thái này'}
                    </div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {booking.serviceName}
                                        </h3>
                                        {getStatusBadge(booking.status)}
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                        <span>ID: #{booking.id}</span>
                                        <span>•</span>
                                        <span>{new Date(booking.hireAt).toLocaleDateString('vi-VN')}</span>
                                        <span>•</span>
                                        <span>{new Date(booking.hireAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                        {booking.employeeName && (
                                            <>
                                                <span>•</span>
                                                <span>Nhân viên: {booking.employeeName}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Thông tin khách hàng</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {booking.customerName}
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {booking.address}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Địa chỉ thực hiện</h4>
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-start">
                                            <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{booking.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Thông tin dịch vụ</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <div>Giá: <span className="font-medium text-primary-600">{booking.price.toLocaleString('vi-VN')}đ</span></div>
                                        <div>Ngày thực hiện: {new Date(booking.hireAt).toLocaleDateString('vi-VN')}</div>
                                        <div>Giờ thực hiện: {new Date(booking.hireAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                                        {booking.employeeName && (
                                            <div>Nhân viên: <span className="font-medium text-blue-600">{booking.employeeName}</span></div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {booking.note && (
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-2">Ghi chú từ khách hàng</h4>
                                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                        {booking.note}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                    Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
                                </div>
                                <div className="flex space-x-2">
                                    {getStatusActions(booking)}
                                </div>
                            </div>
                        </div>
                    ))}
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

export default BookingList;
