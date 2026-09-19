export type ActivityStatus =
  | "Success"
  | "Processing"
  | "Failed";

export type ActivityItem = {
  id: string;
  timestamp: string;
  service: string;
  action: string;
  status: ActivityStatus;
};

export type ActivityResponse = {
  items: ActivityItem[];
  total: number;
  updatedAt: string;
};

export type ActivityFilters = {
  limit?: number;
  service?: string;
  status?: ActivityStatus;
};