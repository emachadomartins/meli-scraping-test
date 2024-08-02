export type Result = {
  taskId: string;
  url: string;
  complete: boolean;
  logs: string[];
  error?: string;
  info?: Record<string, unknown>;
  files?: string[];
};
