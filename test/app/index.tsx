import React, { useState } from "react";

import SimpleSlider from "../../src";

export default function MainApp() {
  let [sliderVal, setSliderVal] = useState(0);
  let [sliderInVal, setSliderInVal] = useState(0);

  const onUpdate = (value: number) => {
    //setSliderVal(value);
  };

  const onDrag = (value: number) => {
    setSliderVal(value);
  };

  const onClick = () => {
    setSliderInVal(10);
  };

  return (
    <div>
      <SimpleSlider
        min={1}
        max={2}
        inValue={sliderInVal}
        onDrag={onDrag}
        onUpdate={onUpdate}
        divs={11}
      />

      <p>Hello! 😀 {sliderVal}</p>

      <button onClick={onClick}>Set Value</button>
    </div>
  );
}
