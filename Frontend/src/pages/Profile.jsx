import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/LoadingSpinner';
import axiosInstance from '../utils/axiosInstance';

const Profile = () => {
    const { user, updateUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullname: user?.fullname || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Simulate API call
            const response = await axiosInstance.put('/auth/update-profile', formData)
            if (response.data.code == 1000) {
                updateUser(formData);
                const successMessage = 'Cập nhật thông tin thành công!';
                setSuccess(successMessage);
                toast.success(successMessage);
                setIsEditing(false);
            }else if (response.data.code == 1001) {
                const errorMessage = 'Số điện thoại đã tồn tại';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            const errorMessage = 'Cập nhật thông tin thất bại';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            fullname: user?.fullname || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || ''
        });
        setIsEditing(false);
        setError('');
        setSuccess('');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Chỉnh sửa
                            </button>
                        )}
                    </div>

                    {success && (
                        <div className="mb-4 rounded-md bg-green-50 p-4">
                            <div className="text-sm text-green-700">{success}</div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                                        Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        name="fullname"
                                        id="fullname"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-3 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        disabled
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-3 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-3 text-lg border border-gray-300 rounded-xl shadow-sm focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-colors duration-200 bg-gray-50 focus:bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-white py-3 px-6 border border-gray-300 rounded-xl shadow-sm text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {isLoading ? <LoadingSpinner size="sm" /> : 'Lưu thay đổi'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-primary-600 font-bold text-2xl">
                                        {user?.fullname?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">{user?.fullname}</h2>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                            </div>

                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Họ và tên</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{user?.fullname}</dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{user?.phoneNumber || 'Chưa cập nhật'}</dd>
                                </div>

                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Vai trò</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                            {useAuthStore.getState().getRoleName()}
                                        </span>
                                    </dd>
                                </div>
                            </dl>

                            <div className="border-t pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Tài khoản</h3>
                                <div className="space-y-3">
                                    <Link
                                        to="/change-password"
                                        className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                                    >
                                        Đổi mật khẩu
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
