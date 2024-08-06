import { PuppeteerLifeCycleEvent } from "puppeteer";

interface BaseStep {
  wait?: number;
  critical?: boolean;
}

interface ClickStep extends BaseStep {
  step: "click";
  selector: string;
}

interface ScrollStep extends BaseStep {
  step: "scroll";
  distance?: number;
  delay?: number;
  direction?: "top" | "bottom" | "infinity";
  selector?: string;
}

interface NavigateStep extends BaseStep {
  step: "navigate";
  url: string;
  event?: PuppeteerLifeCycleEvent;
  timeout?: number;
}

interface InfoStep extends BaseStep {
  step: "info";
  key: string;
  script: string;
}

interface ExportStep extends BaseStep {
  step: "export";
  name?: string;
}

interface SelectStep extends BaseStep {
  step: "select";
  selector: string;
  option: string;
}

interface InputStep extends BaseStep {
  step: "input";
  selector: string;
  value: string;
}

interface CaptchaStep extends BaseStep {
  step: "captcha";
  type: "audio" | "image";
  file_selector: string;
  response_selector: string;
}

interface FileStep extends BaseStep {
  step: "file";
  type: string;
  selector: string;
}

interface WaitStep extends BaseStep {
  step: "wait";
  time: number;
}

export type Step =
  | ClickStep
  | ScrollStep
  | NavigateStep
  | InfoStep
  | ExportStep
  | CaptchaStep
  | WaitStep
  | SelectStep
  | InputStep
  | FileStep;
