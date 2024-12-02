import { BackIcon } from '@assets/icons';
import React from 'react';

interface IGoBackProps {
  onClick: () => void;
  disabled?: boolean;
}

const GoBack: React.FC<IGoBackProps> = ({ onClick, disabled }) => {
  return (
    <div
      id="go_back_arrow"
      onClick={onClick}
      className={`flex gap-x-2 ml-2 items-center cursor-pointer text-navy transition-all hover:translate-x-[-2px] hover:text-blue-300 ${
        disabled ? '!text-dark-100 hover:!text-dark-100 hover:translate-x-0 cursor-text' : ''
      }`}
    >
      <BackIcon />
      <span className="font-semibold text-xs">Back</span>
    </div>
  );
};

export default GoBack;
