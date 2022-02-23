export const xmlToObj = {
  infState: (xml) => {},
  genAgeCaseInf: (xml) => {},
  sidoInfState: (xml) => {
    let result = {};
    let index = -1;
    let key = "";
    let str = "";

    const totalCount = xml.data.response?.body.totalCount;
    // 이틀치가 정상적으로 업데이트 되면 item의 개수가 38개여야 한다.
    // 경기...서울...부산...인천...등등 지역이 총 19개 * 이틀 = 38
    if (totalCount !== 38) {
      return null;
    }

    const items = xml.data.response.body.items.item;
    for (let item of items) {
      let day = item.createDt.split(" ")[0];
      if (key != day) {
        key = day;
        index++;
        str = index == 0 ? "today" : "yesterday";

        result[str] = {};
        let dayTime = item.createDt.split(".")[0];
        result[str]["createDt"] = dayTime;
        result[str]["items"] = {};
      }

      result[str]["items"][item.gubun] = item.incDec;
    }

    return result;
  },
};

export const objToTxt = {
  infState: (obj) => {},
  genAgeCaseInf: (obj) => {},
  sidoInfState: (obj) => {
    const today = obj.today;
    const yesterday = obj.yesterday;

    const sti = objSort(today.items);
    const syi = objSort(yesterday.items);

    let result = today.createDt;

    const keys = Object.keys(sti);
    for (let key of keys) {
      const inc = syi[key] - sti[key];
      const incAbs = inc < 0 ? inc * -1 : inc;
      let incStr = inc < 0 ? "↑" + incAbs : inc == 0 ? "" + incAbs : "↓" + incAbs;

      result += "\n" + key + " : " + sti[key] + "명 " + incStr;
    }

    return result;
  },
};

const objSort = (obj) => {
  const sortedObj = Object.entries(obj)
    .sort(([, a], [, b]) => b - a)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  return sortedObj;
};
