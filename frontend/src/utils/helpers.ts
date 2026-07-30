export const setRefValue = <T>(refObj: React.RefObject<T>, value: T) => {
  if (refObj.current !== null && typeof refObj.current === 'object') {
    Object.assign(refObj.current, value);
  }
};

export const getRefValue = <T>(
  refObj: React.RefObject<T>,
): T | null | undefined => {
  return refObj?.current;
};
