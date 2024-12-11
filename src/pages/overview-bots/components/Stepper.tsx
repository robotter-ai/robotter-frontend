import classNames from 'classnames';
import { Dispatch, useState } from 'react';

interface IStepperProps {
  currentStep: number;
  setCurrentStep: Dispatch<React.SetStateAction<number>>;
}

const Stepper: React.FC<IStepperProps> = ({ currentStep, setCurrentStep }) => {
  const steps = ['Backtest Strategy', 'Results', 'Connect & Deposit'];

  const handleOnClick = (index: number) => setCurrentStep(index);

  return (
    <div className="flex items-center justify-between w-[80%] md:w-[70%] max-w-[17rem] mx-auto md:mx-0">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center relative">
          <div
            id="circle"
            className={classNames(
              'flex justify-center items-center w-[20px] h-[20px] rounded-full font-semibold text-xs',
              {
                'text-white bg-navy': currentStep === index + 1, // Current step
                'text-white bg-green-100 cursor-pointer':
                  currentStep > index + 1, // Previous steps
                'text-dark-200 bg-light-400': currentStep < index + 1, // Future steps
              }
            )}
            // Only Allow click when on previous step
            onClick={
              currentStep > index + 1
                ? () => handleOnClick(index + 1)
                : () => {}
            }
          >
            <span>{index + 1}</span>
          </div>
          
          <p
            className={classNames(
              'text-xs absolute left-0 whitespace-nowrap',
              {
                'text-navy': currentStep === index + 1, // Current step text color
                'text-green-100 cursor-pointer': currentStep > index + 1, // Previous step text color
                'bottom-[-41px] md:bottom-[-25px]': index === 0, // Adjust first step text position
              }
            )}
            // Only Allow click when on previous step
            onClick={
              currentStep > index + 1
                ? () => handleOnClick(index + 1)
                : () => {}
            }
          >
            {step}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stepper;

