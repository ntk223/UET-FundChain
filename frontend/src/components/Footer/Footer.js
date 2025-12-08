import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200 mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-6 h-6 text-pink-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">UET FundChain</span>
            </div>
            <p className="text-gray-600 text-sm">
              Nền tảng gây quỹ phi tập trung đầu tiên tại Việt Nam, sử dụng công nghệ Blockchain.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  Trang chủ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/campaigns')}
                  className="text-gray-600 hover:text-orange-500 transition-colors text-sm"
                >
                  Chiến dịch
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Tài nguyên</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                  Hướng dẫn
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                  Whitepaper
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Kết nối</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-500 rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-500 rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg"
              >
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:contact@campaigndapp.com"
                className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-500 rounded-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © 2025 Campaign DApp. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs text-center md:text-right">
              Được xây dựng với React, Ethers.js và Smart Contracts
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;