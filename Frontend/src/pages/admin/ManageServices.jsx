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
                <div className="inline-block align-bottom bg-white/10 backdrop-blur-xl rounded-3xl text-left overflow-hidden shadow-2xl transform translate-y-8 transition-all sm:my-8 sm:max-w-lg sm:w-full border border-white/20">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-[9999] flex items-end justify-center p-4 pt-32">
            <div className="relative -translate-y-10 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 transform translate-y-8">
                {/* Header */}
                <div className="sticky  top-0 bg-white/5 backdrop-blur-xl border-b border-white/20 px-6 py-4 rounded-t-3xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-white">
                                {service ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
                            </h3>
                            <p className="text-sm text-purple-200 mt-1">
                                {service ? 'Cập nhật thông tin dịch vụ' : 'Điền thông tin để tạo dịch vụ mới'}
                            </p>
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
                </div>

                {/* Content */}
                <div className="p-6">
                    <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-white mb-3">
                                Tên dịch vụ *
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full px-6 py-4 border-2 border-white/30 rounded-2xl shadow-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl text-white text-lg placeholder-gray-300"
                                placeholder="Nhập tên dịch vụ..."
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-bold text-white mb-3">
                                Mô tả dịch vụ *
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="block w-full px-6 py-4 border-2 border-white/30 rounded-2xl shadow-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl text-white resize-none placeholder-gray-300"
                                placeholder="Mô tả chi tiết về dịch vụ..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="price" className="block text-sm font-bold text-white mb-3">
                                    Giá dịch vụ (VNĐ) *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="block w-full px-6 py-4 pl-12 border-2 border-white/30 rounded-2xl shadow-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl text-white text-lg placeholder-gray-300"
                                        placeholder="0"
                                        required
                                        min="0"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-purple-300 text-lg">₫</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm font-bold text-white mb-3">
                                    Danh mục *
                                </label>
                                <select
                                    name="category"
                                    id="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="block w-full px-6 py-4 border-2 border-white/30 rounded-2xl shadow-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl text-white text-lg"
                                    required
                                >
                                    <option value="" className="bg-gray-800 text-white">Chọn danh mục</option>
                                    <option value="Sơn sửa" className="bg-gray-800 text-white">Sơn sửa</option>
                                    <option value="Điện nước" className="bg-gray-800 text-white">Điện nước</option>
                                    <option value="Điện lạnh" className="bg-gray-800 text-white">Điện lạnh</option>
                                    <option value="Điện" className="bg-gray-800 text-white">Điện</option>
                                    <option value="Xây dựng" className="bg-gray-800 text-white">Xây dựng</option>
                                    <option value="Nội thất" className="bg-gray-800 text-white">Nội thất</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-bold text-white mb-3">
                                URL hình ảnh
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                id="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                className="block w-full px-6 py-4 border-2 border-white/30 rounded-2xl shadow-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl text-white text-lg placeholder-gray-300"
                            />
                            <p className="mt-2 text-sm text-purple-200">
                                Nhập URL hình ảnh để hiển thị cho dịch vụ (không bắt buộc)
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white/5 backdrop-blur-xl border-t border-white/20 px-6 py-4 rounded-b-3xl">
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-white/30 rounded-2xl text-purple-200 font-bold hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            form="service-form"
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
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
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
                    <LoadingSpinner size="lg" />
                    <p className="mt-6 text-purple-200 text-xl font-medium">Đang tải danh sách dịch vụ...</p>
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
                            <span className="text-purple-200 text-sm font-medium">⚙️ Quản lý dịch vụ</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-6">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Quản lý dịch vụ</span>
                        </h1>
                        <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
                            Thêm, sửa, xóa các dịch vụ của hệ thống
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                {error && (
                    <div className="mb-8 bg-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-red-400/30">
                        <div className="text-sm text-red-200 font-medium">{error}</div>
                    </div>
                )}

                {services.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div key={service.id} className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2 border border-white/20">
                                <div className="relative">
                                    <img
                                        src={service.imageUrl || service.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'}
                                        alt={service.name}
                                        className="w-full h-64 object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                                            {service.category}
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <div className="flex items-center bg-white/90 backdrop-blur-xl rounded-full px-3 py-2 shadow-lg">
                                            <svg className="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                            <span className="text-sm font-bold text-gray-800">{service.rating || '4.5'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-black text-white mb-3">{service.name}</h3>
                                    <p className="text-purple-200 mb-6 line-clamp-3 leading-relaxed">{service.description}</p>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-sm text-purple-200 font-medium">Theo dự án</div>
                                        <div className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                                            {service.price ? service.price.toLocaleString('vi-VN') + 'đ' : 'Chưa có giá'}
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleEditService(service)}
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-xl"
                                        >
                                            ✏️ Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDeleteService(service.id)}
                                            disabled={isSaving}
                                            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-4 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            {isSaving ? 'Đang xóa...' : '🗑️ Xóa'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {services.length === 0 && (
                    <div className="text-center py-16">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Chưa có dịch vụ nào</h3>
                            <p className="text-purple-200 mb-8">
                                Hãy tạo dịch vụ đầu tiên để bắt đầu quản lý hệ thống
                            </p>
                            <button
                                onClick={handleAddService}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
                            >
                                ➕ Thêm dịch vụ
                            </button>
                        </div>
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
        </div>
    );
};

export default ManageServices;
