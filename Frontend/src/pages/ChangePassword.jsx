import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/LoadingSpinner';
import axiosInstance from '../utils/axiosInstance';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

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

        if (formData.newPassword !== formData.confirmPassword) {
            const errorMessage = 'Mật khẩu mới và xác nhận mật khẩu không khớp';
            setError(errorMessage);
            toast.error(errorMessage);
            setIsLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            const errorMessage = 'Mật khẩu mới phải có ít nhất 6 ký tự';
            setError(errorMessage);
            toast.error(errorMessage);
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API call
            const response = await axiosInstance.post('/auth/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            if (response.data.code === 1000) {
                const successMessage = 'Đổi mật khẩu thành công!';
                setSuccess(successMessage);
                toast.success(successMessage);
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                navigate('/profile');
            } else if (response.data.code === 1002) {
                const errorMessage = 'Mật khẩu hiện tại không đúng. Vui lòng thử lại.';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error) {
            const errorMessage = 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm mb-6">
                        <span className="text-purple-200 text-sm font-medium">🔐 Bảo mật tài khoản</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Đổi mật khẩu</span>
                    </h1>
                    <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                        Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh và không chia sẻ với người khác.
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
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

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="currentPassword" className="block text-sm font-bold text-white mb-3">
                                    Mật khẩu hiện tại
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        id="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl shadow-lg text-white placeholder-gray-300"
                                        required
                                        placeholder="Nhập mật khẩu hiện tại"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-bold text-white mb-3">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        id="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl shadow-lg text-white placeholder-gray-300"
                                        required
                                        placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-bold text-white mb-3">
                                    Xác nhận mật khẩu mới
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl shadow-lg text-white placeholder-gray-300"
                                        required
                                        placeholder="Nhập lại mật khẩu mới"
                                        minLength={6}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Tips */}
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
                            <div className="flex items-start space-x-3">
                                <svg className="w-6 h-6 text-purple-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-2">Mẹo bảo mật mật khẩu</h3>
                                    <ul className="text-sm text-purple-200 space-y-1">
                                        <li>• Sử dụng ít nhất 8 ký tự</li>
                                        <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                                        <li>• Tránh sử dụng thông tin cá nhân dễ đoán</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="px-8 py-4 rounded-2xl border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 transition-all duration-300 font-bold"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
                            >
                                {isLoading ? <LoadingSpinner size="sm" /> : 'Đổi mật khẩu'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
