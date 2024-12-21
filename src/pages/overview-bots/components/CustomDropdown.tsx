import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  ArrowDown2Icon,
  ArrowUp2Icon,
  PointerIcon,
  Search24Icon,
} from '@assets/icons';

export interface Option {
  label: string;
  value: string;
  tags?: string[];
}

interface ICustomDropdownProps {
  options: Option[];
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  showTooTip?: boolean;
  isSearchable?: boolean;
}

const CustomDropdown: React.FC<ICustomDropdownProps> = ({
  options,
  onSelect,
  placeholder,
  disabled,
  showTooTip,
  isSearchable,
}) => {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(
    placeholder || (options.length > 0 ? options[0].label : 'Select Option')
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [textValue, setTextValue] = useState(selectedValue);
  const [optionsObj] = useState(options);
  const [tooltipPos, setTooltipPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleOptionClick = (option: Option) => {
    setSelectedValue(option.label);
    setTextValue(option.label);
    setIsOpen(false);
    setIsSelected(true);
    onSelect(option.value);
    setTooltipPos(null);
  };

  const filteredOpts = isSearchable
    ? optionsObj.filter((option) =>
        option.label.toLowerCase().includes(textValue.toLowerCase())
      )
    : optionsObj;

  const handleOnChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setTextValue(value);
  };

  const handleMouseEnter = (event: React.MouseEvent, idx: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPos({
      top: rect.top + window.scrollY + rect.height / 2,
      left: rect.right + 10,
    });
    setHoveredIndex(idx);
  };

  const tagSpan = (tag: string, idx: number) => {
    let bgColor = '';
    switch (tag.toLowerCase()) {
      case 'largest volume':
        bgColor = '#E6F4FE';
        break;
      case 'binance':
        bgColor = '#EFB621';
        break;
      case 'most frequent':
        bgColor = '#E6F4FE';
        break;
      case 'mango':
        bgColor = '#A3E5C8';
        break;
      case 'uniswap':
        bgColor = '#E62788';
        break;
      case 'cube':
        bgColor = '#FF822E';
        break;
      default:
        bgColor = '';
        break;
    }
    return (
      <span
        key={idx}
        style={{
          background: bgColor,
          color: bgColor === '#E6F4FE' ? '#0d74ce' : '#113264',
        }}
        className={`text-[0.625rem] rounded-md px-1 py-[2px] text-blue-300`}
      >
        {tag}
      </span>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropDownRef} className="relative w-full">
      <div
        className={`pl-4 pr-6 py-2 w-full h-[2.25rem] rounded-[10px] border-none outline outline-1 outline-light-400 text-sm text-dark-300 cursor-pointer flex items-center justify-between transition-colors duration-75 hover:outline-blue-300/40 ${
          disabled
            ? 'cursor-not-allowed text-dark-200 bg-light-300 !outline-light-300 hover:!outline-light-300'
            : 'cursor-pointer'
        } ${isOpen && !disabled ? '!outline-blue-300' : ''} ${
          placeholder && !isSelected ? 'text-blue-200' : 'text-blue-400'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isSearchable ? (
          <span className="flex items-center w-full m-0 gap-x-2">
            <Search24Icon
              className={`${
                isOpen && !disabled ? 'text-blue-300' : 'text-light-400'
              }`}
            />{' '}
            <input
              value={textValue}
              onChange={handleOnChange}
              placeholder="Search or choose"
              className="w-full text-sm text-dark-300 border-none outline-none m-0 placeholder:text-blue-200 placeholder:text-sm"
            />
          </span>
        ) : (
          selectedValue
        )}
        {!disabled ? (
          isOpen && !disabled ? (
            <ArrowUp2Icon className="text-blue-300" />
          ) : (
            <ArrowDown2Icon className="text-light-400" />
          )
        ) : null}
      </div>

      {filteredOpts.length > 0 && isOpen && !disabled && (
        <div className="absolute w-full bg-dark-400 text-light-200 px-6 pt-2 pb-4 rounded-[22px] mt-2 max-h-60 overflow-y-auto z-10">
          {filteredOpts.map((option, idx) => (
            <div
              key={option.value}
              className={`flex justify-between items-center relative text-sm py-2 font-normal border-b border-chart-200 hover:bg-chart-200 cursor-pointer ${
                idx === filteredOpts.length - 1 ? 'border-none' : ''
              }`}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={(e) => handleMouseEnter(e, idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <>{option.label}</>
              {option.tags && (
                <span className="flex gap-x-2 items-center">
                  {option.tags.map((tag, idx) => tagSpan(tag, idx))}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {hoveredIndex !== null &&
        tooltipPos &&
        showTooTip &&
        ReactDOM.createPortal(
          <div
            className="absolute p-4 rounded-[20px] text-white bg-chart-200 ml-10 text-sm max-w-[15rem]"
            style={{
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: 'translateY(-50%)',
            }}
          >
            The strategy makes money. A lot of money. Very much money. Too much
            money.
            <PointerIcon className="absolute left-[-5px] -translate-y-1/2 top-1/2" />
          </div>,
          document.body
        )}
    </div>
  );
};

export default CustomDropdown;
