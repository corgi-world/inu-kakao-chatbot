/*
  T1H: 기온[°]
  SKY: 하늘
  POP: 강수확률[%]
  WSD: 바람[m/s]
  baseTime: 호출시간
  fcstDate: 예측일자
  fcstTime: 예측시간
*/

const skyValues = { 1: "맑음", 3: "구름 많음", 4: "흐림" };
const wsdValues = (wsd) => {
  if (wsd < 4) {
    return "약함";
  } else if (wsd < 9) {
    return "약간 강함";
  } else if (wsd < 14) {
    return "강함";
  } else {
    return "매우 강함";
  }
};
const dnsty10Values = (v) => {
  // 미세먼지
  if (v == "-") {
    return "점검 중";
  }
  if (v <= 30) {
    return "좋음";
  } else if (v <= 80) {
    return "보통";
  } else if (v <= 150) {
    return "나쁨";
  } else {
    return "매우 나쁨";
  }
};
const dnsty25Values = (v) => {
  // 초미세먼지
  if (v == "-") {
    return "점검 중";
  }
  if (v <= 15) {
    return "좋음";
  } else if (v <= 35) {
    return "보통";
  } else if (v <= 75) {
    return "나쁨";
  } else {
    return "매우 나쁨";
  }
};

export const jsonToText = (short, ultraShort, dnsty) => {
  const c1 = checkResponse(short);
  const c2 = checkResponse(ultraShort);
  const c3 = checkResponse(dnsty);

  if (c1 !== "OK" && c2 !== "OK" && c3 !== "OK") {
    return "error";
  }

  const shortObj = shortToObj(short);
  const ultraShortObj = ultraShortToObj(ultraShort);
  const dnstyObj = dnstyToObj(dnsty);

  let text = dnstyObj.dataTime + "\n\n";
  text += `${ultraShortObj["T1H"]}° ${skyValues[ultraShortObj["SKY"]]}\n`;
  text += `강수확률 : ${shortObj["POP"]}%\n`;
  text += `바람 : ${wsdValues(ultraShortObj["WSD"])} (${ultraShortObj["WSD"]}m/s)\n`;
  text += `미세먼지 : ${dnsty10Values(dnstyObj["pm10Value"])} (${
    dnstyObj["pm10Value"]
  })\n`;
  text += `초미세먼지 : ${dnsty25Values(dnstyObj["pm25Value"])} (${
    dnstyObj["pm25Value"]
  })`;

  return text;
};

function shortToObj(json) {
  const items = json.data.response.body.items.item;
  const obj = items.reduce((prev, item) => {
    return { ...prev, [item["category"]]: item["fcstValue"] };
  }, {});

  obj["baseTime"] = items[0].baseTime.replace(/(\d{2})(\d{2})/g, "$1:$2");
  obj["fcstDate"] = items[0].fcstDate.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3");
  obj["fcstTime"] = items[0].fcstTime.replace(/(\d{2})(\d{2})/g, "$1:$2");

  return obj;
}
function ultraShortToObj(json) {
  const items = json.data.response.body.items.item;
  const obj = items.reduce((prev, item) => {
    // 초단기예보는 같은 항목을 시간별로 6개씩 줌.
    // 가장 앞에 있는 정보가 최근 정보
    if (prev.hasOwnProperty(item["category"])) {
      return { ...prev };
    } else {
      return { ...prev, [item["category"]]: item["fcstValue"] };
    }
  }, {});

  obj["baseTime"] = items[0].baseTime.replace(/(\d{2})(\d{2})/g, "$1:$2");
  obj["fcstDate"] = items[0].fcstDate.replace(/(\d{4})(\d{2})(\d{2})/g, "$1-$2-$3");
  obj["fcstTime"] = items[0].fcstTime.replace(/(\d{2})(\d{2})/g, "$1:$2");

  return obj;
}
function dnstyToObj(json) {
  const item = json.data.response.body.items[0];
  return {
    pm10Value: item["pm10Value"],
    pm25Value: item["pm25Value"],
    dataTime: item["dataTime"],
  };
}

function checkResponse(json) {
  const resultCode = json.data?.response?.header?.resultCode;
  if (resultCode !== "00") return "error header " + resultCode;

  const body = json.data?.response?.body;
  const items = body?.items;
  if (!items) return "error items is null";

  return "OK";
}
