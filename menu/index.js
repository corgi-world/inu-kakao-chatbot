import axios from "axios";
import { parse } from "node-html-parser";
import { getTodayString } from "../utils/util.js";

export const updateMenu = async () => {
  const url =
    "https://www.inu.ac.kr/com/cop/mainWork/foodList1.do?siteId=inu&id=inu_050110010000";

  let text = "";
  try {
    const html = await axios.get(url);
    const root = parse(html.data);

    const headText = root.querySelector(".sickdangmenu dt").firstChild._rawText;
    const check = headText === "조식"; // 오늘은 등록된 메뉴가 없습니다.
    if (!check) return "오늘은 등록된 메뉴가 없습니다.";

    const arr = root.querySelectorAll(".sickdangmenu dl");

    const lunch1Title = arr[1].childNodes[1].firstChild._rawText;
    const lunch2Title = arr[2].childNodes[1].firstChild._rawText;
    const dinnerTitle = arr[3].childNodes[1].firstChild._rawText;
    const lunch1 = arr[1].childNodes[3].childNodes[1]._rawText;
    const lunch2 = arr[2].childNodes[3].childNodes[1]._rawText;
    const dinner = arr[3].childNodes[3].childNodes[1]._rawText;

    if (lunch1 === "\n" && lunch2 === "\n" && dinner === "\n") {
      return "오늘은 등록된 메뉴가 없습니다.";
    }

    text +=
      lunch1Title +
      "\n" +
      lunch1 +
      "\n" +
      lunch2Title +
      "\n" +
      lunch2 +
      "\n" +
      dinnerTitle +
      "\n" +
      dinner +
      "\n";
  } catch {
    return null;
  }

  const filtered_arr = text.split("\n").filter((t) => {
    if (t !== "" && t !== " ") return t;
  });

  text = getTodayString(false) + "\n\n";
  filtered_arr.forEach((t) => {
    text += t + "\n";
    if (t.includes(":")) {
      // : 는 맨 마지막 시간 정보
      text += "\n";
    }
  });

  text = text.slice(0, -2);
  text = text.replace(/&amp;/gi, "&");

  return text;
};
