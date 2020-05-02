import React, { useState } from "react";

import SimpleSlider from "../../src";

export default function MainApp() {
  let [sliderVal, setSliderVal] = useState(0);

  const onUpdate = (value: number) => {
    setSliderVal(value);
  };

  const onClick = () => {
    setSliderVal(10);
  };

  return (
    <div>
      <SimpleSlider min={0} max={100} inValue={sliderVal} onUpdate={onUpdate} />

      <p>Hello! 😀 {sliderVal}</p>

      <button onClick={onClick}>Set Value</button>
    </div>
  );
}
