export const Z_INDEX = {
  base: 0,
  below: -1,
  header: 100,
  dropdown: 300,
  sticky: 400,
  overlay: 900,
  popover: 1200,
  modal: 1500,
  toast: 1600,
  tooltip: 1700,
  max: 9999
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;

export const getZIndex = (key: ZIndexKey) => Z_INDEX[key];
