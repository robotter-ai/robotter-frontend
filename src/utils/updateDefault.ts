import { IStrategiesConfigData } from './strategyConfigData';
import { defaultType } from './defaultType.util';

export const updateDefaults = (
  config: IStrategiesConfigData,
  cfgName: string
) => {
  const updatedConfig = Object.keys(config[cfgName]).reduce(
    (acc: Record<string, any>, key) => {
      const cfgD = config[cfgName][key].default;
      const cfgT = defaultType(config[cfgName][key].type);

      acc[key] = {
        ...config[cfgName][key],
        default: cfgD !== null ? cfgD : cfgT,
      };

      return acc;
    },
    {} as Record<string, any>
  );

  config[cfgName] = updatedConfig;

  return config;
};
