import { updateCovid } from "./covid/index.js";
import { updateBus } from "./bus/index.js";
import { updateMenu } from "./menu/index.js";
import { updatePath } from "./pathConfirmed/index.js";
import { IMAGEPATH, IMAGEURL, pathConfirmedImageName } from "./utils/util.js";

let nowHours = -1;

let needCovidUpdate = false;
let covidText = "";

let needBusUpdate = false;
let busHotTime = false;
let busText = "";
let busCallCount = 1;

let needMenuUpdate = false;
let menuText = "";

let needPathUpdate = false;
let latestPathConfirmed = "";

const checkTime = () => {
  const date = new Date();
  const hours = date.getHours();

  // 매 시각당 1번만 들어오게
  if (nowHours != hours) {
    nowHours = hours;
    if (nowHours === 9) {
      needCovidUpdate = true;
    }

    if (20 < nowHours || nowHours < 8) {
      busCallCount = 0;

      needBusUpdate = false;
      busText =
        "공공데이터 버스 도착정보 조회 일일 트래픽 제한으로 08시부터 20시 59분까지만 사용 가능합니다.";
    } else {
      // 오전 8시 ~ 오후 9시
      const busHotTimeStart = new Date();
      const busHotTimeEnd = new Date();
      busHotTimeStart.setHours(8);
      busHotTimeStart.setMinutes(0);
      busHotTimeEnd.setHours(10);
      busHotTimeEnd.setMinutes(0);

      if (busHotTimeStart <= date && date <= busHotTimeEnd) {
        busHotTime = true;
      } else {
        busHotTime = false;
      }
      needBusUpdate = true;
    }
    if (0 <= nowHours && nowHours <= 6) {
      needPathUpdate = false;
    } else {
      needPathUpdate = true;
    }
    if (nowHours === 7) {
      needMenuUpdate = true;
    } else {
      needMenuUpdate = false;
    }
  }
};

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
    버스
  */

  busText = await updateBus();
  needBusUpdate = true;

  /*
    학식
  */

  menuText = await updateMenu();

  /*
    확진자 동선
  */

  latestPathConfirmed = await updatePath();
})();

// 5분
setInterval(async () => {
  if (needCovidUpdate) {
    const r = await updateCovid(-1);

    if (r !== null) {
      covidText = r;
      needCovidUpdate = false;
    } else {
      // covidText = "확진자 수 에러";
      /* 
        실시간 갱신이 아닌 데이터들은 에러가 나도 전 날 데이터 보여주는게 나은 듯
      */
    }
  }
  if (needMenuUpdate) {
    const r = await updateMenu();
    if (r !== null) {
      menuText = r;
      needMenuUpdate = false;
    } else {
      // menuText = "학식 에러";
    }
  }
}, 300000);

const setBusText = async () => {
  if (needBusUpdate) {
    const r = await updateBus();
    if (r !== null) {
      busText = r;
      busCallCount += 1;
    } else {
      busText = "버스 에러";
    }
  }
};

// 15초
setInterval(() => {
  if (busHotTime) {
    setBusText();
  }
}, 15000);
// 20초
setInterval(() => {
  if (!busHotTime) {
    setBusText();
  }
}, 20000);

// 1분
setInterval(async () => {
  checkTime();
  if (needPathUpdate) {
    const r = await updatePath(latestPathConfirmed);
    if (r !== null) {
      latestPathConfirmed = r;
    }
  }
}, 60000);

// KAKAO I OPEN BUILDER //

import express from "express";
const app = express();

import bodyParser from "body-parser";
app.use(bodyParser.json());

import fs from "fs";
app.use("/images", express.static("images"));

app.all("/covid", function (req, res) {
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
app.all("/bus", function (req, res) {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: busText,
          },
        },
      ],
    },
  };

  res.status(200).send(responseBody);
});
app.all("/menu", function (req, res) {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: menuText,
          },
        },
      ],
    },
  };

  res.status(200).send(responseBody);
});
app.all("/path", function (req, res) {
  const inu_url =
    "http://www.inu.ac.kr/user/boardList.do?boardId=648880&siteId=inu&id=inu_070213030000";

  const responseBody = {
    version: "2.0",
    template: {
      outputs: [],
    },
  };

  const {
    template: { outputs },
  } = responseBody;

  const text = {
    simpleText: {
      text: inu_url,
    },
  };

  outputs[0] = text;

  if (fs.existsSync(IMAGEPATH + pathConfirmedImageName)) {
    const image = {
      simpleImage: {
        imageUrl: IMAGEURL + pathConfirmedImageName,
        altText: "동선",
      },
    };

    outputs[1] = image;
  }

  res.status(200).send(responseBody);
});
app.all("/map", function (req, res) {
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleImage: {
            imageUrl: IMAGEURL + "map_info.png",
            altText: "강의실",
          },
        },
        {
          simpleImage: {
            imageUrl: IMAGEURL + "map.png",
            altText: "지도",
          },
        },
      ],
    },
  };

  res.status(200).send(responseBody);
});

app.get("/", function (req, res) {
  res.send("msw : " + busCallCount + " " + busHotTime);
});

app.listen(3000, function () {});
