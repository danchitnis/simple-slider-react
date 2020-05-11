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

let sliderWidth = 0;
let pxMax = 0;
let pxMin = 0;
let initialX = 0;
let active = false;
let dragValue = 0;
let mainValue = 0;
let handlePos = 0;
let handleWidth = 0;
function Slider({ min, max, divs, inValue, onUpdate, onDrag, debug, }) {
    const [posPerc, setPosPerc] = React.useState(50); //center of the handle
    const divMain = React.useRef(null);
    const divHandle = React.useRef(null);
    React.useLayoutEffect(() => {
        function handleResize() {
            var _a, _b;
            const rect = (_a = divMain.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
            const divMainWidth = rect ? rect.width : 0;
            const rectH = (_b = divHandle.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
            handleWidth = rectH ? rectH.width : 0;
            pxMin = handleWidth / 2;
            pxMax = divMainWidth - pxMin;
            sliderWidth = pxMax - pxMin;
            const p = pxMin + ((mainValue - min) / (max - min)) * sliderWidth;
            newHandle(p);
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    React.useLayoutEffect(() => {
        const v = inValue == undefined ? (min + max) / 2 : inValue;
        const p = pxMin + ((v - min) / (max - min)) * sliderWidth;
        newHandle(p);
        //console.log("😁", p);
        mainValue = v;
    }, [inValue]);
    const dragStart = (e) => {
        e.preventDefault();
        initialX = e.clientX - handlePos - handleWidth / 2;
        active = true;
    };
    const dragMove = (e) => {
        e.preventDefault();
        translate(e.clientX - initialX);
        onDrag(dragValue);
    };
    const dragEnd = (e) => {
        e.preventDefault();
        active = false;
        //console.log(handlePos);
        onUpdate(dragValue);
        //console.log("pxMax", pxMax);
    };
    const translate = (xPos) => {
        if (active) {
            const newPos = xPos - handleWidth / 2;
            newHandle(checkPos(newPos));
        }
    };
    const newHandle = (pos) => {
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
    const checkPos = (pos) => {
        switch (true) {
            case pos < pxMin: {
                return pxMin;
            }
            case pos > pxMax: {
                return pxMax;
            }
            default: {
                return pos;
            }
        }
    };
    const touchStart = (e) => {
        e.preventDefault();
        const x = e.touches[0].clientX;
        initialX = x - handlePos - handleWidth / 2;
        active = true;
    };
    const touchMove = (e) => {
        e.preventDefault();
        const x = e.touches[0].clientX;
        translate(x - initialX);
        onDrag(dragValue);
    };
    const touchEnd = (e) => {
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
        position: "absolute",
        zIndex: 1,
        cursor: "pointer",
    };
    const styleR = {
        left: `${posPerc}%`,
        width: `${Math.abs(100 - posPerc - 100 * (handleWidth / (2 * sliderWidth)))}%`,
        height: "20%",
        backgroundColor: "lightgray",
        borderRadius: "3px",
        position: "absolute",
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
    return (React__default.createElement("div", { style: styleMainDiv, ref: divMain, onMouseUp: dragEnd, onMouseLeave: dragEnd, onMouseMove: dragMove, onTouchMove: touchMove, onTouchEnd: touchEnd },
        React__default.createElement("div", { ref: divHandle, style: styleHandle, onMouseDown: dragStart, onTouchStart: touchStart }),
        React__default.createElement("div", { style: styleL }),
        React__default.createElement("div", { style: styleR })));
}

module.exports = Slider;
//# sourceMappingURL=index.js.map
