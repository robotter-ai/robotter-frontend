import React, { InputHTMLAttributes, ReactNode } from 'react';

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode | string;
  postIcon?: ReactNode | string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  icon,
  postIcon,
  disabled,
  ...rest
}) => {
  return (
    <div
      className={`flex items-center rounded-[10px] w-full h-[2.25rem] px-4 border-none text-sm text-dark-300 hover:outline-blue-300/40 focus-within:hover:outline-blue-300 outline outline-1 outline-light-400 focus-within:outline-blue-300 
      hover:border-blue-300/50 disabled:cursor-not-allowed transition-all duration-75 ${
        disabled ? 'bg-light-300 !outline-light-300 hover:!outline-light-300' : ''
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <input
        {...rest}
        disabled={disabled}
        className="w-full bg-transparent text-blue-400 outline-none placeholder:text-blue-200"
      />
      {postIcon && <span className="mr-2">{postIcon}</span>}
    </div>
  );
};

export default CustomInput;
