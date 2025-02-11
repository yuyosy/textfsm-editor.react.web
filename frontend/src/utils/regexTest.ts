export const regexTest = (regex: string, text: string): boolean => {
  try {
    const re = new RegExp(regex.trim(), 'i');
    return re.test(text);
  } catch (e) {
    return false;
  }
};
