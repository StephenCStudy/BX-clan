import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiHome, HiArrowLeft, HiSearch } from "react-icons/hi";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) via-white to-(--color-pastel) flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-[180px] font-heading font-bold text-(--color-pastel) leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-(--color-primary) rounded-full opacity-10 animate-ping"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <HiSearch className="w-24 h-24 text-(--color-primary) animate-bounce" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-heading font-bold text-[#083344] mb-4">
            Không tìm thấy trang
          </h1>
          <p className="text-lg text-muted max-w-md mx-auto">
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di
            chuyển. Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-6 py-3 border-2 border-(--color-primary) text-(--color-primary) rounded-xl font-semibold hover:bg-(--color-primary) hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <HiArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Quay lại
          </button>

          <Link
            to="/"
            className="group flex items-center gap-2 px-6 py-3 bg-(--color-primary) text-white rounded-xl font-semibold hover:bg-(--color-primary)/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <HiHome className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            Về trang chủ
          </Link>

          <Link
            to="/posts"
            className="group flex items-center gap-2 px-6 py-3 bg-(--color-accent) text-[#083344] rounded-xl font-semibold hover:bg-(--color-accent)/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <HiSearch className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            Xem tin đăng
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto opacity-50">
          <div
            className="h-2 bg-(--color-primary) rounded-full animate-pulse"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="h-2 bg-(--color-accent) rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="h-2 bg-(--color-primary) rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {/* Popular Links */}
        <div className="mt-12 p-6 bg-white rounded-2xl shadow-soft">
          <h3 className="text-lg font-heading font-semibold text-[#083344] mb-4">
            Các trang phổ biến
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              to="/posts"
              className="text-left px-4 py-2 rounded-lg hover:bg-(--color-pastel) hover:text-(--color-primary) transition-colors"
            >
              📋 Danh sách tin đăng
            </Link>
            <Link
              to="/add-post"
              className="text-left px-4 py-2 rounded-lg hover:bg-(--color-pastel) hover:text-(--color-primary) transition-colors"
            >
              ✨ Đăng tin mới
            </Link>
            <Link
              to="/profile"
              className="text-left px-4 py-2 rounded-lg hover:bg-(--color-pastel) hover:text-(--color-primary) transition-colors"
            >
              👤 Trang cá nhân
            </Link>
            <Link
              to="/support"
              className="text-left px-4 py-2 rounded-lg hover:bg-(--color-pastel) hover:text-(--color-primary) transition-colors"
            >
              💬 Hỗ trợ khách hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
