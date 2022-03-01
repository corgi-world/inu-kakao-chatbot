import axios from "axios";
import { API_KEY } from "../utils/util.js";

const key = API_KEY;
const endpoint = "http://apis.data.go.kr/6280000/busArrivalService/";
const busArrivalList = "getAllRouteBusArrivalList";

const api = axios.create({
  baseURL: endpoint,
  params: {
    serviceKey: key,
    pageNo: "1",
    numOfRows: "20",
    bstopId: "164000395",
  },
  timeout: 2000,
});

export const call = {
  busArrivalList: () => api.get(busArrivalList),
};
