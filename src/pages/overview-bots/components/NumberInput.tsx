import React, { ChangeEvent, useRef, useState } from 'react';
import { SlClose } from 'react-icons/sl';
import '@assets/styles/numberinput.scss';

interface NumberItem {
  id: string;
  value: number;
}

interface INumberTagProps {
  number: number;
  onRemove: () => void;
}

interface INumberInputProps {
  data: string;
}

const NumberTag: React.FC<INumberTagProps> = ({ number, onRemove }) => (
  <div className="flex items-center bg-blue-200 text-white rounded-[35px] px-2 py-1 m-1 h-[1.5625rem]">
    <span className="mr-2 font-normal text-sm">{number}</span>
    <button
      onClick={onRemove}
      className="text-blue-400 transition-colors duration-300 hover:text-white"
    >
      <SlClose />
    </button>
  </div>
);

const NumberTagDefault = () =>
  [0.25, 0.75, 1, 1.5, 1.7].map((number, idx) => (
    <div
      key={idx}
      className="flex border items-center bg-light-400 text-white rounded-[35px] px-2 py-1 m-1 h-[1.5625rem]"
    >
      <span className="mr-2 font-normal text-sm">{number}</span>
      <button className="text-dark-100 cursor-text">
        <SlClose />
      </button>
    </div>
  ));

const NumberInput: React.FC<INumberInputProps> = ({ data }) => {
  const [numbers, setNumbers] = useState<NumberItem[]>(
    data === '' || !data
      ? []
      : [
          ...data
            .split('-')
            .flatMap((pair) => pair.split(','))
            .map(Number)
            .map((num, i) => ({ id: `${i}`, value: +num })),
        ]
  );
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const parsedValue = parseFloat(inputValue);
      if (!isNaN(parsedValue)) {
        const newNumber: NumberItem = {
          id: `${parsedValue}-${Date.now()}`, // Generate a unique id
          value: parsedValue,
        };
        setNumbers((prevState) => [...prevState, newNumber]);
      }
      setInputValue('');
    }
  };

  const removeNumber = (id: string) => {
    setNumbers((prevState) => prevState.filter((num) => num.id !== id));
  };

  const handleOnClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setInputValue(evt.target.value);
  };

  return (
    <div
      className="px-4 py-2 bg-light-200 cursor-text rounded-[22px] outline-2 outline outline-transparent transition-colors duration-300 border border-transparent text-blue-400 focus-within:outline-blue-300 focus-within:hover:border-transparent hover:border-blue-300/50"
      onClick={handleOnClick}
    >
      <div className="flex flex-wrap">
        {numbers.map((num) => (
          <NumberTag
            key={num.id}
            number={num.value}
            onRemove={() => removeNumber(num.id)}
          />
        ))}
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={
            numbers.length === 0 ? 'Input a value and press Enter' : ''
          }
          className={`flex-none bg-transparent pl-1 border-none outline-none placeholder:text-blue-200 ${
            numbers.length === 0 ? 'w-full' : 'max-w-[10ch]'
          }`}
        />
        {numbers.length === 0 && (
          <>
            <p className="w-full mt-6 text-sm font-normal text-light-400">
              Example:
            </p>{' '}
            {NumberTagDefault()}
          </>
        )}
      </div>
    </div>
  );
};

export default NumberInput;
