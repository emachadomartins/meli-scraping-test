export const isQuerySelector = (selector: string) =>
  /(.*?)((document.(querySelector|getElementBy)(.*?))|\$|jQuery)\((.*?)\)(.*?)/g.test(
    selector,
  );
