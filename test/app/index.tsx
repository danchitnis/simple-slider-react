import React, { useState } from "react";

import SimpleSlider from "../../src";

export default function MainApp(): JSX.Element {
  const [sliderVal, setSliderVal] = useState(0);
  const [sliderInVal, setSliderInVal] = useState(2);

  const onUpdate = (value: number): void => {
    setSliderInVal(value);
    //console.log("from main: ", value);
  };

  const onDrag = (value: number): void => {
    //setSliderVal(value);
  };

  const onClick = (): void => {
    setSliderInVal(10);
  };

  return (
    <div>
      <SimpleSlider
        min={0}
        max={10}
        inValue={sliderInVal}
        onDrag={onDrag}
        onUpdate={onUpdate}
        divs={11}
        debug={true}
      />

      <p>Hello! 😀 {sliderInVal}</p>

      <button onClick={onClick}>Set Value</button>
    </div>
  );
}
