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
            } else if (response.data.code == 1001) {
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
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                <span className="text-white font-black text-2xl">{user?.fullname?.charAt(0)?.toUpperCase()}</span>
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black">Thông tin cá nhân</h1>
                                <p className="text-purple-200 text-sm">Quản lý hồ sơ và bảo mật tài khoản</p>
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-2xl"
                            >
                                Chỉnh sửa
                            </button>
                        )}
                    </div>
                </div>

                {/* Alerts */}
                {success && (
                    <div className="mb-6 bg-green-500/15 border border-green-400/30 text-green-200 rounded-2xl p-4">
                        <div className="text-sm">{success}</div>
                    </div>
                )}
                {error && (
                    <div className="mb-6 bg-red-500/15 border border-red-400/30 text-red-200 rounded-2xl p-4">
                        <div className="text-sm">{error}</div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left - Summary card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                    <span className="text-white font-black text-xl">{user?.fullname?.charAt(0)?.toUpperCase()}</span>
                                </div>
                                <div>
                                    <div className="text-xl font-bold">{user?.fullname}</div>
                                    <div className="text-purple-300 text-sm">{user?.email}</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <div className="text-purple-300 text-sm">Vai trò</div>
                                    <div className="mt-1">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-white/20">
                                            {useAuthStore.getState().getRoleName()}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <div className="text-purple-300 text-sm">Số điện thoại</div>
                                    <div className="mt-1 text-white">{user?.phoneNumber || 'Chưa cập nhật'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Form or Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="fullname" className="block text-sm font-bold text-white mb-2">
                                                Họ và tên
                                            </label>
                                            <input
                                                type="text"
                                                name="fullname"
                                                id="fullname"
                                                value={formData.fullname}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 text-lg border-2 border-white/30 rounded-2xl bg-white/5 text-white placeholder-gray-300 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                disabled
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 text-lg border-2 border-white/30 rounded-2xl bg-white/5 text-white placeholder-gray-300 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 disabled:opacity-60"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phoneNumber" className="block text-sm font-bold text-white mb-2">
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                id="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                className="block w-full px-4 py-3 text-lg border-2 border-white/30 rounded-2xl bg-white/5 text-white placeholder-gray-300 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-6 py-3 rounded-2xl border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 transition-all"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? <LoadingSpinner size="sm" /> : 'Lưu thay đổi'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="text-purple-300 text-sm">Họ và tên</div>
                                            <div className="mt-1 text-lg font-bold text-white">{user?.fullname}</div>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="text-purple-300 text-sm">Email</div>
                                            <div className="mt-1 text-lg font-bold text-white">{user?.email}</div>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="text-purple-300 text-sm">Số điện thoại</div>
                                            <div className="mt-1 text-lg font-bold text-white">{user?.phoneNumber || 'Chưa cập nhật'}</div>
                                        </div>
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="text-purple-300 text-sm">Vai trò</div>
                                            <div className="mt-1">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-white/20">
                                                    {useAuthStore.getState().getRoleName()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/20 pt-6">
                                        <h3 className="text-lg font-bold text-white mb-4">Tài khoản</h3>
                                        <div className="space-y-3">
                                            <Link
                                                to="/change-password"
                                                className="inline-flex items-center px-6 py-3 rounded-2xl border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 transition-all"
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
            </div>
        </div>
    );
};

export default Profile;
