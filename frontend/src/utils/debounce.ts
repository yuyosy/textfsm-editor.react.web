type Callback<T extends unknown[]> = (...args: T) => void;

export const debounce = <T extends unknown[]>(
  func: Callback<T>,
  delay: number
): Callback<T> => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
