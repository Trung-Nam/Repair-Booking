import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

const Navbar = () => {
    const { user, isLoggedIn, logout, getRoleName } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
    };

    // Function to check if a link is active
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    // Function to get link classes with active state
    const getLinkClasses = (path, isMobile = false) => {
        const baseClasses = isMobile
            ? "block px-3 py-2 rounded-md text-base font-medium transition-colors"
            : "px-3 py-2 rounded-md text-sm font-medium transition-colors";

        if (isActive(path)) {
            return `${baseClasses} text-primary-600 bg-primary-50`;
        }
        return `${baseClasses} text-gray-700 hover:text-primary-600`;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getRoleBasedLinks = () => {
        if (!isLoggedIn) return [];

        const role = user?.role;

        switch (role) {
            case 0: // CUSTOMER
                return [
                    { to: '/booking-history', label: 'Lịch sử đặt lịch' }
                ];
            case 1: // ADMIN
                return [
                    { to: '/admin/services', label: 'Quản lý dịch vụ' },
                    { to: '/admin/employees', label: 'Quản lý nhân viên' }
                ];
            case 2: // EMPLOYEE
                return [
                    { to: '/employee/bookings', label: 'Danh sách booking' }
                ];
            default:
                return [];
        }
    };

    const getUserMenuItems = () => {
        const role = user?.role;
        const baseItems = [
            { name: 'Hồ sơ', href: '/profile', icon: '👤' },
            { name: 'Đổi mật khẩu', href: '/change-password', icon: '🔒' }
        ];

        switch (role) {
            case 0: // CUSTOMER
                return [
                    ...baseItems
                ];
            case 1: // ADMIN
                return [
                    ...baseItems
                ];
            case 2: // EMPLOYEE
                return [
                    ...baseItems
                ];
            default:
                return baseItems;
        }
    };

    return (
        <nav className="bg-gradient-to-r from-purple-900/95 via-purple-800/95 to-purple-900/95 backdrop-blur-xl border-b border-purple-400/30 sticky top-0 z-50 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300 shadow-lg group-hover:shadow-purple-500/25">
                                <span className="text-white font-black text-lg">R</span>
                            </div>
                            <span className="ml-4 text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Repair booking</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link
                            to="/"
                            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${isActive('/')
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            Trang chủ
                        </Link>
                        <Link
                            to="/services"
                            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${isActive('/services')
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            Dịch vụ
                        </Link>
                        <Link
                            to="/about"
                            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${isActive('/about')
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            Về chúng tôi
                        </Link>
                        <Link
                            to="/contact"
                            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${isActive('/contact')
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                : 'text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            Liên hệ
                        </Link>

                        {getRoleBasedLinks().map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${isActive(link.to)
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {isLoggedIn ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-2xl backdrop-blur-sm"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-sm">
                                            {user?.fullname?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold">{user?.fullname}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 py-3 z-50 rounded-2xl shadow-2xl">
                                        <div className="px-4 py-3 border-b border-purple-500/30">
                                            <div className="text-sm text-white font-bold">{user?.fullname}</div>
                                            <div className="text-xs text-purple-300">{user?.email}</div>
                                        </div>

                                        {getUserMenuItems().map((item, index) => (
                                            <Link
                                                key={index}
                                                to={item.href}
                                                onClick={() => setIsDropdownOpen(false)}
                                                className={`flex items-center px-4 py-3 text-sm transition-all duration-300 ${isActive(item.href)
                                                    ? 'text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                <span className="mr-3 text-lg">{item.icon}</span>
                                                {item.name}
                                            </Link>
                                        ))}

                                        <div className="border-t border-purple-500/30 mt-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-red-500/20 transition-all duration-300"
                                            >
                                                <span className="mr-3 text-lg">🚪</span>
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-sm font-bold text-gray-300 hover:text-white transition-all duration-300 px-6 py-3 rounded-2xl hover:bg-white/10"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/25"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-3 text-gray-300 hover:text-white focus:outline-none transition-all duration-300 bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-sm"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/30">
                        <div className="px-4 pt-6 pb-8 space-y-2">
                            <Link
                                to="/"
                                className={`block px-6 py-4 text-sm font-bold transition-all duration-300 rounded-2xl ${isActive('/')
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Trang chủ
                            </Link>
                            <Link
                                to="/services"
                                className={`block px-6 py-4 text-sm font-bold transition-all duration-300 rounded-2xl ${isActive('/services')
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dịch vụ
                            </Link>
                            <Link
                                to="/about"
                                className={`block px-6 py-4 text-sm font-bold transition-all duration-300 rounded-2xl ${isActive('/about')
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Về chúng tôi
                            </Link>
                            <Link
                                to="/contact"
                                className={`block px-6 py-4 text-sm font-bold transition-all duration-300 rounded-2xl ${isActive('/contact')
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Liên hệ
                            </Link>

                            {getRoleBasedLinks().map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`block px-6 py-4 text-sm font-bold transition-all duration-300 rounded-2xl ${isActive(link.to)
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {isLoggedIn ? (
                                <div className="border-t border-purple-500/30 pt-6 pb-4 mt-6">
                                    <div className="flex items-center px-6 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-white font-bold text-sm">
                                                {user?.fullname?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm text-white font-bold">{user?.fullname}</div>
                                            <div className="text-xs text-purple-300">{getRoleName()}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {getUserMenuItems().map((item, index) => (
                                            <Link
                                                key={index}
                                                to={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={`flex items-center px-6 py-4 text-sm font-bold transition-all duration-300 rounded-2xl ${isActive(item.href)
                                                    ? 'text-white bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                                                    }`}
                                            >
                                                <span className="mr-4 text-lg">{item.icon}</span>
                                                {item.name}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full text-left px-6 py-4 text-sm font-bold text-gray-300 hover:text-white hover:bg-red-500/20 transition-all duration-300 rounded-2xl"
                                        >
                                            <span className="mr-4 text-lg">🚪</span>
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-t border-purple-500/30 pt-6 pb-4 mt-6 space-y-2">
                                    <Link
                                        to="/login"
                                        className="block px-6 py-4 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-2xl"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-6 py-4 text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
