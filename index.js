import { updateCovid } from "./covid/index.js";

let nowHours = -1;

let needCovidUpdate = false;
let covidText = "";
// need ~~~ update
// need ~~~ update

const checkTime = () => {
  const date = new Date();
  const hours = date.getHours();

  // 매 시각당 1번만 들어오게
  if (nowHours != hours) {
    nowHours = hours;
    if (nowHours === 9) {
      needCovidUpdate = true;
    }
  }
};

import axios from "axios";
import { parse } from "node-html-parser";

(async () => {
  /*
    COVID
    서버가 처음 켜졌을 때는 일단 어제 데이터 불러오고
    needCovidUpdate true로
    만약 공공데이터가 오늘 새로 업데이트 됐으면 오늘 데이터 바로 불러 올 것이고
    업데이트 안됐으면 어제 데이터 들고 있는 상태에서 계속 갱신 시도
  */

  covidText = await updateCovid(-2);
  needCovidUpdate = true;

  /*
    학식
  */

  // const url =
  //   "https://www.inu.ac.kr/com/cop/mainWork/foodList1.do?siteId=inu&id=inu_050110010000";
  // const html = await axios.get(url);
  // const root = parse(html.data);
  // console.log(root.querySelector(".sickdangmenu dt").firstChild._rawText);

  /*
    버스
  */
})();

setInterval(async () => {
  checkTime();
  if (needCovidUpdate) {
    let r = await updateCovid(-1);
    if (r !== null) {
      covidText = r;
      needCovidUpdate = false;
    }
  }
}, 100000);

// KAKAO I OPEN BUILDER //

import express from "express";
const app = express();
import bodyParser from "body-parser";

app.use(bodyParser.json());

app.post("/msw", function (req, res) {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: covidText,
          },
        },
      ],
    },
  };

  res.status(200).send(responseBody);
});
app.get("/msw", function (req, res) {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: covidText,
          },
        },
      ],
    },
  };

  res.status(200).send(responseBody);
});

app.get("/", function (req, res) {
  res.send("msw");
});

app.listen(3000, function () {});
