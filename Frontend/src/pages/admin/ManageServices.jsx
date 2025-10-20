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

const ServiceModal = ({ isOpen, onClose, service, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (service) {
            setFormData({
                name: service.name || '',
                description: service.description || '',
                price: service.price || '',
                category: service.category || '',
                imageUrl: service.imageUrl || service.image || ''
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                imageUrl: ''
            });
        }
    }, [service, isOpen]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {service ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {service ? 'Cập nhật thông tin dịch vụ' : 'Điền thông tin để tạo dịch vụ mới'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">

                    <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Tên dịch vụ *
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-lg"
                                placeholder="Nhập tên dịch vụ..."
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                Mô tả dịch vụ *
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
                                placeholder="Mô tả chi tiết về dịch vụ..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Giá dịch vụ (VNĐ) *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-lg"
                                        placeholder="0"
                                        required
                                        min="0"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 text-lg">₫</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Danh mục *
                                </label>
                                <select
                                    name="category"
                                    id="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-lg"
                                    required
                                >
                                    <option value="">Chọn danh mục</option>
                                    <option value="Sơn sửa">Sơn sửa</option>
                                    <option value="Điện nước">Điện nước</option>
                                    <option value="Điện lạnh">Điện lạnh</option>
                                    <option value="Điện">Điện</option>
                                    <option value="Xây dựng">Xây dựng</option>
                                    <option value="Nội thất">Nội thất</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                                URL hình ảnh
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                id="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-lg"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                Nhập URL hình ảnh để hiển thị cho dịch vụ (không bắt buộc)
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            form="service-form"
                            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            {service ? 'Cập nhật dịch vụ' : 'Tạo dịch vụ mới'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ManageServices = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

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

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setIsLoading(true);
            setError('');

            // Sử dụng API giống như trang Services với pagination
            const response = await axiosInstance.get('/services', {
                params: {
                    PageNumber: 1,
                    PageSize: 50 // Lấy nhiều dịch vụ cho admin
                }
            });

            if (response.data.code === 1000) {
                setServices(response.data.result.items || []);
            } else {
                setError('Không thể tải danh sách dịch vụ.');
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            } else if (error.response?.status === 403) {
                setError('Bạn không có quyền truy cập danh sách dịch vụ.');
            } else {
                setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddService = () => {
        setEditingService(null);
        setIsModalOpen(true);
    };

    const handleEditService = (service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    const handleSaveService = async (formData) => {
        setIsSaving(true);
        setError('');

        try {
            if (editingService) {
                // Update existing service using API
                const serviceData = {
                    name: formData.name,
                    price: parseInt(formData.price),
                    imageUrl: formData.imageUrl || "string",
                    description: formData.description,
                    category: formData.category
                };

                const response = await axiosInstance.put(`/services/${editingService.id}`, serviceData);

                if (response.data.code === 1000) {
                    // Refresh services list after successful update
                    await fetchServices();
                    toast.success('Cập nhật dịch vụ thành công!');
                } else {
                    throw new Error(response.data.message || 'Cập nhật dịch vụ thất bại');
                }
            } else {
                // Create new service using API
                const serviceData = {
                    name: formData.name,
                    price: parseInt(formData.price),
                    imageUrl: formData.imageUrl || "string",
                    description: formData.description,
                    category: formData.category
                };

                const response = await axiosInstance.post('/services', serviceData);

                if (response.data.code === 1000) {
                    // Refresh services list after successful creation
                    await fetchServices();
                    toast.success(response.data.result || 'Tạo dịch vụ thành công!');
                } else {
                    throw new Error(response.data.message || 'Tạo dịch vụ thất bại');
                }
            }

            setIsModalOpen(false);
            setEditingService(null);
        } catch (error) {
            let errorMessage = editingService ? 'Cập nhật dịch vụ thất bại' : 'Tạo dịch vụ thất bại';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 401) {
                errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            } else if (error.response?.status === 403) {
                errorMessage = 'Bạn không có quyền thực hiện hành động này.';
            } else if (error.response?.status === 400) {
                errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
            } else if (error.response?.status === 404) {
                errorMessage = editingService ? 'Dịch vụ không tồn tại hoặc đã bị xóa.' : 'Không tìm thấy dịch vụ.';
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteService = async (serviceId) => {
        setConfirmModal({
            isOpen: true,
            title: 'Xóa dịch vụ',
            message: 'Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác.',
            type: 'danger',
            confirmText: 'Xóa dịch vụ',
            cancelText: 'Hủy',
            onConfirm: async () => {
                try {
                    setIsSaving(true);
                    setError('');

                    const response = await axiosInstance.delete(`/services/${serviceId}`);

                    if (response.data.code === 1000) {
                        // Refresh services list after successful deletion
                        await fetchServices();
                        toast.success('Xóa dịch vụ thành công!');
                    } else {
                        throw new Error(response.data.message || 'Xóa dịch vụ thất bại');
                    }
                } catch (error) {
                    let errorMessage = 'Xóa dịch vụ thất bại';

                    if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response?.status === 401) {
                        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
                    } else if (error.response?.status === 403) {
                        errorMessage = 'Bạn không có quyền xóa dịch vụ này.';
                    } else if (error.response?.status === 404) {
                        errorMessage = 'Dịch vụ không tồn tại hoặc đã bị xóa.';
                    } else if (error.response?.status === 400) {
                        errorMessage = 'Không thể xóa dịch vụ này. Có thể đang có đơn đặt hàng liên quan.';
                    }

                    setError(errorMessage);
                    toast.error(errorMessage);
                } finally {
                    setIsSaving(false);
                    setConfirmModal({ ...confirmModal, isOpen: false });
                }
            }
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý dịch vụ</h1>
                        <p className="text-gray-600">Thêm, sửa, xóa các dịch vụ của hệ thống</p>
                    </div>
                    {services.length > 0 && (
                        <button
                            onClick={handleAddService}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Thêm dịch vụ mới
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            {services.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                            <img
                                src={service.imageUrl || service.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'}
                                alt={service.name}
                                className="w-full h-48 object-cover"
                                loading="lazy"
                            />
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                        {service.category}
                                    </span>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                        <span className="ml-1 text-sm text-gray-600">{service.rating || '4.5'}</span>
                                        <span className="ml-1 text-sm text-gray-500">({service.reviews || 0})</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-sm text-gray-500">Theo dự án</div>
                                    <div className="text-lg font-bold text-primary-600">
                                        {service.price ? service.price.toLocaleString('vi-VN') + 'đ' : 'Chưa có giá'}
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditService(service)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteService(service.id)}
                                        disabled={isSaving}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? 'Đang xóa...' : 'Xóa'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {services.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-6">Chưa có dịch vụ nào</div>
                    <button
                        onClick={handleAddService}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        Thêm dịch vụ
                    </button>
                </div>
            )}

            <ServiceModal
                isOpen={isModalOpen}
                onClose={closeModal}
                service={editingService}
                onSave={handleSaveService}
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

export default ManageServices;
