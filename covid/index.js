import { call } from "./api.js";
import { xmlToObj, objToTxt } from "./parser.js";

const callApi = async (offset) => {
  // offset이 -1이면 어제~오늘 데이터, offset이 -2면 그제~어제 데이터

  // 총 이틀치의 데이터가 필요한 이유는 일일 확진자 증가량을 계산하기 때문에
  // 증가량 = 오늘 - 어제
  const startOffset = offset;
  const endOffset = startOffset + 1;

  const sidoXml = await call.sidoInfState(startOffset, endOffset);
  if (sidoXml === null) {
    return null;
  }
  const sidoObj = xmlToObj.sidoInfState(sidoXml);

  return objToTxt.sidoInfState(sidoObj);
};

export const updateCovid = async (offset) => {
  const result = await callApi(offset);
  if (result !== null) {
    return result;
  }
  return null;
};
