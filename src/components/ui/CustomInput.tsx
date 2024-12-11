import React, { InputHTMLAttributes, ReactNode } from 'react';

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode | string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  icon,
  disabled,
  ...rest
}) => {
  return (
    <div
      className={`flex items-center bg-light-200 rounded-[22px] w-full h-[2.25rem] px-4 border text-sm border-transparent text-blue-400 focus-within:outline focus-within:outline-1 focus-within:border-blue-300 focus-within:outline-blue-300 
      hover:border-blue-300/50 disabled:cursor-not-allowed transition-all duration-300 ${
        disabled ? 'bg-light-300 border-light-300 hover:border-light-300' : ''
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <input
        {...rest}
        disabled={disabled}
        className="w-full bg-transparent text-blue-400 outline-none placeholder:text-blue-200"
      />
    </div>
  );
};

export default CustomInput;
