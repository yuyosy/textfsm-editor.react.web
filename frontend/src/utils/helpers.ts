export const setRefValue = <T>(refObj: React.MutableRefObject<T>, value: T) => {
  refObj.current = value;
};

export const getRefValue = <T>(refObj: React.MutableRefObject<T>): T | undefined => {
  return refObj?.current;
};
