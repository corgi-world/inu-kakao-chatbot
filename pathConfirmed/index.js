import axios from "axios";
import { parse } from "node-html-parser";

export const updatePath = async () => {
  let text = "";
  try {
    const raw_url = "https://www.inu.ac.kr/user/";
    const url = "https://www.inu.ac.kr/user/boardList.do?boardId=648880&siteId=inu";

    const html = await axios.get(url);
    const root = parse(html.data);

    const arr = root.querySelectorAll(".textAL");
    const link = arr[0].childNodes[1].rawAttrs.split("'")[1];

    const image_url = (raw_url + link).replace(/&amp;/gi, "&");
    const image_html = await axios.get(image_url);
    const image_root = parse(image_html.data);
    const image_attr = image_root.querySelector(".bdViewCont").childNodes[1].rawAttrs;

    text = image_attr.split('"')[1];
    return text;
  } catch {
    return null;
  }
};
