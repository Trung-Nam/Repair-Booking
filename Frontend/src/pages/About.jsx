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
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white">
            {/* Hero Section - Split Layout */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.12),transparent_50%)]"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center px-6 py-3 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-sm">
                                <span className="text-purple-200 text-sm font-medium">Về chúng tôi</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black leading-tight">
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Repair booking</span>
                            </h1>
                            <p className="text-xl text-purple-200 leading-relaxed">
                                Đội ngũ chuyên nghiệp với nhiều năm kinh nghiệm trong lĩnh vực sửa chữa nhà cửa.
                                Chúng tôi cam kết mang đến những giải pháp tối ưu nhất cho ngôi nhà của bạn.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20">
                                    <div className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                                        15+
                                    </div>
                                    <div className="text-purple-200 text-sm">Năm kinh nghiệm</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20">
                                    <div className="text-2xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                                        1000+
                                    </div>
                                    <div className="text-purple-200 text-sm">Dự án hoàn thành</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="relative">
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                                <div className="grid grid-cols-2 gap-6">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="text-center bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <div className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">
                                                {stat.number}
                                            </div>
                                            <div className="text-purple-200 text-sm font-medium">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Pills */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-wrap justify-center gap-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/25'
                                    : 'bg-white/10 backdrop-blur-xl text-purple-200 hover:bg-white/20 border border-white/20'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
                    <div className="p-8 lg:p-12">
                        {activeTab === 'about' && (
                            <div className="space-y-12">
                                <div className="text-center">
                                    <h2 className="text-4xl font-black mb-6">Giới thiệu về chúng tôi</h2>
                                    <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
                                        Repair booking là công ty hàng đầu trong lĩnh vực sửa chữa và cải tạo nhà cửa tại Việt Nam.
                                        Với hơn 15 năm kinh nghiệm, chúng tôi đã phục vụ hàng nghìn khách hàng với chất lượng
                                        dịch vụ vượt trội và đội ngũ thợ lành nghề.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4">Chất lượng đảm bảo</h3>
                                        <p className="text-purple-200 leading-relaxed">Sử dụng vật liệu chất lượng cao, đảm bảo độ bền lâu dài</p>
                                    </div>

                                    <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4">Thi công nhanh chóng</h3>
                                        <p className="text-purple-200 leading-relaxed">Quy trình tối ưu, đảm bảo tiến độ như cam kết</p>
                                    </div>

                                    <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4">Giá cả cạnh tranh</h3>
                                        <p className="text-purple-200 leading-relaxed">Báo giá minh bạch, không phát sinh chi phí</p>
                                    </div>

                                    <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75 9.75 0 019.75-9.75z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4">Bảo hành dài hạn</h3>
                                        <p className="text-purple-200 leading-relaxed">Chính sách bảo hành toàn diện cho mọi dịch vụ</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'mission' && (
                            <div className="space-y-12">
                                <div className="text-center">
                                    <h2 className="text-4xl font-black mb-6">Sứ mệnh & Tầm nhìn</h2>
                                </div>

                                <div className="grid lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-400/30">
                                            <div className="flex items-center mb-6">
                                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-2xl font-bold text-white">Sứ mệnh</h3>
                                            </div>
                                            <p className="text-purple-200 leading-relaxed text-lg">
                                                Mang đến cho khách hàng những giải pháp sửa chữa nhà cửa tốt nhất với chất lượng
                                                vượt trội, giá cả hợp lý và dịch vụ chuyên nghiệp. Chúng tôi cam kết xây dựng
                                                những ngôi nhà an toàn, tiện nghi và bền đẹp cho gia đình Việt Nam.
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl p-8 border border-blue-400/30">
                                            <div className="flex items-center mb-6">
                                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-2xl font-bold text-white">Tầm nhìn</h3>
                                            </div>
                                            <p className="text-purple-200 leading-relaxed text-lg">
                                                Trở thành công ty hàng đầu trong lĩnh vực sửa chữa nhà cửa tại Việt Nam,
                                                được khách hàng tin tưởng và đối tác đánh giá cao. Chúng tôi hướng đến việc
                                                phát triển bền vững và mang lại giá trị lâu dài cho cộng đồng.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-3xl p-8 border border-green-400/30">
                                        <div className="flex items-center mb-6">
                                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white">Giá trị cốt lõi</h3>
                                        </div>
                                        <ul className="space-y-4">
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-300 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <strong className="text-white">Chất lượng:</strong>
                                                    <span className="text-purple-200 ml-2">Đặt chất lượng lên hàng đầu trong mọi sản phẩm và dịch vụ</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-300 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <strong className="text-white">Uy tín:</strong>
                                                    <span className="text-purple-200 ml-2">Xây dựng lòng tin thông qua sự minh bạch và cam kết</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-300 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <strong className="text-white">Đổi mới:</strong>
                                                    <span className="text-purple-200 ml-2">Không ngừng cải tiến và áp dụng công nghệ mới</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start">
                                                <svg className="w-5 h-5 text-green-300 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <div>
                                                    <strong className="text-white">Khách hàng:</strong>
                                                    <span className="text-purple-200 ml-2">Đặt nhu cầu và sự hài lòng của khách hàng làm trung tâm</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'team' && (
                            <div className="space-y-12">
                                <div className="text-center">
                                    <h2 className="text-4xl font-black mb-6">Đội ngũ của chúng tôi</h2>
                                    <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                                        Đội ngũ chuyên gia giàu kinh nghiệm và tâm huyết với nghề
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {teamMembers.map((member, index) => (
                                        <div key={index} className="group bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-4">
                                            <div className="relative mb-6">
                                                <Avatar
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/20 group-hover:border-purple-400/50 transition-colors duration-300"
                                                />
                                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                                            <p className="text-purple-300 font-medium mb-4 text-lg">{member.position}</p>
                                            <p className="text-purple-200 leading-relaxed">{member.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-12">
                                <div className="text-center">
                                    <h2 className="text-4xl font-black mb-6">Lịch sử phát triển</h2>
                                    <p className="text-xl text-purple-200 max-w-3xl mx-auto">
                                        Hành trình 15 năm xây dựng và phát triển
                                    </p>
                                </div>

                                <div className="relative">
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>

                                    <div className="space-y-12">
                                        <div className="relative flex items-center justify-center">
                                            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white/20 shadow-2xl"></div>
                                            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 ml-8">
                                                <div className="text-purple-300 font-bold text-lg mb-2">2009</div>
                                                <h3 className="text-2xl font-bold text-white mb-4">Thành lập công ty</h3>
                                                <p className="text-purple-200 leading-relaxed">
                                                    Repair booking được thành lập với đội ngũ 10 nhân viên đầu tiên,
                                                    chuyên về sửa chữa nhà ở và văn phòng.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative flex items-center justify-center">
                                            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white/20 shadow-2xl"></div>
                                            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mr-8">
                                                <div className="text-purple-300 font-bold text-lg mb-2">2015</div>
                                                <h3 className="text-2xl font-bold text-white mb-4">Mở rộng dịch vụ</h3>
                                                <p className="text-purple-200 leading-relaxed">
                                                    Mở rộng sang lĩnh vực cải tạo và thiết kế nội thất,
                                                    phục vụ hơn 500 khách hàng.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative flex items-center justify-center">
                                            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white/20 shadow-2xl"></div>
                                            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 ml-8">
                                                <div className="text-purple-300 font-bold text-lg mb-2">2020</div>
                                                <h3 className="text-2xl font-bold text-white mb-4">Công nghệ số</h3>
                                                <p className="text-purple-200 leading-relaxed">
                                                    Áp dụng công nghệ số vào quy trình quản lý và phục vụ khách hàng,
                                                    nâng cao hiệu quả hoạt động.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative flex items-center justify-center">
                                            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white/20 shadow-2xl"></div>
                                            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 mr-8">
                                                <div className="text-purple-300 font-bold text-lg mb-2">2024</div>
                                                <h3 className="text-2xl font-bold text-white mb-4">Hiện tại</h3>
                                                <p className="text-purple-200 leading-relaxed">
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
