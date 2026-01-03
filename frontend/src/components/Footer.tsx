import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { isDarkTheme } = useTheme();
  
  return (
    <footer className="border-t border-slate-200 dark:border-border-dark bg-white dark:bg-background-dark pt-16 pb-8 px-4 md:px-10">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-slate-900 dark:text-white mb-2">
              <div className="size-6 text-primary">
                <svg className="w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold">ABC Cinema</h2>
            </div>
            <p className="text-slate-600 dark:text-text-secondary text-sm leading-relaxed">
              Trải nghiệm điện ảnh đỉnh cao với công nghệ chiếu phim hiện đại nhất. Hệ thống rạp chiếu phim hàng đầu Việt Nam.
            </p>
            <div className="flex gap-4 mt-2">
              <a className="text-slate-500 dark:text-text-secondary hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined">public</span>
              </a>
              <a className="text-slate-500 dark:text-text-secondary hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined">mail</span>
              </a>
              <a className="text-slate-500 dark:text-text-secondary hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined">call</span>
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-slate-900 dark:text-white font-bold mb-2">Giới Thiệu</h3>
            <a className="text-slate-600 dark:text-text-secondary text-sm hover:text-primary transition-colors" href="#">Về chúng tôi</a>
            <a className="text-slate-600 dark:text-text-secondary text-sm hover:text-primary transition-colors" href="#">Thỏa thuận sử dụng</a>
            <a className="text-slate-600 dark:text-text-secondary text-sm hover:text-primary transition-colors" href="#">Quy chế hoạt động</a>
            <a className="text-slate-600 dark:text-text-secondary text-sm hover:text-primary transition-colors" href="#">Chính sách bảo mật</a>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-slate-900 dark:text-white font-bold mb-2">Góc Điện Ảnh</h3>
            <a className="text-slate-600 dark:text-text-secondary text-sm hover:text-primary transition-colors" href="#">Thể loại phim</a>
            <a className="text-slate-600 dark:text-text-secondary text-sm hover:text-primary transition-colors" href="#">Bình luận phim</a>
            <a className="text-slate-600 dark:text-text-secondary text-sm hover:text-primary transition-colors" href="#">Blog điện ảnh</a>
            <a className="text-slate-600 dark:text-text-secondary text-sm hover:text-primary transition-colors" href="#">Phim hay tháng</a>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-slate-900 dark:text-white font-bold mb-2">Hỗ Trợ</h3>
            <a className="text-slate-600 dark:text-text-secondary text-sm hover:text-primary transition-colors" href="#">Góp ý</a>
            <a className="text-slate-600 dark:text-text-secondary text-sm hover:text-primary transition-colors" href="#">Sale & Services</a>
            <a className="text-slate-600 dark:text-text-secondary text-sm hover:text-primary transition-colors" href="#">Rạp / Giá vé</a>
            <a className="text-slate-600 dark:text-text-secondary text-sm hover:text-primary transition-colors" href="#">Tuyển dụng</a>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-border-dark pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-text-secondary text-xs">© 2023 ABC Cinema. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <div className="h-8 w-auto opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
              <img alt="Mastercard logo" className="h-full object-contain" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/2560px-Mastercard-logo.svg.png" />
            </div>
            <div className="h-4 w-auto opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
              <img alt="Visa logo" className="h-full object-contain" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
