/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
import React from "react"; // ,{useRef}
import eventCode from "./data/eventCode.json";
import qwerty from "./data/qwerty.json";
import dvorak from "./data/dvorak.json";
import jis109 from "./data/JIS109.json";
import "./keyboard.css";
import useWindowDimensions from "./useWindowDimensions";

let functionalLayout = "qwerty";
const functionalLayoutType = { qwerty, dvorak, custom: qwerty };
let physicalLayout = "jis109";
const physicalLayoutType = { jis109, custom: jis109 };

/**
 * `row` 行の `column` 列までの幅の合計を計算します。
 * @param row `row`
 * @param column `column`
 * @returns `width` と `jis109.eventCode.marginColumn` の合計
 */
function sumWidth(row: number, column: number): number {
  // @ts-ignore
  let sum = physicalLayoutType[physicalLayout].marginColumn;
  let j = 0;
  for (const code of eventCode) {
    if (
      // @ts-ignore
      physicalLayoutType[physicalLayout].eventCode[code].row === row &&
      // @ts-ignore
      physicalLayoutType[physicalLayout].eventCode[code].column < column
    ) {
      // @ts-ignore
      sum +=
        physicalLayoutType[physicalLayout].eventCode[code].width +
        physicalLayoutType[physicalLayout].marginColumn;
      j++;
    }
    if (j >= column) break;
  }
  return sum;
}

/**
 * `row` までの高さの合計を計算します。
 * @param row `row`
 * @returns `row` までの高さの合計
 */
function sumHeight(row: number): number {
  return (
    // @ts-ignore
    physicalLayoutType[physicalLayout].marginRow +
    (physicalLayoutType[physicalLayout].height +
      physicalLayoutType[physicalLayout].marginRow) *
      (row - 1)
  );
}

Keyboard.defaultProps = {
  keyColors: "",
  setKeyColors: (value: string) => {},
  pressed: () => {},
  content: "",
  setContent: (value: string) => {},
  keyLayout: qwerty,
};

export default function Keyboard({
  functional,
  physical,
  keyColors,
  setKeyColors,
  pressed,
  content,
  setContent,
  keyLayout,
  physicalKeyLayout,
}: {
  functional: string;
  physical: string;
  keyColors?: string[];
  setKeyColors?: (value: string[]) => void;
  pressed?: (
    keyColors: string[],
    setKeyColors: (value: string[]) => void,
    code: string,
    content: string,
    setContent: (value: string) => void,
    functional: string
  ) => void;
  content?: string;
  setContent?: (value: string) => void;
  keyLayout?: object;
  physicalKeyLayout?: object;
}): JSX.Element {
  const { width } = useWindowDimensions();
  const magnification = 5.8 * (width < 850 ? 1 : 850 / width);

  functionalLayout = functional;
  physicalLayout = physical;
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  functionalLayoutType.custom = keyLayout!;
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  physicalLayoutType.custom = physicalKeyLayout!;
  // const fontSize=0.015; // vw/100
  return (
    <>
      <div id="keyboard">
        {eventCode.map((code, i) => (
          <div
            key={code}
            id={code}
            className="key"
            // @ts-ignore
            onClick={() =>
              pressed(
                keyColors,
                setKeyColors,
                code,
                content,
                setContent,
                functional
              )
            }
            style={{
              position: "absolute",
              // @ts-ignore
              backgroundColor: keyColors[i],
              // @ts-ignore
              top: `${
                sumHeight(
                  physicalLayoutType[physicalLayout].eventCode[code].row
                ) * magnification
              }vw`,
              // @ts-ignore
              left: `${
                sumWidth(
                  physicalLayoutType[physicalLayout].eventCode[code].row,
                  physicalLayoutType[physicalLayout].eventCode[code].column
                ) * magnification
              }vw`,
              // @ts-ignore
              width: `${
                physicalLayoutType[physicalLayout].eventCode[code].width *
                magnification
              }vw`,
              // @ts-ignore
              height: `${
                physicalLayoutType[physicalLayout].height * magnification
              }vw`,
            }}
            // ref={dom=>{
            //   let fontSizePx=window.innerWidth*fontSize;
            //   const widthPx=physicalLayoutType[physicalLayout].eventCode[code].width * magnification* window.innerWidth*0.01;// func
            //   // while(dom?.scrollWidth>=widthPx){
            //   //   fontSizePx--;
            //   //   // dom?.style.fontSize="10px";//fontSizePx+"px"
            //   // }
            //   // dom?.style.backgroundColor="black";
            //   // console.log(dom?.style.fontSize);
            // }}
            // // while(dom?.scrollWidth>=dom.width){
            //   //   dom.fontSize=dom.fontSize-1;
            //   // }
          >
            {/* @ts-ignore */}
            {functionalLayoutType[functionalLayout][code]}
          </div>
        ))}
      </div>
    </>
  );
}
