import { useState } from 'react';
import Avatar from '../components/Avatar';

const About = () => {
    const [activeTab, setActiveTab] = useState('about');

    const tabs = [
        { id: 'about', label: 'Về chúng tôi' },
        { id: 'mission', label: 'Sứ mệnh' },
        { id: 'team', label: 'Đội ngũ' },
        { id: 'history', label: 'Lịch sử' }
    ];

    const teamMembers = [
        {
            name: 'Nguyễn Văn A',
            position: 'Giám đốc',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
            description: 'Hơn 15 năm kinh nghiệm trong lĩnh vực xây dựng và sửa chữa nhà cửa'
        },
        {
            name: 'Trần Thị B',
            position: 'Trưởng phòng kỹ thuật',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
            description: 'Chuyên gia về hệ thống điện và nước, đảm bảo chất lượng công trình'
        },
        {
            name: 'Lê Văn C',
            position: 'Giám sát thi công',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
            description: 'Quản lý và giám sát các dự án lớn, đảm bảo tiến độ và chất lượng'
        }
    ];

    const stats = [
        { number: '500+', label: 'Khách hàng hài lòng' },
        { number: '1000+', label: 'Dự án hoàn thành' },
        { number: '15+', label: 'Năm kinh nghiệm' },
        { number: '50+', label: 'Nhân viên chuyên nghiệp' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Về chúng tôi
                    </h1>
                    <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                        Đội ngũ chuyên nghiệp với nhiều năm kinh nghiệm trong lĩnh vực sửa chữa nhà cửa
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200">
                        <nav className="flex overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {activeTab === 'about' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-gray-900">Repair booking</h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Repair booking là công ty hàng đầu trong lĩnh vực sửa chữa và cải tạo nhà cửa tại Việt Nam.
                                    Với hơn 15 năm kinh nghiệm, chúng tôi đã phục vụ hàng nghìn khách hàng với chất lượng
                                    dịch vụ vượt trội và đội ngũ thợ lành nghề.
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Chúng tôi cam kết mang đến những giải pháp tối ưu nhất cho ngôi nhà của bạn,
                                    từ sửa chữa nhỏ đến cải tạo lớn, với giá cả hợp lý và thời gian thi công nhanh chóng.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6 mt-8">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Chất lượng đảm bảo</h3>
                                            <p className="text-gray-600">Sử dụng vật liệu chất lượng cao, đảm bảo độ bền lâu dài</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Thi công nhanh chóng</h3>
                                            <p className="text-gray-600">Quy trình tối ưu, đảm bảo tiến độ như cam kết</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Giá cả cạnh tranh</h3>
                                            <p className="text-gray-600">Báo giá minh bạch, không phát sinh chi phí</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75 9.75 0 019.75-9.75z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Bảo hành dài hạn</h3>
                                            <p className="text-gray-600">Chính sách bảo hành toàn diện cho mọi dịch vụ</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'mission' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-gray-900">Sứ mệnh của chúng tôi</h2>
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-xl">
                                        <h3 className="text-xl font-bold text-primary-800 mb-3">Sứ mệnh</h3>
                                        <p className="text-primary-700 leading-relaxed">
                                            Mang đến cho khách hàng những giải pháp sửa chữa nhà cửa tốt nhất với chất lượng
                                            vượt trội, giá cả hợp lý và dịch vụ chuyên nghiệp. Chúng tôi cam kết xây dựng
                                            những ngôi nhà an toàn, tiện nghi và bền đẹp cho gia đình Việt Nam.
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                                        <h3 className="text-xl font-bold text-green-800 mb-3">Tầm nhìn</h3>
                                        <p className="text-green-700 leading-relaxed">
                                            Trở thành công ty hàng đầu trong lĩnh vực sửa chữa nhà cửa tại Việt Nam,
                                            được khách hàng tin tưởng và đối tác đánh giá cao. Chúng tôi hướng đến việc
                                            phát triển bền vững và mang lại giá trị lâu dài cho cộng đồng.
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                                        <h3 className="text-xl font-bold text-blue-800 mb-3">Giá trị cốt lõi</h3>
                                        <ul className="text-blue-700 space-y-2">
                                            <li className="flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <strong>Chất lượng:</strong> Đặt chất lượng lên hàng đầu trong mọi sản phẩm và dịch vụ
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <strong>Uy tín:</strong> Xây dựng lòng tin thông qua sự minh bạch và cam kết
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <strong>Đổi mới:</strong> Không ngừng cải tiến và áp dụng công nghệ mới
                                            </li>
                                            <li className="flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <strong>Khách hàng:</strong> Đặt nhu cầu và sự hài lòng của khách hàng làm trung tâm
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'team' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-gray-900">Đội ngũ của chúng tôi</h2>
                                <p className="text-lg text-gray-600">
                                    Đội ngũ chuyên gia giàu kinh nghiệm và tâm huyết với nghề
                                </p>
                                <div className="grid md:grid-cols-3 gap-8 mt-8">
                                    {teamMembers.map((member, index) => (
                                        <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                                            <Avatar
                                                src={member.image}
                                                alt={member.name}
                                                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                                            />
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                                            <p className="text-primary-600 font-medium mb-3">{member.position}</p>
                                            <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-gray-900">Lịch sử phát triển</h2>
                                <div className="relative">
                                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200"></div>
                                    <div className="space-y-8">
                                        <div className="relative flex items-start">
                                            <div className="absolute left-6 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                                            <div className="ml-16 bg-white p-6 rounded-lg shadow-md">
                                                <div className="text-primary-600 font-bold">2009</div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Thành lập công ty</h3>
                                                <p className="text-gray-600">
                                                    HSMS được thành lập với đội ngũ 10 nhân viên đầu tiên,
                                                    chuyên về sửa chữa nhà ở và văn phòng.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="relative flex items-start">
                                            <div className="absolute left-6 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                                            <div className="ml-16 bg-white p-6 rounded-lg shadow-md">
                                                <div className="text-primary-600 font-bold">2015</div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mở rộng dịch vụ</h3>
                                                <p className="text-gray-600">
                                                    Mở rộng sang lĩnh vực cải tạo và thiết kế nội thất,
                                                    phục vụ hơn 500 khách hàng.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="relative flex items-start">
                                            <div className="absolute left-6 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                                            <div className="ml-16 bg-white p-6 rounded-lg shadow-md">
                                                <div className="text-primary-600 font-bold">2020</div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Công nghệ số</h3>
                                                <p className="text-gray-600">
                                                    Áp dụng công nghệ số vào quy trình quản lý và phục vụ khách hàng,
                                                    nâng cao hiệu quả hoạt động.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="relative flex items-start">
                                            <div className="absolute left-6 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                                            <div className="ml-16 bg-white p-6 rounded-lg shadow-md">
                                                <div className="text-primary-600 font-bold">2024</div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Hiện tại</h3>
                                                <p className="text-gray-600">
                                                    Phục vụ hơn 1000 khách hàng với đội ngũ 50+ nhân viên chuyên nghiệp,
                                                    trở thành đối tác tin cậy của nhiều doanh nghiệp.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
