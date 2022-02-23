import path from "path";
const __dirname = path.resolve();

const serverURL = "http://54.180.114.46:3000";
// const serverURL = "http://127.0.0.1:3000";

export const IMAGEPATH = `${__dirname}/images/`;
export const IMAGEURL = `${serverURL}/images/`;
export const pathConfirmedImageName = "pathConfirmed.jpg";

export const getTodayString = (useHour) => {
  const date = new Date();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  month = month >= 10 ? month : "0" + month;
  day = day >= 10 ? day : "0" + day;
  hour = hour >= 10 ? hour : "0" + hour;
  minute = minute >= 10 ? minute : "0" + minute;
  second = second >= 10 ? second : "0" + second;

  if (useHour) {
    return (
      date.getFullYear() +
      "-" +
      month +
      "-" +
      day +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second
    );
  } else {
    return date.getFullYear() + "-" + month + "-" + day;
  }
};
