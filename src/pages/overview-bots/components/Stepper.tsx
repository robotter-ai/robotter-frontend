import classNames from 'classnames';

const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = ['Backtest Strategy', 'Results', 'Deposit'];

  return (
    <div className="flex items-center w-full max-w-[25rem]">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 relative">
          <div className="flex items-center">
            <div
              className={classNames(
                'flex justify-center items-center w-5 h-5 rounded-full font-semibold text-xs z-10',
                {
                  'text-white bg-navy': currentStep === index + 1,
                  'text-white bg-green-100': currentStep > index + 1,
                  'text-dark-200 bg-light-400': currentStep < index + 1,
                }
              )}
            >
              <span>{index + 1}</span>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={classNames(
                  'h-px flex-1',
                  {
                    'bg-green-100': currentStep > index + 1,
                    'bg-light-400': currentStep <= index + 1,
                  }
                )}
              />
            )}
          </div>
          
          <p
            className={classNames(
              'text-xs absolute left-0 whitespace-nowrap',
              {
                'text-navy': currentStep === index + 1,
                'text-green-100': currentStep > index + 1,
                'text-dark-300': currentStep < index + 1,
                '-bottom-6': true,
              }
            )}
          >
            {step}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stepper;