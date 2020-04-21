export const checkMaskEquals = (value: string, mask: RegExp): boolean => {
  const matchArray: RegExpMatchArray | null = value.match(mask);
  return matchArray !== null && value === matchArray[0];
}

export const checkMaskIncluded = (value: string, mask: RegExp): boolean => {
  return value.search(mask) !== -1;
}
