import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../store/useAuthStore';

const ServiceCard = ({ service }) => {
    const { user, isLoggedIn } = useAuthStore();

    return (
        <div className="group bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden transform hover:-translate-y-4 border border-white/20 hover:border-white/40">
            <div className="relative overflow-hidden">
                <img
                    src={service.imageUrl || service.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'}
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
                            {service.price ? service.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}
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

const Services = () => {
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Search & Filter States
    const [searchParams, setSearchParams] = useState({
        keyword: '',
        field: null, // 1: service name, 2: category
        fromPrice: '',
        toPrice: '',
        pageNumber: 1,
        pageSize: 9
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
            pageSize: 9
        });
    };

    useEffect(() => {
        if (searchParams.keyword === '' && searchParams.fromPrice === '' && searchParams.toPrice === '') {
            fetchServices();
        }
    }, [searchParams.keyword, searchParams.fromPrice, searchParams.toPrice]);



    const filteredServices = selectedCategory === 'all'
        ? services
        : services.filter(service => service.category === selectedCategory);

    const serviceFeatures = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Chất lượng đảm bảo',
            description: 'Sử dụng vật liệu cao cấp và quy trình kiểm tra nghiêm ngặt'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Thi công nhanh chóng',
            description: 'Đội ngũ thợ chuyên nghiệp, hoàn thành đúng tiến độ cam kết'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            title: 'Giá cả hợp lý',
            description: 'Báo giá minh bạch, không phát sinh chi phí, cạnh tranh nhất thị trường'
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75 9.75 0 019.75-9.75z" />
                </svg>
            ),
            title: 'Bảo hành dài hạn',
            description: 'Chính sách bảo hành toàn diện từ 6 tháng đến 2 năm'
        }
    ];

    const processSteps = [
        {
            step: '01',
            title: 'Tư vấn & Khảo sát',
            description: 'Tư vấn miễn phí và khảo sát hiện trạng để đưa ra giải pháp tối ưu',
            icon: '📋'
        },
        {
            step: '02',
            title: 'Báo giá & Ký hợp đồng',
            description: 'Báo giá chi tiết, minh bạch và ký kết hợp đồng rõ ràng',
            icon: '📝'
        },
        {
            step: '03',
            title: 'Thi công & Giám sát',
            description: 'Thi công chuyên nghiệp với sự giám sát chất lượng liên tục',
            icon: '🔨'
        },
        {
            step: '04',
            title: 'Nghiệm thu & Bảo hành',
            description: 'Nghiệm thu kỹ lưỡng và cam kết bảo hành dài hạn',
            icon: '✅'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-purple-900/90"></div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl animate-bounce"></div>
                <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-500/20 rounded-full blur-lg animate-pulse"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm">
                            <span className="text-blue-300 text-sm font-medium">🛠️ Dịch vụ chuyên nghiệp</span>
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Dịch vụ của chúng tôi
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        Tất cả các dịch vụ sửa chữa nhà cửa bạn cần với đội ngũ thợ lành nghề và công nghệ hiện đại
                    </p>
                </div>
            </div>

            {/* Service Features */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="mb-6">
                            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm">
                                <span className="text-purple-300 text-sm font-medium">✨ Ưu điểm vượt trội</span>
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Tại sao chọn dịch vụ của chúng tôi?
                        </h2>
                        <p className="text-xl text-gray-300 font-light">Những ưu điểm vượt trội của Repair booking</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {serviceFeatures.map((feature, index) => (
                            <div key={index} className="text-center group h-full">
                                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-4 border border-white/20 hover:border-white/40 h-full flex flex-col">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-4">{feature.title}</h3>
                                    <p className="text-gray-300 text-lg leading-relaxed flex-grow">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <div className="mb-6">
                        <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm">
                            <span className="text-blue-300 text-sm font-medium">🔍 Tìm kiếm thông minh</span>
                        </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Tìm kiếm dịch vụ</h2>
                    <p className="text-xl text-gray-300 font-light">Tìm kiếm và lọc dịch vụ theo nhu cầu của bạn</p>
                </div>

                {/* Search and Filter Form */}
                <div className="mb-12 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                        {/* Search Input */}
                        <div className="lg:col-span-2">
                            <label className="block text-lg font-bold text-white mb-3">Tìm kiếm dịch vụ</label>
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Nhập từ khóa tìm kiếm..."
                                    value={searchParams.keyword}
                                    onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
                                    className="w-full pl-14 pr-6 py-4 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-lg bg-white/5 backdrop-blur-xl shadow-lg transition-all duration-300 text-white placeholder-gray-300"
                                    style={{ color: 'white !important' }}
                                />
                            </div>
                        </div>

                        {/* Search Field */}
                        <div>
                            <label className="block text-lg font-bold text-white mb-3">Tìm kiếm theo</label>
                            <select
                                value={searchParams.field || ''}
                                onChange={(e) => setSearchParams(prev => ({ ...prev, field: e.target.value ? parseInt(e.target.value) : null }))}
                                className="w-full py-4 px-6 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-lg bg-white/5 backdrop-blur-xl shadow-lg transition-all duration-300 text-white"
                                style={{ color: 'white !important' }}
                            >
                                <option value="" className="bg-gray-800 text-white">Tất cả</option>
                                <option value="1" className="bg-gray-800 text-white">Tên dịch vụ</option>
                                <option value="2" className="bg-gray-800 text-white">Danh mục</option>
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-lg font-bold text-white mb-3">Khoảng giá</label>
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    placeholder="Từ"
                                    value={searchParams.fromPrice}
                                    onChange={(e) => setSearchParams(prev => ({ ...prev, fromPrice: e.target.value }))}
                                    className="w-full py-4 px-4 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-lg bg-white/5 backdrop-blur-xl shadow-lg transition-all duration-300 text-white placeholder-gray-300"
                                    style={{ color: 'white !important' }}
                                />
                                <input
                                    type="number"
                                    placeholder="Đến"
                                    value={searchParams.toPrice}
                                    onChange={(e) => setSearchParams(prev => ({ ...prev, toPrice: e.target.value }))}
                                    className="w-full py-4 px-4 border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 text-lg bg-white/5 backdrop-blur-xl shadow-lg transition-all duration-300 text-white placeholder-gray-300"
                                    style={{ color: 'white !important' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-6">
                        <button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl flex items-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Tìm kiếm
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white px-10 py-4 rounded-2xl font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-2xl border-2 border-white/30 flex items-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Xóa bộ lọc
                        </button>
                    </div>

                    {/* Results Info */}
                    <div className="mt-8 pt-6 border-t border-white/30">
                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6">
                            <p className="text-lg text-white">
                                Hiển thị <span className="font-black text-purple-300">{services.length}</span> trên tổng số <span className="font-black text-pink-300">{paginationInfo.totalItems}</span> dịch vụ
                                {searchParams.keyword && (
                                    <span> - Kết quả tìm kiếm cho "<span className="font-black text-purple-300">{searchParams.keyword}</span>"</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="text-center mb-12">
                    <h3 className="text-2xl font-bold text-white mb-4">Danh mục dịch vụ</h3>
                    <p className="text-lg text-gray-300">Chọn danh mục để xem các dịch vụ tương ứng</p>
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${selectedCategory === 'all'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                        >
                            Tất cả
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>



                {/* Services Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-24">
                        <div className="text-center bg-white/10 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20">
                            <LoadingSpinner size="lg" />
                            <p className="mt-6 text-gray-300 text-xl font-medium">Đang tải dịch vụ...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center py-24">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-lg mx-auto shadow-2xl border border-white/20">
                            <svg className="w-20 h-20 text-red-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div className="text-red-300 mb-8 font-bold text-xl">{error}</div>
                            <button
                                onClick={fetchServices}
                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-lg mx-auto shadow-2xl border border-white/20">
                            <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.579C6.176 11.991 6 11.5 6 11c0-2.761 2.239-5 5-5s5 2.239 5 5c0 .5-.176.991-.176 1.421z" />
                            </svg>
                            <div className="text-gray-300 text-2xl mb-6 font-bold">Không tìm thấy dịch vụ nào</div>
                            <p className="text-gray-400 text-lg mb-8">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                            <button
                                onClick={handleClearFilters}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredServices.map((service) => (
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

            {/* Process Steps */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="mb-6">
                            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm">
                                <span className="text-purple-300 text-sm font-medium">🔄 Quy trình chuyên nghiệp</span>
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Quy trình làm việc</h2>
                        <p className="text-xl text-gray-300 font-light">4 bước đơn giản để có dịch vụ hoàn hảo</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {processSteps.map((step, index) => (
                            <div key={index} className="relative text-center group">
                                <div className="relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 hover:border-white/40">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-black shadow-xl group-hover:scale-110 transition-transform duration-500">
                                        {step.step}
                                    </div>
                                    <div className="text-4xl mb-4">{step.icon}</div>
                                    <h3 className="text-xl font-black text-white mb-4">{step.title}</h3>
                                    <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
                                </div>

                                {/* Connecting Line */}
                                {index < processSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 left-full w-full h-1 bg-gradient-to-r from-purple-300 via-pink-300 to-transparent transform -translate-y-1/2 z-0 rounded-full"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                        Sẵn sàng bắt đầu dự án của bạn?
                    </h2>
                    <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto font-light">
                        Liên hệ ngay để được tư vấn miễn phí và báo giá chi tiết
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            to="/contact"
                            className="inline-flex items-center px-10 py-5 bg-white text-purple-700 rounded-2xl font-black text-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-3xl"
                        >
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Liên hệ ngay
                        </Link>
                        <Link
                            to="/"
                            className="inline-flex items-center px-10 py-5 border-2 border-white/50 text-white rounded-2xl font-black text-xl hover:bg-white hover:text-purple-700 transition-all duration-300 transform hover:scale-110 backdrop-blur-xl"
                        >
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Tìm hiểu thêm
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;


