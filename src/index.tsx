import React, { useState, useRef, useLayoutEffect } from "react";

type prop = {
  min: number;
  max: number;
  divs?: number;
  inValue?: number;
  onDrag: (value: number) => void;
  onUpdate: (value: number) => void;
  debug?: boolean;
};

let sliderWidth = 0;
let pxMax = 0;
let pxMin = 0;
let initialX = 0;
let active = false;
let dragValue = 0;
let mainValue = 0;
let handlePos = 0;
let handleWidth = 0;

export default function Slider({
  min,
  max,
  divs,
  inValue,
  onUpdate,
  onDrag,
  debug,
}: prop): JSX.Element {
  const [posPerc, setPosPerc] = useState(50); //center of the handle

  const divMain = useRef<HTMLDivElement>(null);
  const divHandle = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    function handleResize(): void {
      const rect = divMain.current?.getBoundingClientRect();
      const divMainWidth = rect ? rect.width : 0;
      const rectH = divHandle.current?.getBoundingClientRect();
      handleWidth = rectH ? rectH.width : 0;

      pxMin = handleWidth / 2;
      pxMax = divMainWidth - pxMin;

      sliderWidth = pxMax - pxMin;

      const p = pxMin + ((mainValue - min) / (max - min)) * sliderWidth;
      newHandle(p);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return (): void => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    const v = inValue == undefined ? (min + max) / 2 : inValue;
    const p = pxMin + ((v - min) / (max - min)) * sliderWidth;
    newHandle(p);

    //console.log("😁", p);
    mainValue = v;
  }, [inValue]);

  const dragStart = (e: React.MouseEvent): void => {
    e.preventDefault();
    initialX = e.clientX - handlePos - handleWidth / 2;
    active = true;
  };

  const dragMove = (e: React.MouseEvent): void => {
    e.preventDefault();
    translate(e.clientX - initialX);
    onDrag(dragValue);
  };

  const dragEnd = (e: React.MouseEvent): void => {
    e.preventDefault();
    active = false;
    if (debug) {
      //console.log("value is:", v, " handlePos=", posPerc);
    }

    //console.log(handlePos);
    onUpdate(dragValue);
    //console.log("pxMax", pxMax);
  };

  const translate = (xPos: number): void => {
    if (active) {
      const newPos = xPos - handleWidth / 2;
      newHandle(checkPos(newPos));
    }
  };

  const newHandle = (pos: number): void => {
    const divsd = divs || 0;
    const vRelative = (pos - pxMin) / sliderWidth;
    let val = vRelative * (max - min) + min;
    let p = pos;
    //
    if (divsd > 1) {
      const step = (max - min) / (divsd - 1);
      val = Math.round(val / step) * step; //????????????????
      p = pxMin + ((val - min) / (max - min)) * sliderWidth;
    }
    const pck = checkPos(p);
    handlePos = pck;
    setPosPerc((100 * pck) / (handleWidth + sliderWidth));
    dragValue = val;
    //console.log("🍔", dragValue);
  };

  const checkPos = (pos: number): number => {
    switch (true) {
      case pos < pxMin: {
        return pxMin;
        break;
      }
      case pos > pxMax: {
        return pxMax;
        break;
      }
      default: {
        return pos;
      }
    }
  };

  const touchStart = (e: React.TouchEvent): void => {
    e.preventDefault();
    const x = e.touches[0].clientX;
    initialX = x - handlePos - handleWidth / 2;
    active = true;
  };

  const touchMove = (e: React.TouchEvent): void => {
    e.preventDefault();
    const x = e.touches[0].clientX;
    translate(x - initialX);
    onDrag(dragValue);
  };

  const touchEnd = (e: React.TouchEvent): void => {
    e.preventDefault();
    active = false;
    onUpdate(mainValue);
  };

  const styleL = {
    left: `${100 * (handleWidth / (2 * sliderWidth))}%`,
    width: `${Math.abs(posPerc - 100 * (handleWidth / (2 * sliderWidth)))}%`,
    height: "20%",
    backgroundColor: "lightskyblue",
    borderRadius: "3px",
    position: "absolute" as "absolute",
    zIndex: 1,
    cursor: "pointer",
  };

  const styleR = {
    left: `${posPerc}%`,
    width: `${Math.abs(100 - posPerc - 100 * (handleWidth / (2 * sliderWidth)))}%`,
    height: "20%",
    backgroundColor: "lightgray",
    borderRadius: "3px",
    position: "absolute" as "absolute",
    zIndex: 0,
    cursor: "pointer",
  };

  const styleHandle = {
    left: `${posPerc - 100 * (handleWidth / (2 * sliderWidth))}%`,
    width: "2em",
    zIndex: debug || false ? 0 : 2,
    height: "2em",
    backgroundColor: "darkslategrey",
    border: "0.2em solid rgba(136, 136, 136, 0.5)",
    borderRadius: "20%",
    touchAction: "none",
    //userSelect: "none",
    position: "absolute" as "absolute",
    //top: "0px",
    cursor: active ? "grabbing" : "grab",
  };

  const styleMainDiv = {
    width: "100%",

    height: "5em",
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "7px",
    touchAction: "none",
    border: "solid red",
    borderWidth: debug || false ? "1px" : "0px",
    position: "relative" as "relative",
  };

  return (
    <div
      style={styleMainDiv}
      ref={divMain}
      onMouseUp={dragEnd}
      onMouseLeave={dragEnd}
      onMouseMove={dragMove}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}>
      <div
        ref={divHandle}
        style={styleHandle}
        onMouseDown={dragStart}
        onTouchStart={touchStart}></div>

      <div style={styleL}></div>
      <div style={styleR}></div>
    </div>
  );
}
