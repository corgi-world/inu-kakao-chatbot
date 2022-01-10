import { XMLParser } from "fast-xml-parser";
import { getTodayString } from "../utils/util.js";

export const xmlToTxt = {
  busArrivalList: (xml) => {
    const parser = new XMLParser();
    const obj = parser.parse(xml.data);
    // 버스 끊겼을 때 확인
    const items = obj.ServiceResult.msgBody.itemList;

    const result = {};
    items.forEach((item) => {
      result[item.ROUTEID] = item;
    });

    return objToTxt.busArrivalList(result);
  },
};

const objToTxt = {
  busArrivalList: (obj) => {
    const sortedArr = sortObjBySec(obj);

    let text = getTodayString() + "\n";
    sortedArr.forEach((bus) => {
      const busID = bus[0];
      if (busID in busNameObj) {
        const v = bus[1];
        text += "\n" + busNameObj[busID] + " 버스\n";
        text += v.REST_STOP_COUNT + "개 전, ";
        text += secToMinute(v.ARRIVALESTIMATETIME) + "\n";
        text += v.LATEST_STOP_NAME + " 출발\n";
      }
    });

    return text;
  },
};

const sortObjBySec = (obj) => {
  const obj_arr = Object.entries(obj);

  for (let i = 0; i < obj_arr.length; i++) {
    let swap;
    for (let j = 0; j < obj_arr.length - 1 - i; j++) {
      if (obj_arr[j][1].ARRIVALESTIMATETIME > obj_arr[j + 1][1].ARRIVALESTIMATETIME) {
        swap = obj_arr[j];
        obj_arr[j] = obj_arr[j + 1];
        obj_arr[j + 1] = swap;
      }
    }
  }

  return obj_arr;
};

const secToMinute = (sec) => {
  const m = parseInt(sec / 60);
  const s = sec % 60;

  if (90 < sec) {
    return `${m}분 ${s}초`;
  } else return "곧 도착";
};

const busNameObj = {
  165000012: "8번",
  165000020: "16번",
  164000001: "98번",
  161000008: "급행99번",
  161000007: "58번",
  213000019: "3002번",
};
