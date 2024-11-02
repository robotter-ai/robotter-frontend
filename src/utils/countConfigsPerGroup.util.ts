import { ConfigData } from './strategyConfigData';

type ConfigType = {
  [key: string]: ConfigData;
};

export const countConfigsPerGroup = (
  config: ConfigType
): Record<string, number> => {
  const groupCounts: Record<string, number> = {};

  for (const key in config) {
    const group = config[key].group;

    groupCounts[group] = (groupCounts[group] || 0) + 1;
  }

  return groupCounts;
};
