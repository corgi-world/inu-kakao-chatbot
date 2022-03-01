import { call } from "./api.js";
import { jsonToText } from "./parser.js";

let weatherText = "준비중입니다.";
export function getWeatherText() {
  return weatherText;
}
export function getCount() {
  return count;
}

// base_date : 20220301 / base_time : 1400
const updateWeather = async (
  shortBasedate,
  shortBasetime,
  ultraShortBasedate,
  ultraShortBasetime
) => {
  const short = await call.vilageFcst(shortBasedate, shortBasetime);
  const ultraShort = await call.UltraSrtFcst(ultraShortBasedate, ultraShortBasetime);
  const dnsty = await call.mesureDnsty();

  // console.log(shortBasedate, shortBasetime, ultraShortBasedate, ultraShortBasetime);
  weatherText = jsonToText(short, ultraShort, dnsty);
};

// 단기예보는 아래와 같은 시각에 갱신됨.
// API 제공시간은 각 시각의 10분 (안전하게 11분에 호출할 예정)
const short_basetimes = [2, 5, 8, 11, 14, 17, 20, 23];

// 초단기예보는 매시각 30분에 갱신됨.
// API 제공시간은 각 시각의 45분 (안전하게 46분에 호출할 예정)

// 처음 서버 켜졌을 때 바로 받아오게
(function () {
  update();
})();

let count = 0;
setInterval(() => {
  count += 1;
  if (20 <= count) {
    count = 0;
    update();
  }
}, 60000); // 1분

function update() {
  const shortBasetime = getShortBasetime();
  const shortBasedate = getBasedate(shortBasetime);
  const ultraShortBasetime = getUltraShortBasetime();
  const ultraShortBasedate = getBasedate(ultraShortBasetime);
  updateWeather(shortBasedate, shortBasetime, ultraShortBasedate, ultraShortBasetime);
}

function getShortBasetime() {
  const now = new Date();
  for (let i = 0; i < short_basetimes.length - 1; i++) {
    const hour1 = short_basetimes[i];
    const date1 = new Date();
    date1.setHours(hour1);
    date1.setMinutes(11);
    const hour2 = short_basetimes[i + 1];
    const date2 = new Date();
    date2.setHours(hour2);
    date2.setMinutes(11);

    if (date1 <= now && now < date2) {
      return hour1 < 10 ? `0${hour1}00` : `${hour1}00`;
    }
  }
  return "2300";
}
function getUltraShortBasetime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  if (46 < minutes) {
    return hours < 10 ? `0${hours}30` : `${hours}30`;
  } else {
    let h = hours - 1;
    if (h < 0) h = 23;
    return h < 10 ? `0${h}30` : `${h}30`;
  }
}

function getBasedate(basetime) {
  const now = new Date();
  const basehour = basetime.slice(0, 2);

  // 23시 기준으로 불러야 할 때의 시각이 23시가 아닌 것은
  // 하루가 지나가 버린 것. 따라서 어제의 23시가 base이다.
  if (basehour === "23") {
    if (now.getHours !== "23") {
      now.setDate(now.getDate() - 1);
    }
  }

  const month = now.getMonth() + 1;
  const date = now.getDate();

  const base_date = `${now.getFullYear()}${month < 10 ? "0" + month : month}${
    date < 10 ? "0" + date : date
  }`;
  return base_date;
}
