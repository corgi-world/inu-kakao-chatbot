import { call } from "./api.js";
import { xmlToTxt } from "./parser.js";

export const updateBus = async () => {
  try {
    const xml = await call.busArrivalList();
    return xmlToTxt.busArrivalList(xml);
  } catch {
    return "bus timeout error";
  }
};
