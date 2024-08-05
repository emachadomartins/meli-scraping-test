import { Step } from "./steps";

export type Task = {
  id: string;
  url: string;
  scripts?: Step[];
  error?: string;
  retry: number;
};
