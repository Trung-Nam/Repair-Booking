import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuthStore();
    const navigate = useNavigate();

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

        if (formData.password !== formData.confirmPassword) {
            const errorMessage = 'Mật khẩu xác nhận không khớp';
            setError(errorMessage);
            toast.error(errorMessage);
            setIsLoading(false);
            return;
        }

        try {
            const result = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            });

            if (result.success) {
                // Redirect to login page after successful registration
                navigate('/login');
            } else {
                throw new Error('Đăng ký thất bại');
            }
        } catch (error) {
            const errorMessage = error.message || 'Đăng ký thất bại';
            setError(errorMessage);
            toast.error(errorMessage);
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
                        <h2 className="text-2xl font-bold mb-4 text-white">Tham gia cùng chúng tôi</h2>
                        <p className="text-lg text-purple-200 leading-relaxed mb-8">
                            Tạo tài khoản ngay hôm nay để trải nghiệm dịch vụ sửa chữa nhà cửa chuyên nghiệp và đáng tin cậy.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <svg className="w-8 h-8 text-purple-300 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div className="text-left">
                                    <div className="font-bold text-white">Dịch vụ chuyên nghiệp</div>
                                    <div className="text-sm text-purple-200">Đội ngũ thợ lành nghề</div>
                                </div>
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <svg className="w-8 h-8 text-purple-300 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <div className="text-left">
                                    <div className="font-bold text-white">Giá cả hợp lý</div>
                                    <div className="text-sm text-purple-200">Báo giá minh bạch</div>
                                </div>
                            </div>
                            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <svg className="w-8 h-8 text-purple-300 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75 9.75 0 019.75-9.75z" />
                                </svg>
                                <div className="text-left">
                                    <div className="font-bold text-white">Bảo hành dài hạn</div>
                                    <div className="text-sm text-purple-200">Cam kết chất lượng</div>
                                </div>
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
                                Tạo tài khoản mới
                            </h2>
                            <p className="text-purple-200">
                                Đăng ký để bắt đầu sử dụng dịch vụ
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-white mb-3">
                                        Họ và tên
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-6 w-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            required
                                            className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl shadow-lg text-white placeholder-gray-300"
                                            placeholder="Nhập họ và tên đầy đủ"
                                            value={formData.name}
                                            onChange={handleChange}
                                            style={{ color: 'white !important' }}
                                        />
                                    </div>
                                </div>

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
                                            placeholder="Nhập địa chỉ email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            style={{ color: 'white !important' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm font-bold text-white mb-3">
                                        Số điện thoại
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-6 w-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl shadow-lg text-white placeholder-gray-300"
                                            placeholder="Nhập số điện thoại"
                                            value={formData.phone}
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
                                            autoComplete="new-password"
                                            required
                                            className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl shadow-lg text-white placeholder-gray-300"
                                            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                                            value={formData.password}
                                            onChange={handleChange}
                                            style={{ color: 'white !important' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-bold text-white mb-3">
                                        Xác nhận mật khẩu
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-6 w-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            autoComplete="new-password"
                                            required
                                            className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white/5 backdrop-blur-xl shadow-lg text-white placeholder-gray-300"
                                            placeholder="Nhập lại mật khẩu"
                                            value={formData.confirmPassword}
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
                                        <span className="ml-2">Đang tạo tài khoản...</span>
                                    </div>
                                ) : (
                                    'Tạo tài khoản'
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-purple-200">
                                    Đã có tài khoản?{' '}
                                    <Link
                                        to="/login"
                                        className="font-bold text-purple-300 hover:text-white transition-colors duration-300"
                                    >
                                        Đăng nhập ngay
                                    </Link>
                                </p>
                            </div>
                        </form>

                        {/* Terms */}
                        <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/30">
                            <p className="text-xs text-purple-200 text-center">
                                Bằng cách đăng ký, bạn đồng ý với{' '}
                                <a href="#" className="text-purple-300 hover:text-white font-medium transition-colors">
                                    Điều khoản sử dụng
                                </a>{' '}
                                và{' '}
                                <a href="#" className="text-purple-300 hover:text-white font-medium transition-colors">
                                    Chính sách bảo mật
                                </a>{' '}
                                của chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
