import { Step } from "./steps";

export type Task = {
  url: string;
  scripts?: Step[];
  error?: string;
  retry: number;
};
