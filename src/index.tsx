import React, { useState, useEffect, useRef } from "react";
//import "./slider.css";

type prop = {
  width: string;
  onUpdate: (value: number) => void;
};

export default function Slider({ width, onUpdate }: prop) {
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
  //let sliderWidth = useRef<number>(0);
  let handleWidth = useRef<number>(0);

  //let sliderWidth: number;
  //let handleWidth = 0;
  //let pxMin: number;
  //let pxMax: number;

  //const handleOffset = 10;

  useEffect(() => {
    function handleResize() {
      const rect = divMain.current?.getBoundingClientRect();
      const divMainWidth = rect ? rect.width : 0;
      const rectH = divHandle.current?.getBoundingClientRect();
      handleWidth.current = rectH ? rectH.width : 0;

      //const width = divMainWidth - handleWidth.current;

      pxMin.current = handleWidth.current / 2;
      pxMax.current = divMainWidth - pxMin.current;

      setSliderWidth(divMainWidth);

      console.log(
        "pxMin=",
        pxMin.current,
        " pxMax=",
        pxMax.current,
        " handlewidth=",
        handleWidth.current
      );
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
  };

  const styleR = {
    left: `${posPerc - 100 * (handleWidth.current / (2 * sliderWidth))}%`,
    width: `${100 - posPerc - 100 * (handleWidth.current / (2 * sliderWidth))}%`,
  };

  const styleHandle = {
    left: `${posPerc - 100 * (handleWidth.current / (2 * sliderWidth))}%`,
    width: "2em",
    zIndex: 0,
  };

  const styleMainDiv = {
    width: width,
  };

  const dragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    //console.log(e.currentTarget.getBoundingClientRect(), "🍔");
    setInitialX(e.clientX - handlePos - handleWidth.current / 2);
    setActive(true);
    //translate(e.clientX);
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
      //setHandlePos(xPos - handleOffset);
      const newPos = xPos - handleWidth.current / 2;

      switch (true) {
        case newPos < pxMin.current: {
          //setHandlePos(pxMin.current);
          newHandle(pxMin.current);
          break;
        }
        case newPos > pxMax.current: {
          //setHandlePos(pxMax.current);
          newHandle(pxMax.current);
          break;
        }
        default: {
          //styleL = { left: `${handlePos - handleOffset}px`, width: "2em" };
          //setValue((100 * (handlePos - handleWidth.current / 2)) / sliderWidth);
          //styleR.width = `${handlePos - handleOffset}px`;
          newHandle(newPos);
        }
      }
    }
  };

  const dragEnd = (e: React.MouseEvent) => {
    e.preventDefault();
    setActive(false);
    console.log("value is:", value, " handlePos=", posPerc);
  };

  return (
    <div
      className="simple-slider"
      style={styleMainDiv}
      ref={divMain}
      onMouseUp={dragEnd}
      onMouseLeave={dragEnd}
      onMouseMove={dragMove}>
      <div
        className="simple-slider-handle"
        ref={divHandle}
        style={styleHandle}
        onMouseDown={dragStart}></div>

      <div className="simple-slider-barL" style={styleL}></div>
      <div className="simple-slider-barR" style={styleR}></div>
    </div>
  );
}
