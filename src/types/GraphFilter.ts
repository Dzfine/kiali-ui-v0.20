export interface Layout {
  name: string;
}

export enum EdgeLabelMode {
  NONE = '无边缘标签',
  REQUESTS_PER_SECOND = '每秒请求数',
  REQUESTS_PERCENTAGE = '请求所占百分比',
  RESPONSE_TIME_95TH_PERCENTILE = '响应时间'
}
