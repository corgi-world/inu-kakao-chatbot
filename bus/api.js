import axios from "axios";

const key =
  "dBXa3zczNeoLscWh/ON+qGePIwWOHteh9KrDrTkhsU3b75W0LgJBHyYOhxcP4A8epY7iuoBJjla5WMdzV6vDwg==";
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
});

export const call = {
  busArrivalList: () => api.get(busArrivalList),
};
