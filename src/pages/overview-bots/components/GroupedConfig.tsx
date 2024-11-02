import { countConfigsPerGroup } from '../../..//utils/countConfigsPerGroup.util';
import { IStrategiesConfigData } from '../../../utils/strategyConfigData';
import { formatText } from '../../../utils/formatText.util';
import { ChangeEvent, forwardRef } from 'react';
import CustomDropdown from './CustomDropdown';
import ToggleButton from './ToggleButton';
import RangeSlider from './RangeSlider';
import CustomText from './CustomText';

interface IGroupedConfigProps {
  config: IStrategiesConfigData;
  cfgName: string;
  hasOtherGroup?: boolean;
  uniqueGroups: string[];
  value: { [key: string]: number | string | boolean };
  handleOnInputChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  handleOnRangeChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  handleOnToggle: (isOn: boolean, key: string) => void;
}

const GroupedConfig = forwardRef<HTMLDivElement, IGroupedConfigProps>(
  (
    {
      config,
      cfgName,
      value,
      hasOtherGroup,
      uniqueGroups,
      handleOnInputChange,
      handleOnRangeChange,
      handleOnToggle,
    },
    ref
  ) => {
    const excludeGroups = (item: string) =>
      item !== 'Other' &&
      item !== 'Buy Order Settings' &&
      item !== 'Sell Order Settings';

    const countConfigGroups = countConfigsPerGroup(config[cfgName]);
    const countCfgGrpSell = countConfigGroups['Sell Order Settings'];

    const objectConfig = (group: string) =>
      Object.keys(config[cfgName]).map((key, idx) => {
        const cfg = config[cfgName][key];
        return cfg.group === group ? (
          <div
            key={idx}
            id={`COL ${idx}`}
            className="col-span-2 md:col-auto mt-6"
          >
            <CustomText
              ref={ref}
              toolTipText={cfg.prompt ?? cfg.name}
              showOptText={!cfg.required}
              toolTipWidth={cfg.prompt === '' ? 'w-[8rem]' : 'w-[13rem]'}
              text={`${formatText(key)} ${
                cfg.name === 'stop_loss'
                  ? ', -% from initial'
                  : cfg.name === 'take_profit'
                  ? ', +% from initial'
                  : ''
              }`}
              xtraStyle="mb-4 font-semibold text-xs uppercase"
            />

            {cfg.display_type === 'dropdown' ||
            (cfg.default && typeof cfg.default === 'object') ? (
              <CustomDropdown
                options={
                  cfg.valid_values || cfg.default
                    ? (
                        cfg.valid_values ||
                        (cfg.default as Array<number | string>)
                      ).map((label, idx) => ({
                        label: `${label}`,
                        value: `${idx}`,
                      }))
                    : []
                }
                onSelect={() => {}}
              />
            ) : null}

            {cfg.display_type === 'input' || cfg.display_type === 'slider' ? (
              typeof cfg.default === 'number' ? (
                <div className="flex justify-between gap-x-4">
                  <div className="flex items-center text-sm px-4 w-[6.1875rem] h-[2.25rem] rounded-[100px] bg-light-200 outline-2 outline outline-transparent border border-transparent text-blue-400 focus-within:outline-blue-300 focus-within:hover:border-transparent hover:border-blue-300/50 ">
                    <span>{cfg.is_percentage ? '+' : ''}</span>
                    <input
                      name={key}
                      className={`w-full ${
                        cfg.is_percentage ? 'text-center' : ''
                      } bg-transparent disabled:cursor-not-allowed outline-none`}
                      value={`${value[key]}`}
                      onChange={handleOnInputChange}
                    />
                    <span>{cfg.is_percentage ? '%' : ''}</span>
                  </div>

                  <div className="w-60 flex-1 mt-[-5px]">
                    <RangeSlider
                      name={key}
                      min={cfg.min_value || 0}
                      max={cfg.max_value || 1000}
                      step={cfg.type === 'int' ? 1 : 0.01}
                      minLabel={`${cfg.min_value || '0'}${
                        cfg.is_percentage ? '%' : ''
                      }`}
                      maxLabel={`${cfg.max_value || '1000'}${
                        cfg.is_percentage ? '%' : ''
                      }`}
                      value={value[key] ? +value[key] : 0}
                      onChange={handleOnRangeChange}
                    />
                  </div>
                </div>
              ) : typeof cfg.default === 'string' || cfg.type === 'str' ? (
                <input
                  className="bg-light-200 rounded-[22px] w-full h-[2.25rem] px-4 border text-sm border-transparent text-blue-400 focus:outline-blue-300 hover:border-blue-300/50 disabled:cursor-not-allowed"
                  name={key}
                  value={`${value[key]}`}
                  onChange={handleOnInputChange}
                />
              ) : null
            ) : null}

            {cfg.display_type === 'toggle' && (
              <ToggleButton
                state={!!value[key] || false}
                toggleState={(isOn) => handleOnToggle(isOn, key)}
              />
            )}
          </div>
        ) : null;
      });

    return (
      <>
        {/* Display other Groups */}
        {uniqueGroups
          .filter((item) =>
            hasOtherGroup ? excludeGroups(item) : item === 'Other'
          )
          .map((group) => (
            <div>
              {group !== 'Other' && (
                <h2 className="w-fit font-semibold text-2xl text-dark-300">
                  {group}
                </h2>
              )}
              <div
                className={`relative grid grid-cols-2 gap-x-5 gap-y-6 mb-8 ${
                  hasOtherGroup ? 'grid-cols-4' : ''
                }`}
              >
                {objectConfig(group)}
              </div>
            </div>
          ))}

        {/* Display 'Buy Order Settings' and 'Sell Order Settings' side-by-side */}
        {hasOtherGroup && (
          <div
            className={`grid grid-cols-2 gap-x-5 ${
              countCfgGrpSell === 1 ? 'grid-cols-1' : ''
            } `}
          >
            {['Buy Order Settings', 'Sell Order Settings'].map((group) =>
              uniqueGroups.includes(group) ? (
                <div key={group}>
                  <h2 className="w-fit font-semibold text-2xl text-dark-300">
                    {group}
                  </h2>
                  <div
                    className={`relative grid grid-cols-2 gap-x-5 gap-y-6 mb-8 ${
                      countCfgGrpSell === 1 ? 'grid-cols-4' : ''
                    } `}
                  >
                    {objectConfig(group)}
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}
      </>
    );
  }
);

export default GroupedConfig;
