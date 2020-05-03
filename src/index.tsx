import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
//import "./slider.css";

type prop = {
  min: number;
  max: number;
  divs?: number;
  inValue?: number;
  onDrag: (value: number) => void;
  onUpdate: (value: number) => void;
  debug?: boolean;
};

export default function Slider({ min, max, divs, inValue, onUpdate, onDrag, debug }: prop) {
  let [active, setActive] = useState(false);
  let [value, setValue] = useState(50);
  let [posPerc, setPosPerc] = useState(50);
  let [handlePos, setHandlePos] = useState(0);
  let [initialX, setInitialX] = useState(0);
  let [sliderWidth, setSliderWidth] = useState(0);

  const divMain = useRef<HTMLDivElement>(null);
  const divHandle = useRef<HTMLDivElement>(null);
  let pxMax = useRef<number>(0);
  let pxMin = useRef<number>(0);

  let handleWidth = useRef<number>(0);

  useLayoutEffect(() => {
    function handleResize() {
      const rect = divMain.current?.getBoundingClientRect();
      const divMainWidth = rect ? rect.width : 0;
      const rectH = divHandle.current?.getBoundingClientRect();
      handleWidth.current = rectH ? rectH.width : 0;

      pxMin.current = handleWidth.current / 2;
      pxMax.current = divMainWidth - pxMin.current;

      const midRange = (min + max) / 2;

      setSliderWidth(divMainWidth);
      const v = inValue || midRange;
      const p = handleWidth.current / 2 + ((v - min) / (max - min)) * divMainWidth;
      setHandlePos(p);
      setPosPerc((100 * p) / divMainWidth);
      setValue(v);

      //console.log("am here 😁");
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    const v = inValue || (min + max) / 2;
    const p = handleWidth.current / 2 + ((v - min) / (max - min)) * sliderWidth;
    setHandlePos(p);
    setPosPerc((100 * p) / sliderWidth);
    setValue(v);
    onDrag(v);
    onUpdate(v);
  }, [inValue, sliderWidth]);

  const dragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setInitialX(e.clientX - handlePos - handleWidth.current / 2);
    setActive(true);
  };

  const dragMove = (e: React.MouseEvent) => {
    e.preventDefault();
    translate(e.clientX - initialX);
    onDrag(value);
  };

  const dragEnd = (e: React.MouseEvent) => {
    e.preventDefault();
    setActive(false);
    if (debug) {
      console.log("value is:", value, " handlePos=", posPerc);
    }
    onUpdate(value);
  };

  const translate = (xPos: number) => {
    if (active) {
      const newPos = xPos - handleWidth.current / 2;
      newHandle(checkPos(newPos));
    }
  };

  const newHandle = (pos: number) => {
    const divsd = divs || 0;
    const vRelative = (pos - pxMin.current) / (pxMax.current - pxMin.current);
    let val = vRelative * (max - min) + min;
    let p = pos;
    //
    if (divsd > 1) {
      const step = (max - min) / (divsd - 1);
      val = Math.round(val / step) * step;
      p = handleWidth.current / 2 + ((val - min) / (max - min)) * sliderWidth;
    }
    const pck = checkPos(p);
    setHandlePos(pck);
    setPosPerc((100 * pck) / sliderWidth);
    setValue(val);
    //console.log(val);
  };

  const checkPos = (pos: number): number => {
    switch (true) {
      case pos < pxMin.current: {
        return pxMin.current;
        break;
      }
      case pos > pxMax.current: {
        return pxMax.current;
        break;
      }
      default: {
        return pos;
      }
    }
  };

  const touchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const x = e.touches[0].clientX;
    setInitialX(x - handlePos - handleWidth.current / 2);
    setActive(true);
  };

  const touchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const x = e.touches[0].clientX;
    translate(x - initialX);
    onDrag(value);
  };

  const touchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setActive(false);
    onUpdate(value);
  };

  const styleL = {
    left: `${100 * (handleWidth.current / (2 * sliderWidth))}%`,
    width: `${posPerc - 100 * (handleWidth.current / (2 * sliderWidth))}%`,

    height: "20%",
    backgroundColor: "lightskyblue",
    borderRadius: "3px",
    position: "absolute" as "absolute",
    //top: "0px",
    zIndex: 1,
    cursor: "pointer",
  };

  const styleR = {
    left: `${posPerc - 100 * (handleWidth.current / (2 * sliderWidth))}%`,
    width: `${100 - posPerc - 100 * (handleWidth.current / (2 * sliderWidth))}%`,

    height: "20%",
    backgroundColor: "lightgray",
    borderRadius: "3px",
    position: "absolute" as "absolute",
    //top: "0px",
    zIndex: 0,
    cursor: "pointer",
  };

  const styleHandle = {
    left: `${posPerc - 100 * (handleWidth.current / (2 * sliderWidth))}%`,
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
      //className="simple-slider"
      style={styleMainDiv}
      ref={divMain}
      onMouseUp={dragEnd}
      onMouseLeave={dragEnd}
      onMouseMove={dragMove}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}>
      <div
        //className="simple-slider-handle"
        ref={divHandle}
        style={styleHandle}
        onMouseDown={dragStart}
        onTouchStart={touchStart}></div>

      <div style={styleL}></div>
      <div style={styleR}></div>
    </div>
  );
}
