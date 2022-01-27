import axios from "axios";
import { parse } from "node-html-parser";
import { getTodayString } from "../utils/util.js";

export const updateMenu = async () => {
  const url =
    "https://www.inu.ac.kr/com/cop/mainWork/foodList1.do?siteId=inu&id=inu_050110010000";

  let text = getTodayString(false) + "\n";
  try {
    const html = await axios.get(url);
    const root = parse(html.data);

    const headText = root.querySelector(".sickdangmenu dt").firstChild._rawText;
    const check = headText === "조식";
    if (!check) return headText;

    const arr = root.querySelectorAll(".sickdangmenu dl");
    text +=
      arr[1].childNodes[1].firstChild._rawText +
      "\n" +
      arr[1].childNodes[3].childNodes[1]._rawText.split(" ")[0] +
      arr[2].childNodes[1].firstChild._rawText +
      "\n" +
      arr[2].childNodes[3].childNodes[1]._rawText.split(" ")[0] +
      arr[3].childNodes[1].firstChild._rawText +
      "\n" +
      arr[3].childNodes[3].childNodes[1]._rawText.split(" ")[0];
  } catch {
    return null;
  }

  const filtered_arr = text.split("\n").filter((t) => {
    if (t !== "" && t !== " ") return t;
  });

  text = "";
  filtered_arr.forEach((t) => {
    text += t + "\n";
    if (t.includes("*")) {
      text += "\n";
    }
  });

  text = text.slice(0, -2);
  text = text.replace(/&amp;/gi, "&");
  return text;
};
