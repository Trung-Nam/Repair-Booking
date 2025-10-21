import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
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

const EmployeeModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsSubmitting(true);

        try {
            const requestData = {
                fullname: formData.fullname,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                role: 2 // Default role for employee
            };

            const response = await axiosInstance.post('/auth/register', requestData);

            if (response.data.code === 1000) {
                toast.success('Tạo tài khoản nhân viên thành công!');
                resetForm();
                onClose();
                onSave(); // Refresh the employee list
            } else if (response.data.code === 1004) {
                setError('Email đã tồn tại trong hệ thống');
            } else if (response.data.code === 1001) {
                setError('Số điện thoại đã tồn tại trong hệ thống');
            }
            else {
                setError('Có lỗi xảy ra khi tạo tài khoản');
            }
        } catch (error) {
            console.error('Error creating employee:', error);
            if (error.response?.data?.code === 1004 || error.response?.data?.code === 1001) {
                setError('Email đã tồn tại trong hệ thống');
                toast.error('Email đã tồn tại trong hệ thống');
            } else {
                setError('Không thể tạo tài khoản nhân viên');
                toast.error('Không thể tạo tài khoản nhân viên');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            fullname: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: ''
        });
        setError('');
    };

    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed  inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[9999] flex items-end justify-center p-4 pt-32">
            <div className="relative -translate-y-32 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20 transform translate-y-8">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-3xl font-black text-white">Tạo tài khoản nhân viên</h3>
                            <p className="text-sm text-purple-200 mt-2">Nhập thông tin để tạo tài khoản mới</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-purple-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-8 bg-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-red-400/30">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-red-200 font-bold">{error}</div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-bold text-white mb-3">
                                Họ và tên <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                id="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="w-full px-6 py-4 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl text-white text-lg placeholder-gray-300"
                                placeholder="Nhập họ và tên"
                                required
                            />
                        </div>

                        {/* Email and Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-white mb-3">
                                    Email <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl text-white text-lg placeholder-gray-300"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-bold text-white mb-3">
                                    Số điện thoại <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl text-white text-lg placeholder-gray-300"
                                    placeholder="0123456789"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password and Confirm Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-white mb-3">
                                    Mật khẩu <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl text-white text-lg placeholder-gray-300"
                                    placeholder="Tối thiểu 6 ký tự"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-bold text-white mb-3">
                                    Xác nhận mật khẩu <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl text-white text-lg placeholder-gray-300"
                                    placeholder="Nhập lại mật khẩu"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>



                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-6 pt-8 border-t border-white/20">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-8 py-4 border border-white/30 rounded-2xl text-purple-200 font-bold hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Đang tạo...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>➕ Tạo tài khoản</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ManageEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    // Search & Filter States
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        field: null, // 1: fullname, 2: email, 3: phone, null: search all
        pageNumber: 1,
        pageSize: 10
    });

    // Pagination Info
    const [paginationInfo, setPaginationInfo] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1
    });

    useEffect(() => {
        fetchEmployees();
    }, [searchParams.pageNumber]);

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            setError('');

            // Build query parameters
            const params = new URLSearchParams();
            params.append('PageNumber', searchParams.pageNumber.toString());
            params.append('PageSize', searchParams.pageSize.toString());

            if (searchParams.keyword) {
                params.append('Keyword', searchParams.keyword);
                if (searchParams.field) {
                    params.append('Field', searchParams.field.toString());
                }
            }

            const response = await axiosInstance.get(`/employees?${params.toString()}`);

            if (response.data.code === 1000) {
                setEmployees(response.data.result.items);
                setPaginationInfo({
                    totalItems: response.data.result.totalItems,
                    totalPages: response.data.result.totalPages,
                    currentPage: response.data.result.page
                });
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.error('Không thể tải danh sách nhân viên');
            setEmployees([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        setSearchParams(prev => ({ ...prev, pageNumber: 1 }));
        fetchEmployees();
    };

    const handlePageChange = (page) => {
        setSearchParams(prev => ({ ...prev, pageNumber: page }));
    };

    const handleClearFilters = () => {
        setSearchParams({
            keyword: '',
            field: null,
            pageNumber: 1,
            pageSize: 10
        });
    };

    useEffect(() => {
        if (searchParams.keyword === '') {
            fetchEmployees();
        }
    }, [searchParams.keyword]);

    const handleCreateEmployee = () => {
        // Refresh the employee list after successful creation
        fetchEmployees();
    };

    const handleToggleStatus = async (employeeId, currentStatus) => {
        const action = currentStatus ? 'hủy kích hoạt' : 'kích hoạt';

        setConfirmModal({
            isOpen: true,
            title: currentStatus ? 'Hủy kích hoạt tài khoản' : 'Kích hoạt tài khoản',
            message: `Bạn có chắc chắn muốn ${action} tài khoản nhân viên này?`,
            type: currentStatus ? 'danger' : 'success',
            confirmText: currentStatus ? 'Hủy kích hoạt' : 'Kích hoạt',
            cancelText: 'Hủy',
            onConfirm: async () => {
                try {
                    const response = await axiosInstance.post(`/employees/account-action/${employeeId}`);

                    if (response.data.code === 1000) {
                        fetchEmployees();
                        const successMessage = currentStatus
                            ? 'Hủy kích hoạt tài khoản thành công!'
                            : 'Kích hoạt tài khoản thành công!';
                        toast.success(successMessage);
                    } else {
                        toast.error('Không thể thực hiện thao tác!');
                    }
                } catch (error) {
                    console.error('Error toggling account status:', error);
                    toast.error('Có lỗi xảy ra khi thực hiện thao tác!');
                }
                setConfirmModal({ ...confirmModal, isOpen: false });
            }
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
                    <LoadingSpinner size="lg" />
                    <p className="mt-6 text-purple-200 text-xl font-medium">Đang tải danh sách nhân viên...</p>
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
                            <span className="text-purple-200 text-sm font-medium">👥 Quản lý nhân viên</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-6">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Quản lý nhân viên</span>
                        </h1>
                        <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
                            Tạo và quản lý tài khoản nhân viên
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                {/* Search and Filter */}
                <div className="mb-8 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Search Input */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-bold text-white mb-3">Tìm kiếm nhân viên</label>
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Nhập từ khóa tìm kiếm..."
                                    value={searchParams.keyword}
                                    onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
                                    className="w-full pl-12 pr-6 py-4 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl text-white text-lg placeholder-gray-300"
                                />
                            </div>
                        </div>

                        {/* Search Field */}
                        <div>
                            <label className="block text-sm font-bold text-white mb-3">Tìm kiếm theo</label>
                            <select
                                value={searchParams.field || ''}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, field: e.target.value ? parseInt(e.target.value) : null }))}
                                className="w-full py-4 px-6 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl text-white text-lg"
                            >
                                <option value="" className="bg-gray-800 text-white">Tất cả</option>
                                <option value="1" className="bg-gray-800 text-white">Tên nhân viên</option>
                                <option value="2" className="bg-gray-800 text-white">Email</option>
                                <option value="3" className="bg-gray-800 text-white">Số điện thoại</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            🔍 Tìm kiếm
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="bg-white/10 backdrop-blur-xl border border-white/30 text-purple-200 hover:bg-white/20 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            🗑️ Xóa bộ lọc
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 flex items-center gap-3"
                        >
                            ➕ Tạo nhân viên mới
                        </button>
                    </div>

                    {/* Results Info */}
                    <div className="pt-6 border-t border-white/20">
                        <p className="text-sm text-purple-200">
                            Hiển thị <span className="font-bold text-white">{employees.length}</span> trên tổng số <span className="font-bold text-white">{paginationInfo.totalItems}</span> nhân viên
                            {searchParams.keyword && (
                                <span> - Kết quả tìm kiếm cho "<span className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">{searchParams.keyword}</span>"</span>
                            )}
                        </p>
                    </div>
                </div>

                {success && (
                    <div className="mb-8 bg-green-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30">
                        <div className="text-sm text-green-200 font-medium">{success}</div>
                    </div>
                )}

                {error && (
                    <div className="mb-8 bg-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-red-400/30">
                        <div className="text-sm text-red-200 font-medium">{error}</div>
                    </div>
                )}

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="text-center">
                                <LoadingSpinner size="lg" />
                                <p className="mt-4 text-purple-200">Đang tải danh sách nhân viên...</p>
                            </div>
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-2xl mx-auto border border-white/20">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div className="text-white text-2xl font-bold mb-4">
                                    {searchParams.keyword ? 'Không tìm thấy nhân viên nào' : 'Chưa có nhân viên nào'}
                                </div>
                                <p className="text-purple-200 mb-8">
                                    {searchParams.keyword ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy tạo nhân viên đầu tiên'}
                                </p>
                                {searchParams.keyword ? (
                                    <button
                                        onClick={handleClearFilters}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
                                    >
                                        🗑️ Xóa bộ lọc
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25"
                                    >
                                        ➕ Tạo nhân viên đầu tiên
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-white/20">
                                    <thead className="bg-white/5 backdrop-blur-xl">
                                        <tr>
                                            <th className="px-6 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                👤 Nhân viên
                                            </th>
                                            <th className="px-6 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                📧 Email
                                            </th>
                                            <th className="px-6 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                📱 Số điện thoại
                                            </th>
                                            <th className="px-6 py-6 text-left text-sm font-bold text-white uppercase tracking-wider">
                                                🎭 Vai trò
                                            </th>
                                            <th className="px-6 py-6 text-center text-sm font-bold text-white uppercase tracking-wider">
                                                ⚡ Trạng thái
                                            </th>
                                            <th className="px-6 py-6 text-center text-sm font-bold text-white uppercase tracking-wider">
                                                ⚙️ Thao tác
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white/5 backdrop-blur-xl divide-y divide-white/20">
                                        {employees.map((employee, index) => (
                                            <tr key={employee.id || index} className="hover:bg-white/10 transition-all duration-300">
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${employee.status
                                                            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                                            : 'bg-gradient-to-br from-gray-500 to-gray-600'
                                                            }`}>
                                                            <span className="text-white font-black text-xl">
                                                                {employee.fullname?.charAt(0)?.toUpperCase() || 'N'}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-lg font-bold text-white">{employee.fullname}</div>
                                                            <div className="text-sm text-purple-200">ID: #{employee.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="text-lg text-white font-medium">{employee.email}</div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="text-lg text-white font-medium">{employee.phoneNumber}</div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                                                        {employee.role === 2 ? '👨‍💼 Nhân viên' : employee.role === 1 ? '👑 Quản trị viên' : '👤 Khách hàng'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap text-center">
                                                    {employee.status ? (
                                                        <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            ✅ Đã kích hoạt
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                            </svg>
                                                            ❌ Chưa kích hoạt
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap text-center">
                                                    <button
                                                        onClick={() => handleToggleStatus(employee.id, employee.status)}
                                                        className={`inline-flex items-center px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-xl ${employee.status
                                                            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                                                            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                                                            }`}
                                                    >
                                                        {employee.status ? (
                                                            <>
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                                </svg>
                                                                🚫 Hủy kích hoạt
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                ✅ Kích hoạt
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {paginationInfo.totalPages > 1 && (
                                <div className="bg-white/5 backdrop-blur-xl px-6 py-6 border-t border-white/20">
                                    <div className="flex justify-center">
                                        <div className="flex items-center gap-3">
                                            {/* Previous Button */}
                                            <button
                                                onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                                                disabled={paginationInfo.currentPage === 1}
                                                className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            {/* Page Numbers */}
                                            {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-110 ${page === paginationInfo.currentPage
                                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/25'
                                                        : 'bg-white/10 backdrop-blur-xl border border-white/30 text-purple-200 hover:bg-white/20'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                            {/* Next Button */}
                                            <button
                                                onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                                                disabled={paginationInfo.currentPage === paginationInfo.totalPages}
                                                className="px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/30 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <EmployeeModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSave={handleCreateEmployee}
                />

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

export default ManageEmployees;
