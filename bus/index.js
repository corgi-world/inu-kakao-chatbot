import { call } from "./api.js";
import { xmlToTxt } from "./parser.js";

const callApi = async () => {
  const xml = await call.busArrivalList();
  const text = xmlToTxt.busArrivalList(xml);
  return text;
};

export const updateBus = async () => {
  const result = await callApi();
  console.log(result);
  if (result !== null) {
    return result;
  }
  return null;
};
