import { updateCovid } from "./covid/index.js";
import { updateBus } from "./bus/index.js";
import { updateMenu } from "./menu/index.js";

let nowHours = -1;

let needCovidUpdate = false;
let covidText = "";

let needBusUpdate = false;
let busText = "";

let needMenuUpdate = false;
let menuText = "";

const checkTime = () => {
  const date = new Date();
  const hours = date.getHours();

  // 매 시각당 1번만 들어오게
  if (nowHours != hours) {
    nowHours = hours;
    if (nowHours === 9) {
      needCovidUpdate = true;
    }
    if (0 <= nowHours && nowHours <= 5) {
      needBusUpdate = false;
    } else {
      needBusUpdate = true;
    }
    if (nowHours === 6) {
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
})();

setInterval(async () => {
  checkTime();
  if (needCovidUpdate) {
    const r = await updateCovid(-1);
    if (r !== null) {
      covidText = r;
      needCovidUpdate = false;
    }
  }
  if (needMenuUpdate) {
    const r = await updateMenu();
    if (r !== null) {
      menuText = r;
      needMenuUpdate = false;
    }
  }
}, 300000);

setInterval(async () => {
  if (needBusUpdate) {
    const r = await updateBus();
    if (r !== null) {
      busText = r;
    }
  }
}, 20000);

// KAKAO I OPEN BUILDER //

import express from "express";
const app = express();
import bodyParser from "body-parser";

app.use(bodyParser.json());

app.post("/covid", function (req, res) {
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
app.post("/bus", function (req, res) {
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
app.post("/menu", function (req, res) {
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

app.get("/", function (req, res) {
  res.send("msw");
});

/*
  배포 테스트
*/

app.get("/covid", function (req, res) {
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
app.get("/bus", function (req, res) {
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
app.get("/menu", function (req, res) {
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

app.listen(3000, function () {});
