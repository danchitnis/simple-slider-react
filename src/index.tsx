import React, { useState, useEffect, useRef } from "react";
//import "./slider.css";

type prop = {
  width: string;
  onUpdate: (value: number) => void;
  debug?: boolean;
};

export default function Slider({ width, onUpdate, debug }: prop) {
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

  useEffect(() => {
    function handleResize() {
      const rect = divMain.current?.getBoundingClientRect();
      const divMainWidth = rect ? rect.width : 0;
      const rectH = divHandle.current?.getBoundingClientRect();
      handleWidth.current = rectH ? rectH.width : 0;

      pxMin.current = handleWidth.current / 2;
      pxMax.current = divMainWidth - pxMin.current;

      setSliderWidth(divMainWidth);
    }

    handleResize();

    setHandlePos((pxMax.current - pxMin.current) / 2);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const styleL = {
    left: `${100 * (handleWidth.current / (2 * sliderWidth))}%`,
    width: `${posPerc - 100 * (handleWidth.current / (2 * sliderWidth))}%`,

    height: "20%",
    backgroundColor: "lightskyblue",
    borderRadius: "3px",
    position: "absolute" as "absolute",
    //top: "0px",
    zIndex: 1,
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
  };

  const styleMainDiv = {
    width: width,

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

  const dragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setInitialX(e.clientX - handlePos - handleWidth.current / 2);
    setActive(true);
  };

  const dragMove = (e: React.MouseEvent) => {
    e.preventDefault();
    translate(e.clientX - initialX);
    onUpdate(value);
  };

  const newHandle = (pos: number) => {
    setHandlePos(pos);
    setPosPerc((100 * pos) / sliderWidth);
    setValue((100 * (pos - pxMin.current)) / (pxMax.current - pxMin.current));
  };

  const translate = (xPos: number) => {
    if (active) {
      const newPos = xPos - handleWidth.current / 2;

      switch (true) {
        case newPos < pxMin.current: {
          newHandle(pxMin.current);
          break;
        }
        case newPos > pxMax.current: {
          newHandle(pxMax.current);
          break;
        }
        default: {
          newHandle(newPos);
        }
      }
    }
  };

  const dragEnd = (e: React.MouseEvent) => {
    e.preventDefault();
    setActive(false);
    if (debug) {
      console.log("value is:", value, " handlePos=", posPerc);
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
    onUpdate(value);
  };

  const touchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setActive(false);
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
