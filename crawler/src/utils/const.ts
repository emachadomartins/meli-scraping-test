export const ERROR_STATUS = [400, 403, 500, 502];

export const TRUE_VALUES = [
  "verdadeiro",
  "true",
  "sim",
  "si",
  "yes",
  "positivo",
  "positive",
];
export const FALSE_VALUES = [
  "falso",
  "false",
  "não",
  "no",
  "negativo",
  "negative",
];

export const NULL_VALUES = ["null", "undefined", "", "0", "nan"];

export const isDev = ["dev", "development", "test"].includes(
  process.env["STAGE"] ?? "dev"
);
