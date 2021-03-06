import axios from "axios";
import { parse } from "node-html-parser";
import download from "image-downloader";
import { IMAGEPATH, pathConfirmedImageName } from "../utils/util.js";

export const updatePath = async (prev) => {
  let text = "";
  try {
    const raw_url = "https://www.inu.ac.kr/user/";
    const url = "https://www.inu.ac.kr/user/boardList.do?boardId=648880&siteId=inu";

    const html = await axios.get(url);
    const root = parse(html.data);

    const numberArr = root.querySelectorAll(".no");

    let officialIndex = 0;
    for (let i = 0; i < numberArr.length; i++) {
      if (numberArr[i].childNodes[1]?.rawTagName === "img") {
        // 공지는 td에 img태그를 사용한다.
      } else {
        // 공지는 건너뛰고 가장 맨 앞 게시글
        officialIndex = i;
        break;
      }
    }

    const arr = root.querySelectorAll(".textAL");
    const link = arr[officialIndex].childNodes[1].rawAttrs.split("'")[1];

    const image_url = (raw_url + link).replace(/&amp;/gi, "&");
    const image_html = await axios.get(image_url);
    const image_root = parse(image_html.data);
    const image_attr = image_root.querySelector(".bdViewCont").childNodes[1].rawAttrs;

    text = image_attr.split('"')[1];
    if (text) {
      if (text[0] === "h") {
        // 이미지 경로가 절대경로일 때가 있고 상대경로일 때가 있음;;
      } else {
        text = "https://inu.ac.kr" + text;
      }
    } else {
      return null;
    }

    if (prev !== text) {
      download.image({ url: text, dest: IMAGEPATH + pathConfirmedImageName });
    }

    return text;
  } catch {
    console.log("err");
    return null;
  }
};
