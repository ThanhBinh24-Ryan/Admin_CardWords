import React from "react";

const Logo = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Thay src bằng ảnh logo CardWords của bro */}
      <img src="/path/to/logo.png" alt="CardWords Logo" className="w-12 h-12 mb-2" />
      <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide">
        CardWords
      </span>
    </div>
  );
};

export default Logo;
