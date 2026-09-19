export type AnalyticsPeriod =
  | "today"
  | "7d"
  | "30d"
  | "custom";

export type AnalyticsStats = {
  activeUsers: number;
  requestsPerMinute: number;
  peakTraffic: number;
  successRate: number;
  averageResponseTime: number;
  totalRequests: number;
  errorRate: number;
};

export type TrafficPoint = {
  timestamp: string;
  requests: number;
  users: number;
  errorRate: number;
  responseTime: number;
};

export type ServicePerformance = {
  service: string;
  requests: number;
  successRate: number;
  averageResponseTime: number;
};

export type EndpointPerformance = {
  endpoint: string;
  requests: number;
};

export type AnalyticsResponse = {
  stats: AnalyticsStats;
  traffic: TrafficPoint[];
  services: ServicePerformance[];
  endpoints: EndpointPerformance[];
  period: AnalyticsPeriod;
  updatedAt: string;
};

export type AnalyticsFilters = {
  period: AnalyticsPeriod;
  startDate?: string;
  endDate?: string;
  service?: string;
};
