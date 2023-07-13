export const getCurrentDateTimeString = (format: string) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = ('0' + (now.getMonth() + 1)).slice(-2);
  const day = ('0' + now.getDate()).slice(-2);
  const hours = ('0' + now.getHours()).slice(-2);
  const minutes = ('0' + now.getMinutes()).slice(-2);
  const seconds = ('0' + now.getSeconds()).slice(-2);

  const formattedDateTimeString = format
    .replace('yyyy', year.toString())
    .replace('mm', month.toString())
    .replace('dd', day.toString())
    .replace('hh', hours.toString())
    .replace('mm', minutes.toString())
    .replace('ss', seconds.toString());

  return formattedDateTimeString;
};
