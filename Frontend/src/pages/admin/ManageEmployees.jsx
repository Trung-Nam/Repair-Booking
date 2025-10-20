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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Tạo tài khoản nhân viên</h3>
                            <p className="text-sm text-gray-500 mt-1">Nhập thông tin để tạo tài khoản mới</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm text-red-700 font-medium">{error}</div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-semibold text-gray-700 mb-2">
                                Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                id="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base"
                                placeholder="Nhập họ và tên"
                                required
                            />
                        </div>

                        {/* Email and Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base"
                                    placeholder="email@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Số điện thoại <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base"
                                    placeholder="0123456789"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password and Confirm Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base"
                                    placeholder="Tối thiểu 6 ký tự"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-base"
                                    placeholder="Nhập lại mật khẩu"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>



                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                                        <span>Tạo tài khoản</span>
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
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý nhân viên</h1>
                        <p className="text-gray-600">Tạo và quản lý tài khoản nhân viên</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors shadow-lg hover:shadow-xl"
                    >
                        + Tạo nhân viên mới
                    </button>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Search Input */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm nhân viên</label>
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Nhập từ khóa tìm kiếm..."
                                value={searchParams.keyword}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                            />
                        </div>
                    </div>

                    {/* Search Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm theo</label>
                        <select
                            value={searchParams.field || ''}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, field: e.target.value ? parseInt(e.target.value) : null }))}
                            className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
                        >
                            <option value="">Tất cả</option>
                            <option value="1">Tên nhân viên</option>
                            <option value="2">Email</option>
                            <option value="3">Số điện thoại</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSearch}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Tìm kiếm
                    </button>
                    <button
                        onClick={handleClearFilters}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Xóa bộ lọc
                    </button>
                </div>

                {/* Results Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Hiển thị <span className="font-semibold">{employees.length}</span> trên tổng số <span className="font-semibold">{paginationInfo.totalItems}</span> nhân viên
                        {searchParams.keyword && (
                            <span> - Kết quả tìm kiếm cho "<span className="font-semibold text-primary-600">{searchParams.keyword}</span>"</span>
                        )}
                    </p>
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

            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="text-center">
                            <LoadingSpinner size="lg" />
                            <p className="mt-4 text-gray-600">Đang tải danh sách nhân viên...</p>
                        </div>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <div className="text-gray-600 text-lg mb-4">
                                {searchParams.keyword ? 'Không tìm thấy nhân viên nào' : 'Chưa có nhân viên nào'}
                            </div>
                            <p className="text-gray-500 mb-4">
                                {searchParams.keyword ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy tạo nhân viên đầu tiên'}
                            </p>
                            {searchParams.keyword ? (
                                <button
                                    onClick={handleClearFilters}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Xóa bộ lọc
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Tạo nhân viên đầu tiên
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Nhân viên
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Số điện thoại
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Vai trò
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {employees.map((employee, index) => (
                                        <tr key={employee.id || index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${employee.status
                                                        ? 'bg-gradient-to-br from-primary-500 to-primary-600'
                                                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                                                        }`}>
                                                        <span className="text-white font-bold text-lg">
                                                            {employee.fullname?.charAt(0)?.toUpperCase() || 'N'}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-gray-900">{employee.fullname}</div>
                                                        <div className="text-xs text-gray-500">ID: #{employee.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{employee.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{employee.phoneNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
                                                    {employee.role === 2 ? 'Nhân viên' : employee.role === 1 ? 'Quản trị viên' : 'Khách hàng'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {employee.status ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        Đã kích hoạt
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                        Chưa kích hoạt
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => handleToggleStatus(employee.id, employee.status)}
                                                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${employee.status
                                                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 hover:border-red-300'
                                                        : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 hover:border-green-300'
                                                        }`}
                                                >
                                                    {employee.status ? (
                                                        <>
                                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                            </svg>
                                                            Hủy kích hoạt
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Kích hoạt
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
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                                <div className="flex justify-center">
                                    <div className="flex items-center gap-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                                            disabled={paginationInfo.currentPage === 1}
                                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === paginationInfo.currentPage
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        {/* Next Button */}
                                        <button
                                            onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                                            disabled={paginationInfo.currentPage === paginationInfo.totalPages}
                                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
    );
};

export default ManageEmployees;
