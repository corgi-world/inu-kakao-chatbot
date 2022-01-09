import axios from "axios";

const key =
  "dBXa3zczNeoLscWh/ON+qGePIwWOHteh9KrDrTkhsU3b75W0LgJBHyYOhxcP4A8epY7iuoBJjla5WMdzV6vDwg==";
const endpoint = "http://openapi.data.go.kr/openapi/service/rest/Covid19/";
const infState = "getCovid19InfStateJson";
const genAgeCaseInf = "getCovid19GenAgeCaseInfJson";
const sidoInfState = "getCovid19SidoInfStateJson";

const api = axios.create({
  baseURL: endpoint,
  params: {
    ServiceKey: key,
    pageNO: "1",
    numOfRows: "1",
  },
});

export const call = {
  infState: (startOffset, endOffset) => get(infState, startOffset, endOffset),
  genAgeCaseInf: (startOffset, endOffset) => get(genAgeCaseInf, startOffset, endOffset),
  sidoInfState: (startOffset, endOffset) => get(sidoInfState, startOffset, endOffset),
};

const get = (serviceURL, startOffset, endOffset) => {
  const start = getDate(startOffset);
  const end = getDate(endOffset);

  return api.get(serviceURL, {
    params: {
      startCreateDt: start,
      endCreateDt: end,
    },
  });
};

const getDate = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = ("0" + (1 + date.getMonth())).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  return year + month + day;
};
