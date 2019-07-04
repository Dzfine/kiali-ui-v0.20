import { ServerConfig } from '../types/ServerConfig';

export type Durations = { [key: number]: string };

export type ComputedServerConfig = ServerConfig & {
  durations: Durations;
};

const toDurations = (tupleArray: [number, string][]): Durations => {
  const obj = {};
  tupleArray.forEach(tuple => {
    obj[tuple[0]] = tuple[1];
  });
  return obj;
};

let durationsTuples: [number, string][] = [
  [60, '最近1分钟'],
  [300, '最近5分钟'],
  [600, '最近10分钟'],
  [1800, '最近30分钟'],
  [3600, '最近1小时'],
  [10800, '最近3小时'],
  [21600, '最近6小时'],
  [43200, '最近12小时'],
  [86400, '最近1天'],
  [604800, '最近7天'],
  [2592000, '最近30天']
];

const computeValidDurations = (cfg: ComputedServerConfig) => {
  if (cfg.prometheus.storageTsdbRetention) {
    // Make sure we'll keep at least one item
    if (cfg.prometheus.storageTsdbRetention <= durationsTuples[0][0]) {
      durationsTuples = [durationsTuples[0]];
    } else {
      durationsTuples = durationsTuples.filter(d => d[0] <= cfg.prometheus.storageTsdbRetention!);
    }
  }
  cfg.durations = toDurations(durationsTuples);
};

// Set some defaults. Mainly used in tests, because
// these will be overwritten on user login.
let serverConfig: ComputedServerConfig = {
  installationTag: 'Kiali Console',
  istioNamespace: 'istio-system',
  istioLabels: {
    appLabelName: 'app',
    versionLabelName: 'version'
  },
  prometheus: {
    globalScrapeInterval: 15,
    storageTsdbRetention: 21600
  },
  durations: {}
};
computeValidDurations(serverConfig);
export { serverConfig };

export const toValidDuration = (duration: number): number => {
  // Check if valid
  if (serverConfig.durations[duration]) {
    return duration;
  }
  // Get closest duration
  for (let i = durationsTuples.length - 1; i >= 0; i--) {
    if (duration > durationsTuples[i][0]) {
      return durationsTuples[i][0];
    }
  }
  return durationsTuples[0][0];
};

export const setServerConfig = (svcConfig: ServerConfig) => {
  serverConfig = {
    ...svcConfig,
    durations: {}
  };

  computeValidDurations(serverConfig);
};
