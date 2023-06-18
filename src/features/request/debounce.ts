let timer: string | number | NodeJS.Timeout | undefined;

export const debounceSendRequest = (values: EditorValues, delay: number = 1000) => {
  if (timer) {
    clearTimeout(timer);
    timer = undefined;
  }
  timer = setTimeout(() => {
    console.log(delay);
    sendRequest(values);
  }, delay);
};

const sendRequest = async (values: EditorValues) => {
  console.log(values);
};
