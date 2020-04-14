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

function Slider(_a) {
    var width = _a.width, onUpdate = _a.onUpdate;
    var _b = React.useState(false), active = _b[0], setActive = _b[1];
    var _c = React.useState(50), value = _c[0], setValue = _c[1];
    var _d = React.useState(50), posPerc = _d[0], setPosPerc = _d[1];
    var _e = React.useState(0), handlePos = _e[0], setHandlePos = _e[1];
    var _f = React.useState(0), initialX = _f[0], setInitialX = _f[1];
    var _g = React.useState(0), sliderWidth = _g[0], setSliderWidth = _g[1];
    var divMain = React.useRef(null);
    var divHandle = React.useRef(null);
    var pxMax = React.useRef(0);
    var pxMin = React.useRef(0);
    //let sliderWidth = useRef<number>(0);
    var handleWidth = React.useRef(0);
    //let sliderWidth: number;
    //let handleWidth = 0;
    //let pxMin: number;
    //let pxMax: number;
    //const handleOffset = 10;
    React.useEffect(function () {
        function handleResize() {
            var _a, _b;
            var rect = (_a = divMain.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
            var divMainWidth = rect ? rect.width : 0;
            var rectH = (_b = divHandle.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
            handleWidth.current = rectH ? rectH.width : 0;
            //const width = divMainWidth - handleWidth.current;
            pxMin.current = handleWidth.current / 2;
            pxMax.current = divMainWidth - pxMin.current;
            setSliderWidth(divMainWidth);
            console.log("pxMin=", pxMin.current, " pxMax=", pxMax.current, " handlewidth=", handleWidth.current);
        }
        handleResize();
        setHandlePos((pxMax.current - pxMin.current) / 2);
        window.addEventListener("resize", handleResize);
        return function () {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    var styleL = {
        left: 100 * (handleWidth.current / (2 * sliderWidth)) + "%",
        width: posPerc - 100 * (handleWidth.current / (2 * sliderWidth)) + "%",
    };
    var styleR = {
        left: posPerc - 100 * (handleWidth.current / (2 * sliderWidth)) + "%",
        width: 100 - posPerc - 100 * (handleWidth.current / (2 * sliderWidth)) + "%",
    };
    var styleHandle = {
        left: posPerc - 100 * (handleWidth.current / (2 * sliderWidth)) + "%",
        width: "2em",
        zIndex: 0,
    };
    var styleMainDiv = {
        width: width,
    };
    var dragStart = function (e) {
        e.preventDefault();
        //console.log(e.currentTarget.getBoundingClientRect(), "🍔");
        setInitialX(e.clientX - handlePos - handleWidth.current / 2);
        setActive(true);
        //translate(e.clientX);
    };
    var dragMove = function (e) {
        e.preventDefault();
        translate(e.clientX - initialX);
        onUpdate(value);
    };
    var newHandle = function (pos) {
        setHandlePos(pos);
        setPosPerc((100 * pos) / sliderWidth);
        setValue((100 * (pos - pxMin.current)) / (pxMax.current - pxMin.current));
    };
    var translate = function (xPos) {
        if (active) {
            //setHandlePos(xPos - handleOffset);
            var newPos = xPos - handleWidth.current / 2;
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
    var dragEnd = function (e) {
        e.preventDefault();
        setActive(false);
        console.log("value is:", value, " handlePos=", posPerc);
    };
    return (React__default.createElement("div", { className: "simple-slider", style: styleMainDiv, ref: divMain, onMouseUp: dragEnd, onMouseLeave: dragEnd, onMouseMove: dragMove },
        React__default.createElement("div", { className: "simple-slider-handle", ref: divHandle, style: styleHandle, onMouseDown: dragStart }),
        React__default.createElement("div", { className: "simple-slider-barL", style: styleL }),
        React__default.createElement("div", { className: "simple-slider-barR", style: styleR })));
}

module.exports = Slider;
//# sourceMappingURL=main.js.map
