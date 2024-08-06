import { Step } from "./steps";

export type Task = {
  id: string;
  url: string;
  steps?: Step[];
  error?: string;
  retry: number;
};
