import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState, useEffect, useRef, forwardRef } from 'react';
import 'react-calendar/dist/Calendar.css';
import '@assets/styles/datepicker.css';
import Calendar from 'react-calendar';
import { CalendarIcon } from '@assets/icons';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ICustomDatePickerProps {
  getUnixTimeStamp: (unixTimeStamp: number) => void;
}

const CustomDatePicker = forwardRef<HTMLDivElement, ICustomDatePickerProps>(
  ({ getUnixTimeStamp }, ref) => {
    const [value, setValue] = useState<Value>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [activeMonth, setActiveMonth] = useState(new Date());
    const [visibleMonths, setVisibleMonths] = useState<string[]>([]);
    const calendarRef = useRef<HTMLDivElement | null>(null);
    const [isOverflow, setIsOverflow] = useState({ right: false, left: false });

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const updateVisibleMonths = (centerMonth: Date) => {
      const centerIndex = centerMonth.getMonth();
      const visibleMonths = new Array();

      for (let i = -3; i <= 3; i++) {
        const monthIndex = (centerIndex + i + 12) % 12;
        visibleMonths.push(months[monthIndex]);
      }

      setVisibleMonths(visibleMonths);
    };

    useEffect(() => {
      updateVisibleMonths(activeMonth);
    }, [activeMonth]);

    const handleDateChange = (date: Value) => {
      setValue(date);

      if (date instanceof Date) {
        const unixTimestamp = Math.floor(date.getTime() / 1000);
        getUnixTimeStamp(unixTimestamp);
      }

      setIsCalendarOpen(false);
    };

    const handlePrevMonth = () => {
      const prevDate = new Date(activeMonth);
      prevDate.setMonth(prevDate.getMonth() - 1);
      setActiveMonth(prevDate);
    };

    const handleNextMonth = () => {
      const nextDate = new Date(activeMonth);
      nextDate.setMonth(nextDate.getMonth() + 1);
      setActiveMonth(nextDate);
    };

    const handleMonthClick = (index: number) => {
      const newDate = new Date(activeMonth);
      newDate.setMonth(newDate.getMonth() - 3 + index);
      setActiveMonth(newDate);
    };

    // Close calendar when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          calendarRef.current &&
          !calendarRef.current.contains(event.target as Node)
        ) {
          setIsCalendarOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    useEffect(() => {
      const adjustCalendarPosition = () => {
        const calendarPicker = calendarRef.current;
        const parent = (ref as React.MutableRefObject<HTMLDivElement>)?.current;

        if (calendarPicker && parent) {
          const calendarRect = calendarPicker.getBoundingClientRect();
          const parentRect = parent.getBoundingClientRect();

          // Check for right overflow
          if (calendarRect.right > parentRect.right) {
            setIsOverflow((prevState) => ({ ...prevState, right: true }));
          }

          // Check for left overflow
          if (calendarRect.left < parentRect.left) {
            setIsOverflow((prevState) => ({ ...prevState, left: true }));
          }
        }
      };

      adjustCalendarPosition();
      window.addEventListener('resize', adjustCalendarPosition);

      return () => {
        window.removeEventListener('resize', adjustCalendarPosition);
      };
    }, [calendarRef.current]);

    return (
      <div className="relative w-full">
        <div
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className={`flex items-center bg-light-200 text-dark-blue text-sm w-full h-[2.25rem] rounded-[100px] px-5 cursor-pointer border border-transparent hover:border-blue-300/50 outline outline-2 outline-transparent ${
            isCalendarOpen ? 'outline-blue-300 hover:border-white' : ''
          }`}
        >
          <span>
            {value
              ? (value as Date).toLocaleDateString('en-CA')
              : 'Select Date'}
          </span>
        </div>

        <CalendarIcon
          className="absolute right-2 top-[20%] cursor-pointer"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        />

        {isCalendarOpen && (
          <div
            ref={calendarRef}
            style={
              isOverflow.right
                ? { right: 0 }
                : isOverflow.left
                ? { left: 0 }
                : undefined
            }
            className="absolute w-[28.125rem] h-[259px] z-10 mt-2 bg-blue-400 text-white rounded-[22px] flex overflow-hidden"
          >
            {/* Above section for months */}
            <div className="flex-1">
              <div className="flex items-end justify-between mb-2 px-4 border-b border-b-chart-200">
                <button
                  onClick={handlePrevMonth}
                  className="text-turkish font-normal text-sm pb-2"
                >
                  <FaChevronLeft />
                </button>
                <div className="flex gap-x-1">
                  {visibleMonths.map((month, index) => {
                    return (
                      <div
                        key={month}
                        onClick={() => handleMonthClick(index)}
                        className={`flex justify-center items-end cursor-pointer pb-1 text-sm font-normal border-x border-transparent h-10 w-10 ${
                          index === 3 ? 'border-x-chart-200' : ''
                        }`}
                      >
                        {month}
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={handleNextMonth}
                  className="text-turkish font-normal text-sm pb-2"
                >
                  <FaChevronRight />
                </button>
              </div>
              <Calendar
                activeStartDate={activeMonth}
                onActiveStartDateChange={({ activeStartDate }) =>
                  setActiveMonth(activeStartDate as Date)
                }
                onChange={handleDateChange}
                value={value}
                showNavigation={false}
                showNeighboringMonth={false}
                prevLabel={null}
                nextLabel={null}
                formatMonthYear={() => ''}
                tileClassName={({ date }) =>
                  date.getMonth() === activeMonth.getMonth()
                    ? 'font-semibold text-purple-500'
                    : 'text-white'
                }
                navigationLabel={() => null}
              />
            </div>

            {/* Right section for years */}
            <div className="flex items-center border-l border-chart-200 mr-[-10px]">
              <div className="flex flex-col w-full h-56  overflow-y-auto">
                {[...Array(10)].map((_, i) => {
                  const year = activeMonth.getFullYear() - 5 + i;
                  return (
                    <div
                      key={year}
                      onClick={() =>
                        setActiveMonth(new Date(activeMonth.setFullYear(year)))
                      }
                      className={`flex-none cursor-pointer text-white font-normal text-sm px-6 py-[0.45rem] border-y border-transparent ${
                        year === activeMonth.getFullYear()
                          ? 'border-y-chart-200'
                          : ''
                      }`}
                    >
                      {year}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default CustomDatePicker;
