import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await login(formData);
            if (result.success) {
                navigate(from, { replace: true });
            } else {
                throw new Error('Đăng nhập thất bại');
            }
        } catch (error) {
            const errorMessage = error.message || 'Đăng nhập thất bại';
            setError(errorMessage);
            // Toast is already shown in useAuthStore, no need to show again
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>

            {/* Left Side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-purple-900/90"></div>
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
                    <div className="text-center max-w-md mx-auto">
                        <div className="mb-8">
                            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/25">
                                <span className="text-white font-black text-3xl">R</span>
                            </div>
                        </div>
                        <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Repair booking
                        </h1>
                        <h2 className="text-2xl font-bold mb-4 text-white">Dịch vụ sửa chữa nhà cửa</h2>
                        <p className="text-lg text-purple-200 leading-relaxed mb-8">
                            Chào mừng bạn trở lại! Đăng nhập để tiếp tục sử dụng các dịch vụ sửa chữa nhà cửa chuyên nghiệp của chúng tôi.
                        </p>

                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <div className="text-3xl font-black text-white mb-2">500+</div>
                                <div className="text-sm text-purple-200 font-medium">Khách hàng</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <div className="text-3xl font-black text-white mb-2">1000+</div>
                                <div className="text-sm text-purple-200 font-medium">Dự án</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <div className="text-3xl font-black text-white mb-2">15+</div>
                                <div className="text-sm text-purple-200 font-medium">Năm KN</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-20 left-20 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl"></div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md relative z-10">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/25 mb-6">
                            <span className="text-white font-black text-2xl">R</span>
                        </div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            Repair booking
                        </h1>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-white mb-2">
                                Chào mừng trở lại
                            </h2>
                            <p className="text-purple-200">
                                Đăng nhập để tiếp tục sử dụng dịch vụ
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-white mb-3">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-6 w-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl shadow-lg text-white placeholder-gray-300"
                                            placeholder="Nhập địa chỉ email của bạn"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={{ color: 'white !important' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-bold text-white mb-3">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-6 w-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl shadow-lg text-white placeholder-gray-300"
                                            placeholder="Nhập mật khẩu của bạn"
                                            value={formData.password}
                                            onChange={handleChange}
                                            style={{ color: 'white !important' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-4">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-red-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="text-sm text-red-200 font-medium">{error}</div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black py-4 px-6 text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <LoadingSpinner size="sm" />
                                        <span className="ml-2">Đang đăng nhập...</span>
                                    </div>
                                ) : (
                                    'Đăng nhập'
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-purple-200">
                                    Chưa có tài khoản?{' '}
                                    <Link
                                        to="/register"
                                        className="font-bold text-purple-300 hover:text-white transition-colors duration-300"
                                    >
                                        Đăng ký ngay
                                    </Link>
                                </p>
                            </div>
                        </form>

                        {/* Demo Accounts */}
                        <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30">
                            <div className="flex items-center mb-4">
                                <svg className="h-5 w-5 text-purple-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-sm font-bold text-white">Tài khoản demo</h3>
                            </div>
                            <div className="space-y-3 text-xs">
                                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                                    <div className="font-bold text-white mb-1">👑 Admin</div>
                                    <div className="text-purple-200">admin@demo.com / admin123</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                                    <div className="font-bold text-white mb-1">👷 Employee</div>
                                    <div className="text-purple-200">employee@demo.com / emp123</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
                                    <div className="font-bold text-white mb-1">👤 Customer</div>
                                    <div className="text-purple-200">customer@demo.com / customer123</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
