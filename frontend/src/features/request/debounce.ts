let timer: string | number | NodeJS.Timeout | undefined;

export const debounce = (delay: number = 1000): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (timer) {
        clearTimeout(timer);
        timer = undefined;
      }
      timer = setTimeout(async () => {
        resolve('resolve');
      }, delay);
    } catch {
      reject('reject');
    }
  });
};
