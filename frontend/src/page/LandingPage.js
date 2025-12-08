import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Users, TrendingUp, Shield, CheckCircle, Lock, Globe, Zap, Vote, RefreshCw } from 'lucide-react';
import Header from '../components/Header/Header.js';
import Footer from '../components/Footer/Footer.js';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Minh bạch tuyệt đối',
      description: 'Mọi giao dịch được ghi nhận trên blockchain, đảm bảo tính minh bạch và không thể thay đổi. Bạn có thể xem chi tiết mọi khoản đóng góp và cách sử dụng tiền.'
    },
    {
      icon: Users,
      title: 'Cộng đồng quyết định',
      description: 'Người đóng góp có quyền vote và quyết định cách sử dụng quỹ một cách dân chủ. Mỗi donor đều có tiếng nói trong việc phê duyệt các đề xuất chi tiêu.'
    },
    {
      icon: TrendingUp,
      title: 'Hiệu quả cao',
      description: 'Không có trung gian, chi phí thấp, và tiền được chuyển trực tiếp đến người cần. Phí gas thấp và xử lý nhanh chóng trên blockchain.'
    },
    {
      icon: Heart,
      title: 'An toàn & bảo mật',
      description: 'Smart contract đảm bảo tiền chỉ được sử dụng đúng mục đích và có thể hoàn trả. Mã nguồn mở, đã được kiểm tra kỹ lưỡng.'
    }
  ];

  const benefits = [
    {
      icon: Lock,
      title: 'Smart Contract An Toàn',
      description: 'Tiền được lưu trữ trong smart contract an toàn, chỉ có thể sử dụng khi đạt điều kiện và được cộng đồng phê duyệt.'
    },
    {
      icon: Vote,
      title: 'Quyền Vote Theo Đóng Góp',
      description: 'Sức vote của bạn tương ứng với số tiền đóng góp, đảm bảo công bằng và khuyến khích đóng góp nhiều hơn.'
    },
    {
      icon: RefreshCw,
      title: 'Hoàn Tiền Tự Động',
      description: 'Nếu chiến dịch không đạt mục tiêu hoặc quá hạn, tiền sẽ được hoàn lại tự động cho các donor.'
    },
    {
      icon: Globe,
      title: 'Toàn Cầu & Không Biên Giới',
      description: 'Ai cũng có thể tham gia từ bất kỳ đâu trên thế giới, chỉ cần có ví crypto và kết nối internet.'
    },
    {
      icon: Zap,
      title: 'Giao Dịch Nhanh Chóng',
      description: 'Đóng góp và nhận tiền chỉ trong vài giây, không cần chờ đợi ngân hàng hay các thủ tục rườm rà.'
    },
    {
      icon: CheckCircle,
      title: 'Xác Minh Minh Bạch',
      description: 'Mọi đề xuất sử dụng tiền đều phải được cộng đồng xem xét và vote, không có quyết định đơn phương.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden mt-4">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-pink-50 to-orange-50" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200">
              <span className="text-orange-600 font-semibold text-sm">🚀 Nền tảng gây quỹ thế hệ mới</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Gây quỹ cộng đồng
              <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                minh bạch & phi tập trung
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              UET FundChain sử dụng công nghệ Blockchain để tạo ra sự minh bạch, tin cậy và hiệu quả 
              trong mọi chiến dịch từ thiện và dự án cộng đồng. Người đóng góp có toàn quyền kiểm soát 
              và quyết định cách sử dụng tiền quyên góp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/campaigns')}
                className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group"
              >
                Khám phá chiến dịch
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/campaigns')}
                className="btn btn-secondary text-lg px-8 py-4"
              >
                Tạo chiến dịch mới
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>100% Minh bạch</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span>Smart Contract An toàn</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                <span>Cộng đồng Quyết định</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Tại sao chọn UET FundChain?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Blockchain mang đến những giá trị vượt trội cho hoạt động gây quỹ và từ thiện
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-200"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-orange-400 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Benefits */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-white to-orange-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Lợi ích vượt trội
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi kết hợp công nghệ blockchain với mô hình DAO để tạo ra nền tảng 
              gây quỹ an toàn, minh bạch và hiệu quả nhất
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quy trình đơn giản, minh bạch và an toàn - chỉ với 3 bước
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Tạo chiến dịch',
                description: 'Tạo chiến dịch với mục tiêu rõ ràng, thời gian và số tiền cần gây quỹ. Smart contract tự động quản lý toàn bộ quỹ một cách an toàn.',
                color: 'from-pink-500 to-rose-500'
              },
              {
                step: '02',
                title: 'Nhận đóng góp',
                description: 'Cộng đồng đóng góp trực tiếp qua ví điện tử, mọi giao dịch được ghi nhận trên blockchain. Minh bạch 100% và không thể thay đổi.',
                color: 'from-orange-500 to-amber-500'
              },
              {
                step: '03',
                title: 'Vote & thực hiện',
                description: 'Người đóng góp vote cho các đề xuất sử dụng tiền. Chỉ khi đạt quorum (>50% donors) thì đề xuất mới được thực thi.',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="card p-8 rounded-xl text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-orange-200">
                  <div className={`text-6xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-4`}>
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-pink-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-pink-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Ứng dụng đa dạng
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nền tảng phù hợp cho nhiều loại hình gây quỹ khác nhau
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: '🏥', title: 'Y tế & Sức khỏe', desc: 'Gây quỹ cho chi phí điều trị, mua thiết bị y tế' },
              { icon: '🎓', title: 'Giáo dục', desc: 'Học bổng, xây trường, hỗ trợ học sinh vùng khó khăn' },
              { icon: '🌳', title: 'Môi trường', desc: 'Bảo vệ thiên nhiên, trồng cây, làm sạch đại dương' },
              { icon: '🏘️', title: 'Cộng đồng', desc: 'Xây dựng cơ sở hạ tầng, hỗ trợ người nghèo' },
              { icon: '🎨', title: 'Nghệ thuật & Văn hóa', desc: 'Hỗ trợ nghệ sĩ, bảo tồn di sản văn hóa' },
              { icon: '⚡', title: 'Khẩn cấp', desc: 'Cứu trợ thiên tai, hỗ trợ khẩn cấp' }
            ].map((useCase, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 text-center border border-gray-100 hover:border-orange-200"
              >
                <div className="text-5xl mb-4">{useCase.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {useCase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-orange-50 to-green-50">
        <div className="container">
          <div className="card rounded-2xl p-12 text-center max-w-4xl mx-auto bg-gradient-to-r from-orange-100 to-pink-100 border-2 border-orange-200 shadow-xl">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Sẵn sàng tạo sự khác biệt?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Tham gia cộng đồng đang tạo ra những thay đổi tích cực thông qua công nghệ blockchain. 
              Mỗi đóng góp của bạn đều được ghi nhận và sử dụng đúng mục đích.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/campaigns')}
                className="btn btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 group"
              >
                Khám phá ngay
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/statistics')}
                className="btn btn-secondary text-lg px-10 py-4 inline-flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                Xem thống kê
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

