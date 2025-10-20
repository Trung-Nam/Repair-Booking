import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from '../components/LoadingSpinner';
import Avatar from '../components/Avatar';

const ServiceCard = ({ service }) => {
    const { user, isLoggedIn } = useAuthStore();

    return (
        <div className="group bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden border border-white/20 hover:border-white/40 transform hover:-translate-y-4">
            <div className="relative overflow-hidden">
                <img
                    src={service.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'}
                    alt={service.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                        {service.category}
                    </span>
                </div>
                <div className="absolute top-4 right-4">
                    <div className="flex items-center bg-white/90 backdrop-blur-xl rounded-full px-3 py-2 shadow-lg">
                        {service.averageRating && service.averageRating > 0 ? (
                            <>
                                <svg className="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                                <span className="text-sm font-bold text-gray-800">
                                    {service.averageRating.toFixed(1)}
                                </span>
                                {service.totalRatings > 0 && (
                                    <span className="text-xs text-gray-600 ml-1">
                                        ({service.totalRatings})
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-xs font-bold text-gray-600 px-1">
                                Chưa có đánh giá
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8">
                <Link to={`/services/${service.id}`} className="block">
                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                        {service.name}
                    </h3>
                </Link>
                <p className="text-gray-300 mb-6 line-clamp-2 leading-relaxed text-lg">{service.description}</p>

                <div className="flex items-center justify-between mb-8">
                    <div className="text-right">
                        <div className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                            {service.price.toLocaleString('vi-VN')}đ
                        </div>
                    </div>
                </div>

                {/* Hiển thị nút đặt dịch vụ cho Customer hoặc chưa đăng nhập */}
                {!isLoggedIn || user?.role === 0 ? (
                    <Link
                        to={!isLoggedIn ? "/login" : `/booking/${service.id}`}
                        className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-center block transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                        Đặt dịch vụ ngay
                    </Link>
                ) : (
                    <div className="w-full bg-gray-100/20 text-gray-400 font-bold py-4 px-6 rounded-2xl text-center backdrop-blur-sm">
                        Chỉ khách hàng mới có thể đặt dịch vụ
                    </div>
                )}
            </div>
        </div>
    );
};

const ServicesSection = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Search & Filter States
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        field: null, // 1: service name, 2: category, 3: search all fields
        fromPrice: '',
        toPrice: '',
        pageNumber: 1,
        pageSize: 6
    });

    // Pagination Info
    const [paginationInfo, setPaginationInfo] = useState({
        totalItems: 0,
        totalPages: 0,
        currentPage: 1
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchServices();
    }, [searchParams.pageNumber]);

    const fetchServices = async () => {
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

            if (searchParams.fromPrice) {
                params.append('FromPrice', searchParams.fromPrice);
            }

            if (searchParams.toPrice) {
                params.append('ToPrice', searchParams.toPrice);
            }

            const response = await axiosInstance.get(`/services?${params.toString()}`);

            if (response.data.code === 1000) {
                const servicesData = response.data.result.items;

                // Fetch ratings for each service
                const servicesWithRatings = await Promise.all(
                    servicesData.map(async (service) => {
                        try {
                            const ratingResponse = await axiosInstance.get(`/services/${service.id}/rating`);
                            if (ratingResponse.data.code === 1000) {
                                return {
                                    ...service,
                                    averageRating: ratingResponse.data.result?.averageRating || 0,
                                    totalRatings: ratingResponse.data.result?.totalRatings || 0
                                };
                            }
                        } catch (error) {
                            console.warn(`Failed to fetch rating for service ${service.id}:`, error);
                        }
                        return {
                            ...service,
                            averageRating: service.averageRating || 0,
                            totalRatings: 0
                        };
                    })
                );

                setServices(servicesWithRatings);
                setPaginationInfo({
                    totalItems: response.data.result.totalItems,
                    totalPages: response.data.result.totalPages,
                    currentPage: response.data.result.page
                });

                // Extract categories from API data
                const uniqueCategories = [...new Set(servicesWithRatings.map(service => service.category))];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleSearch = () => {
        setSearchParams(prev => ({ ...prev, pageNumber: 1 }));
        fetchServices();
    };

    const handlePageChange = (page) => {
        setSearchParams(prev => ({ ...prev, pageNumber: page }));
    };

    const handleClearFilters = () => {
        setSearchParams({
            keyword: '',
            field: null,
            fromPrice: '',
            toPrice: '',
            pageNumber: 1,
            pageSize: 6
        });
    };

    useEffect(() => {
        if (searchParams.keyword === '' && searchParams.fromPrice === '' && searchParams.toPrice === '') {
            fetchServices();
        }
    }, [searchParams.keyword, searchParams.fromPrice, searchParams.toPrice]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-16">
                <div className="mb-6">
                    <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm">
                        <span className="text-blue-300 text-sm font-medium">🛠️ Dịch vụ chuyên nghiệp</span>
                    </div>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Dịch vụ của chúng tôi
                    </span>
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    Tất cả các dịch vụ sửa chữa nhà cửa bạn cần với đội ngũ thợ lành nghề và công nghệ hiện đại
                </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-16 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                    {/* Search Input */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-white mb-2">Tìm kiếm dịch vụ</label>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Nhập từ khóa tìm kiếm..."
                                value={searchParams.keyword}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Search Field */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Tìm kiếm theo</label>
                        <select
                            value={searchParams.field || ''}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, field: e.target.value ? parseInt(e.target.value) : null }))}
                            className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Chọn trường tìm kiếm</option>
                            <option value="1">Tên dịch vụ</option>
                            <option value="2">Danh mục</option>
                            <option value="3">Tất cả</option>
                        </select>
                    </div>

                    {/* Price Range */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Khoảng giá</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Từ"
                                value={searchParams.fromPrice}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, fromPrice: e.target.value }))}
                                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Đến"
                                value={searchParams.toPrice}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, toPrice: e.target.value }))}
                                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={handleSearch}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Tìm kiếm
                    </button>
                    <button
                        onClick={handleClearFilters}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Xóa bộ lọc
                    </button>
                </div>

                {/* Results Info */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-white">
                        Hiển thị <span className="font-semibold">{services.length}</span> trên tổng số <span className="font-semibold">{paginationInfo.totalItems}</span> dịch vụ
                        {searchParams.keyword && (
                            <span> - Kết quả tìm kiếm cho "<span className="font-semibold text-blue-600">{searchParams.keyword}</span>"</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            {isLoading ? (
                <div className="flex justify-center py-16">
                    <div className="text-center bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                        <LoadingSpinner size="lg" />
                        <p className="mt-4 text-gray-600">Đang tải dịch vụ...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="text-center py-16">
                    <div className="bg-red-50 rounded-lg p-8 max-w-md mx-auto shadow-sm border border-red-200">
                        <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div className="text-red-700 mb-4 font-semibold">{error}</div>
                        <button
                            onClick={fetchServices}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            ) : services.length === 0 ? (
                <div className="text-center py-16">
                    <div className="bg-white rounded-lg p-8 max-w-md mx-auto shadow-sm border border-gray-200">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.579C6.176 11.991 6 11.5 6 11c0-2.761 2.239-5 5-5s5 2.239 5 5c0 .5-.176.991-.176 1.421z" />
                        </svg>
                        <div className="text-gray-700 text-lg mb-2 font-semibold">Không tìm thấy dịch vụ nào</div>
                        <p className="text-gray-600 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                        <button
                            onClick={handleClearFilters}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map(service => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {paginationInfo.totalPages > 1 && (
                        <div className="mt-16 flex justify-center">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20">
                                <div className="flex items-center gap-3">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
                                        disabled={paginationInfo.currentPage === 1}
                                        className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/30 text-gray-300 hover:bg-white/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    {/* Page Numbers */}
                                    {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-110 ${page === paginationInfo.currentPage
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl'
                                                : 'bg-white/10 backdrop-blur-xl border border-white/30 text-gray-300 hover:bg-white/20 hover:shadow-lg'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
                                        disabled={paginationInfo.currentPage === paginationInfo.totalPages}
                                        className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/30 text-gray-300 hover:bg-white/20 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    );
};

const Home = () => {
    const { isLoggedIn, user } = useAuthStore();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
            {/* Hero Section - New Layout */}
            <div className="relative min-h-screen flex items-center">
                {/* Floating Background Elements */}
                <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl animate-bounce"></div>
                <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-pulse"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm">
                                    <span className="text-purple-300 text-sm font-medium">🏠 Dịch vụ sửa chữa chuyên nghiệp</span>
                                </div>

                                <h1 className="text-5xl md:text-7xl font-black leading-tight">
                                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                                        Sửa chữa nhà cửa
                                    </span>
                                    <span className="block text-3xl md:text-5xl text-white/90 mt-2">
                                        Chuyên nghiệp
                                    </span>
                                </h1>

                                <p className="text-xl text-purple-200 leading-relaxed max-w-2xl">
                                    Đội ngũ thợ lành nghề, uy tín, giá cả hợp lý. Sẵn sàng phục vụ 24/7 với chất lượng đảm bảo
                                </p>
                            </div>

                            {!isLoggedIn && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        to="/register"
                                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
                                    >
                                        <span className="relative z-10">Đăng ký ngay</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
                                    >
                                        Đăng nhập
                                    </Link>
                                </div>
                            )}

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-8">
                                <div className="text-center">
                                    <div className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">500+</div>
                                    <div className="text-purple-300 text-sm">Khách hàng</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-black text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">24/7</div>
                                    <div className="text-purple-300 text-sm">Hỗ trợ</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">100%</div>
                                    <div className="text-purple-300 text-sm">Chất lượng</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Visual Element */}
                        <div className="relative">
                            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                                            <span className="text-white text-xl">🔧</span>
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-2">Sửa chữa</h3>
                                        <p className="text-purple-200 text-sm">Chuyên nghiệp</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/30">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                                            <span className="text-white text-xl">⚡</span>
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-2">Nhanh chóng</h3>
                                        <p className="text-blue-200 text-sm">Hiệu quả</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-400/30">
                                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                                            <span className="text-white text-xl">🛡️</span>
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-2">Bảo hành</h3>
                                        <p className="text-green-200 text-sm">Lâu dài</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30">
                                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                                            <span className="text-white text-xl">💰</span>
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-2">Giá tốt</h3>
                                        <p className="text-yellow-200 text-sm">Cạnh tranh</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <ServicesSection />

            {/* Features Section - New Layout */}
            <div className="bg-gradient-to-br from-purple-800/30 to-purple-900/30 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm mb-6">
                            <span className="text-purple-300 text-sm font-medium">⭐ Tại sao chọn chúng tôi?</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Ưu điểm vượt trội
                            </span>
                        </h2>
                        <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                            Chúng tôi cam kết mang đến dịch vụ tốt nhất với những ưu điểm vượt trội
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column */}
                        <div className="space-y-8">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                                <div className="flex items-start space-x-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-3">Chất lượng đảm bảo</h3>
                                        <p className="text-purple-200 leading-relaxed">Đội ngũ thợ lành nghề với kinh nghiệm lâu năm, sử dụng vật liệu chất lượng cao và công nghệ hiện đại</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                                <div className="flex items-start space-x-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-3">Phục vụ 24/7</h3>
                                        <p className="text-purple-200 leading-relaxed">Sẵn sàng hỗ trợ mọi lúc mọi nơi, kể cả cuối tuần và ngày lễ với đội ngũ chuyên nghiệp</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                                <div className="flex items-start space-x-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-3">Giá cả hợp lý</h3>
                                        <p className="text-purple-200 leading-relaxed">Báo giá minh bạch, không phát sinh chi phí, đảm bảo giá cạnh tranh nhất thị trường</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                                <div className="flex items-start space-x-6">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-3">Cam kết bảo hành</h3>
                                        <p className="text-purple-200 leading-relaxed">Bảo hành dài hạn cho tất cả công trình, đảm bảo chất lượng lâu dài và sự hài lòng của khách hàng</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section - New Layout */}
            <div className="bg-gradient-to-br from-purple-700/20 to-purple-800/20 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm mb-6">
                            <span className="text-purple-300 text-sm font-medium">💬 Khách hàng nói gì</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Phản hồi khách hàng
                            </span>
                        </h2>
                        <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                            Những phản hồi chân thực từ những khách hàng đã tin tưởng sử dụng dịch vụ
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                            <div className="flex items-center mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-white mb-8 leading-relaxed text-lg">
                                "Tuyệt vời! Đội ngũ thợ rất chuyên nghiệp, thi công nhanh chóng và chất lượng vượt mong đợi.
                                Nhà tôi sau khi sửa chữa trông như mới hoàn toàn. Sẽ tiếp tục ủng hộ!"
                            </p>
                            <div className="flex items-center">
                                <Avatar
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
                                    alt="Customer"
                                    className="w-14 h-14 rounded-full mr-4"
                                />
                                <div>
                                    <div className="font-bold text-white text-lg">Anh Minh</div>
                                    <div className="text-purple-300">Quận 1, TP.HCM</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                            <div className="flex items-center mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-white mb-8 leading-relaxed text-lg">
                                "Dịch vụ tuyệt vời! Giá cả hợp lý, không phát sinh chi phí ẩn.
                                Thợ rất thân thiện, giải thích rõ ràng từng bước thi công.
                                Chất lượng công trình vượt ngoài mong đợi!"
                            </p>
                            <div className="flex items-center">
                                <Avatar
                                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
                                    alt="Customer"
                                    className="w-14 h-14 rounded-full mr-4"
                                />
                                <div>
                                    <div className="font-bold text-white text-lg">Chị Lan</div>
                                    <div className="text-purple-300">Quận 3, TP.HCM</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                            <div className="flex items-center mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-white mb-8 leading-relaxed text-lg">
                                "Thi công đúng tiến độ, chất lượng hoàn hảo! Đội ngũ thợ rất có tâm,
                                làm việc cẩn thận từng chi tiết. Sẽ giới thiệu cho bạn bè và gia đình sử dụng dịch vụ."
                            </p>
                            <div className="flex items-center">
                                <Avatar
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
                                    alt="Customer"
                                    className="w-14 h-14 rounded-full mr-4"
                                />
                                <div>
                                    <div className="font-bold text-white text-lg">Anh Tuấn</div>
                                    <div className="text-purple-300">Quận 7, TP.HCM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Process Section - New Layout */}
            <div className="bg-gradient-to-br from-purple-800/40 to-purple-900/40 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm mb-6">
                            <span className="text-purple-300 text-sm font-medium">🔄 Quy trình làm việc</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                4 bước đơn giản
                            </span>
                        </h2>
                        <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                            Quy trình làm việc chuyên nghiệp, đảm bảo chất lượng và tiến độ
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="group h-full">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 text-center h-full flex flex-col">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white text-3xl font-bold">1</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Tư vấn & Khảo sát</h3>
                                <p className="text-purple-200 leading-relaxed flex-grow">
                                    Tư vấn miễn phí và khảo sát hiện trạng để đưa ra giải pháp tối ưu nhất
                                </p>
                            </div>
                        </div>

                        <div className="group h-full">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 text-center h-full flex flex-col">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white text-3xl font-bold">2</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Báo giá & Ký hợp đồng</h3>
                                <p className="text-purple-200 leading-relaxed flex-grow">
                                    Báo giá chi tiết, minh bạch và ký kết hợp đồng rõ ràng
                                </p>
                            </div>
                        </div>

                        <div className="group h-full">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 text-center h-full flex flex-col">
                                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white text-3xl font-bold">3</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Thi công & Giám sát</h3>
                                <p className="text-purple-200 leading-relaxed flex-grow">
                                    Thi công chuyên nghiệp với sự giám sát chất lượng liên tục
                                </p>
                            </div>
                        </div>

                        <div className="group h-full">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 text-center h-full flex flex-col">
                                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white text-3xl font-bold">4</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Nghiệm thu & Bảo hành</h3>
                                <p className="text-purple-200 leading-relaxed flex-grow">
                                    Nghiệm thu kỹ lưỡng và cam kết bảo hành dài hạn
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section - New Layout */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 border border-white/30 backdrop-blur-sm mb-6">
                            <span className="text-white text-sm font-medium">🚀 Sẵn sàng bắt đầu?</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                            <span className="bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                                Bắt đầu dự án ngay
                            </span>
                        </h2>
                        <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
                            Liên hệ ngay để được tư vấn miễn phí và báo giá chi tiết cho dự án của bạn
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        {!isLoggedIn || user?.role === 0 ? (
                            <>
                                <Link
                                    to="/contact"
                                    className="group relative bg-white text-purple-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25 inline-flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Liên hệ ngay
                                </Link>
                                <Link
                                    to="/services"
                                    className="group relative border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm inline-flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Xem dịch vụ
                                </Link>
                            </>
                        ) : user?.role === 1 ? (
                            <div className="text-center">
                                <p className="text-purple-100 mb-6 text-lg">
                                    Bạn đang đăng nhập với tài khoản nhân viên
                                </p>
                                <Link
                                    to="/employee/booking-list"
                                    className="group relative bg-white text-purple-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25 inline-flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    Xem danh sách booking
                                </Link>
                            </div>
                        ) : user?.role === 2 ? (
                            <div className="text-center">
                                <p className="text-purple-100 mb-6 text-lg">
                                    Bạn đang đăng nhập với tài khoản quản trị viên
                                </p>
                                <Link
                                    to="/admin/manage-employees"
                                    className="group relative bg-white text-purple-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25 inline-flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Quản lý hệ thống
                                </Link>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 border-t border-purple-400/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                                    <span className="text-white font-black text-lg">R</span>
                                </div>
                                <span className="text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Repair booking</span>
                            </div>
                            <p className="text-purple-200 mb-6 leading-relaxed">
                                Dịch vụ sửa chữa nhà cửa chuyên nghiệp hàng đầu với đội ngũ thợ lành nghề,
                                uy tín và chất lượng đảm bảo. Cam kết mang đến giải pháp tối ưu cho mọi nhu cầu sửa chữa.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-colors">
                                    <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-colors">
                                    <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-colors">
                                    <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center hover:bg-purple-500/30 transition-colors">
                                    <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6">Liên kết nhanh</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/" className="text-purple-200 hover:text-white transition-colors">
                                        Trang chủ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/services" className="text-purple-200 hover:text-white transition-colors">
                                        Dịch vụ
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about" className="text-purple-200 hover:text-white transition-colors">
                                        Giới thiệu
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-purple-200 hover:text-white transition-colors">
                                        Liên hệ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6">Thông tin liên hệ</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-purple-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span className="text-purple-200">+84 123 456 789</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-purple-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-purple-200">info@hsms.com</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-purple-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-purple-200">TP.HCM, Việt Nam</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-purple-400/30 mt-12 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-purple-300 text-sm">
                                © 2024 Repair booking. Tất cả quyền được bảo lưu.
                            </p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                <a href="#" className="text-purple-300 hover:text-white text-sm transition-colors">
                                    Chính sách bảo mật
                                </a>
                                <a href="#" className="text-purple-300 hover:text-white text-sm transition-colors">
                                    Điều khoản sử dụng
                                </a>
                                <a href="#" className="text-purple-300 hover:text-white text-sm transition-colors">
                                    Liên hệ
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default Home;
