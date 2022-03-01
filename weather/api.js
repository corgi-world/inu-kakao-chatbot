import axios from "axios";
import { API_KEY } from "../utils/util.js";

const key = API_KEY;
const endpoint = "http://apis.data.go.kr/";
const vilageFcst = "1360000/VilageFcstInfoService_2.0/getVilageFcst"; // 단기예보
const UltraSrtFcst = "1360000/VilageFcstInfoService_2.0/getUltraSrtFcst"; // 초단기예보
const mesureDnsty = "B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty"; // 미세먼지

// 송도1동
const nx = 54;
const ny = 123;

const api = axios.create({
  baseURL: endpoint,
  params: {
    ServiceKey: key,
    pageNO: "1",
  },
});

export const call = {
  vilageFcst: (base_date, base_time) =>
    api.get(vilageFcst, {
      params: {
        base_date,
        base_time,
        numOfRows: 12,
        nx,
        ny,
        dataType: "JSON",
      },
    }),
  UltraSrtFcst: (base_date, base_time) =>
    api.get(UltraSrtFcst, {
      params: {
        base_date,
        base_time,
        numOfRows: 60,
        nx,
        ny,
        dataType: "JSON",
      },
    }),
  mesureDnsty: () =>
    api.get(mesureDnsty, {
      params: {
        numOfRows: 1,
        returnType: "JSON",
        stationName: "송도",
        dataTerm: "DAILY",
        ver: "1.3",
      },
    }),
};
