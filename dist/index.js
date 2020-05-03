'use strict';



function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css;
}

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

function Slider({ min, max, divs, inValue, onUpdate, onDrag, debug }) {
    let [active, setActive] = React.useState(false);
    let [value, setValue] = React.useState(50);
    let [posPerc, setPosPerc] = React.useState(50);
    let [handlePos, setHandlePos] = React.useState(0);
    let [initialX, setInitialX] = React.useState(0);
    let [sliderWidth, setSliderWidth] = React.useState(0);
    const divMain = React.useRef(null);
    const divHandle = React.useRef(null);
    let pxMax = React.useRef(0);
    let pxMin = React.useRef(0);
    let handleWidth = React.useRef(0);
    React.useLayoutEffect(() => {
        function handleResize() {
            var _a, _b;
            const rect = (_a = divMain.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
            const divMainWidth = rect ? rect.width : 0;
            const rectH = (_b = divHandle.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
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
    React.useLayoutEffect(() => {
        const v = inValue || (min + max) / 2;
        const p = handleWidth.current / 2 + ((v - min) / (max - min)) * sliderWidth;
        setHandlePos(p);
        setPosPerc((100 * p) / sliderWidth);
        setValue(v);
        onDrag(v);
        onUpdate(v);
    }, [inValue, sliderWidth]);
    const dragStart = (e) => {
        e.preventDefault();
        setInitialX(e.clientX - handlePos - handleWidth.current / 2);
        setActive(true);
    };
    const dragMove = (e) => {
        e.preventDefault();
        translate(e.clientX - initialX);
        onDrag(value);
    };
    const dragEnd = (e) => {
        e.preventDefault();
        setActive(false);
        if (debug) {
            console.log("value is:", value, " handlePos=", posPerc);
        }
        onUpdate(value);
    };
    const translate = (xPos) => {
        if (active) {
            const newPos = xPos - handleWidth.current / 2;
            newHandle(checkPos(newPos));
        }
    };
    const newHandle = (pos) => {
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
    const checkPos = (pos) => {
        switch (true) {
            case pos < pxMin.current: {
                return pxMin.current;
            }
            case pos > pxMax.current: {
                return pxMax.current;
            }
            default: {
                return pos;
            }
        }
    };
    const touchStart = (e) => {
        e.preventDefault();
        const x = e.touches[0].clientX;
        setInitialX(x - handlePos - handleWidth.current / 2);
        setActive(true);
    };
    const touchMove = (e) => {
        e.preventDefault();
        const x = e.touches[0].clientX;
        translate(x - initialX);
        onDrag(value);
    };
    const touchEnd = (e) => {
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
        position: "absolute",
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
        position: "absolute",
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
        position: "absolute",
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
        position: "relative",
    };
    return (React__default.createElement("div", { 
        //className="simple-slider"
        style: styleMainDiv, ref: divMain, onMouseUp: dragEnd, onMouseLeave: dragEnd, onMouseMove: dragMove, onTouchMove: touchMove, onTouchEnd: touchEnd },
        React__default.createElement("div", { 
            //className="simple-slider-handle"
            ref: divHandle, style: styleHandle, onMouseDown: dragStart, onTouchStart: touchStart }),
        React__default.createElement("div", { style: styleL }),
        React__default.createElement("div", { style: styleR })));
}

module.exports = Slider;
//# sourceMappingURL=index.js.map
