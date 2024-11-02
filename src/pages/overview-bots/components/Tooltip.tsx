import { forwardRef, useEffect, useRef, useState } from 'react';

interface IToolTipProps {
  text: string;
  width?: string;
}

const Tooltip = forwardRef<HTMLDivElement, IToolTipProps>(
  ({ text, width }, ref) => {
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const [isOverflow, setIsOverflow] = useState({
      right: false,
      left: false,
      top: false,
    });

    useEffect(() => {
      const adjustTooltipPosition = () => {
        const tooltip = tooltipRef.current;
        const parent = (ref as React.MutableRefObject<HTMLDivElement>)?.current;

        if (tooltip && parent) {
          const tooltipRect = tooltip.getBoundingClientRect();
          const parentRect = parent.getBoundingClientRect();

          // Check for top overflow
          if (tooltipRect.top < parentRect.top) {
            tooltip.style.top = `${35}px`; // Adjust the tooltip's position downwards
            setIsOverflow((prevState) => ({ ...prevState, top: true }));
          }

          // Check for right overflow
          if (tooltipRect.right > parentRect.right) {
            setIsOverflow((prevState) => ({ ...prevState, right: true }));
          }

          // Check for left overflow
          if (tooltipRect.left < parentRect.left) {
            setIsOverflow((prevState) => ({ ...prevState, left: true }));
          }
        }
      };

      adjustTooltipPosition();

      window.addEventListener('resize', adjustTooltipPosition);

      return () => {
        window.removeEventListener('resize', adjustTooltipPosition);
      };
    }, [ref, tooltipRef.current]);

    return (
      <div
        ref={tooltipRef}
        style={isOverflow.right ? { right: -16.5 } : { left: -25 }}
        className={`absolute bottom-8 z-50 ${
          width ? width : 'w-56'
        } p-4 text-xs text-white bg-dark-400 rounded-[20px] h-fit normal-case`}
      >
        {text}
        <div
          className={`absolute bottom-[-8px] ${
            isOverflow.right ? 'right-3' : 'left-10'
          } transform -translate-x-1/2 w-2 h-2 border-l-8 border-r-8 ${
            isOverflow.top
              ? 'border-b-8 border-b-dark-400 top-[-8px]'
              : 'border-t-8 border-t-dark-400'
          } border-transparent `}
        />
      </div>
    );
  }
);

export default Tooltip;
