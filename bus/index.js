import { call } from "./api.js";
import { xmlToTxt } from "./parser.js";

export const updateBus = async () => {
  const xml = await call.busArrivalList();
  return xmlToTxt.busArrivalList(xml);
};
