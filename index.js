import { updateCovid } from "./covid/index.js";
import { updateBus } from "./bus/index.js";
import { updateMenu } from "./menu/index.js";
import { updatePath } from "./pathConfirmed/index.js";

let nowHours = -1;

let needCovidUpdate = false;
let covidText = "";

let needBusUpdate = false;
let busText = "";

let needMenuUpdate = false;
let menuText = "";

let needPathUpdate = false;
let pathText = "";

const checkTime = () => {
  const date = new Date();
  const hours = date.getHours();

  // 매 시각당 1번만 들어오게
  if (nowHours != hours) {
    nowHours = hours;
    if (nowHours === 9) {
      needCovidUpdate = true;
    }
    if (1 <= nowHours && nowHours <= 6) {
      needBusUpdate = false;
    } else {
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

  pathText = await updatePath();
})();

// 5분
setInterval(async () => {
  if (needCovidUpdate) {
    const r = await updateCovid(-1);
    console.log(r);
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

// 20초
setInterval(async () => {
  if (needBusUpdate) {
    const r = await updateBus();
    if (r !== null) {
      busText = r;
    } else {
      busText = "버스 에러";
    }
  }
}, 20000);

// 1분
setInterval(async () => {
  checkTime();
  if (needPathUpdate) {
    const r = await updatePath();
    if (r !== null) {
      pathText = r;
    } else {
      pathText = "확진자 동선 에러";
    }
  }
}, 60000);

// KAKAO I OPEN BUILDER //

import express from "express";
const app = express();
import bodyParser from "body-parser";

app.use(bodyParser.json());

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
  const responseBody = {
    version: "2.0",
    template: {
      outputs: [],
    },
  };
  const text = {
    simpleText: {
      text: pathText,
    },
  };
  const image = {
    simpleImage: {
      imageUrl: pathText,
      altText: "동선",
    },
  };

  const {
    template: { outputs },
  } = responseBody;
  if (pathText === null || pathText.includes("에러")) {
    outputs[0] = text;
  } else {
    outputs[0] = image;
  }

  res.status(200).send(responseBody);
});

app.get("/", function (req, res) {
  res.send("msw");
});

app.listen(3000, function () {});
