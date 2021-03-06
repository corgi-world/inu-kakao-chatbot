import { XMLParser } from "fast-xml-parser";
import { getTodayString } from "../utils/util.js";

export const xmlToTxt = {
  busArrivalList: (xml) => {
    try {
      const parser = new XMLParser();
      const obj = parser.parse(xml.data);

      const totalCount = obj.ServiceResult.msgHeader.totalCount;
      if (totalCount === 0) {
        return getTodayString(true) + "\n" + "도착정보 없음";
      }

      const items = obj.ServiceResult.msgBody.itemList;

      const result = {};
      items.forEach((item) => {
        result[item.ROUTEID] = item;
      });

      const text = objToTxt.busArrivalList(result);
      return text;
    } catch {
      return "bus parsing error";
    }
  },
};

const objToTxt = {
  busArrivalList: (obj) => {
    const sortedArr = sortObjBySec(obj);

    const dateText = getTodayString(true);
    let text = dateText + "\n";
    sortedArr.forEach((bus) => {
      const busID = bus[0];
      if (busID in busNameObj) {
        const v = bus[1];
        text += "\n" + busNameObj[busID] + "\n";
        text += v.REST_STOP_COUNT + "개 전, ";

        if (v.REST_STOP_COUNT == 1 && v.ARRIVALESTIMATETIME <= 210) {
          text += "곧 도착\n";
        } else {
          text += secToMinute(v.ARRIVALESTIMATETIME) + "\n";
        }

        text += v.LATEST_STOP_NAME + " 출발\n";
      }
    });

    if (text === dateText + "\n") {
      return text + "도착정보 없음";
    }

    text = text.slice(0, -1);
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

  // 초를 보여주는건 오히려 위험할 듯
  return `${m}분 전`;
};

const busNameObj = {
  165000012: "8번 버스\n(정문, 자연과학대학, 공과대학)",
  165000020: "16번 버스\n(정문)",
  164000001: "98번 버스\n(정문, 자연과학대학, 공과대학)",
  161000008: "급행99번 버스\n(정문)",
  161000007: "58번 버스\n(정문)",
  213000019: "3002번 버스\n(정문, 자연과학대학, 공과대학)",
};
