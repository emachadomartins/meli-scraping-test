import { FALSE_VALUES, NULL_VALUES, TRUE_VALUES } from './const';

export const isQuerySelector = (selector: string) =>
  /(.*?)((document.(querySelector|getElementBy)(.*?))|\$|jQuery)\((.*?)\)(.*?)/g.test(
    selector,
  );

export const normalizeStr = (str: string) => str.replace(/(\r\n|\n|\r)/g, '');

export const normalize = (value: unknown) =>
  Array.isArray(value)
    ? value.map((v) => normalize(v))
    : typeof value === 'object'
      ? Object.entries(value).reduce(
          (all, [key, value]) => ({
            ...all,
            [key]: normalize(value),
          }),
          {},
        )
      : !isNaN(+normalizeStr(`${value}`))
        ? +normalizeStr(`${value}`)
        : TRUE_VALUES.includes(normalizeStr(`${value}`))
          ? true
          : FALSE_VALUES.includes(normalizeStr(`${value}`))
            ? false
            : NULL_VALUES.includes(normalizeStr(`${value}`))
              ? null
              : normalizeStr(`${value}`);
