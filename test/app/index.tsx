import React, { useState } from "react";

import SimpleSlider from "../../src";

export default function MainApp() {
  const onUpdate = (value: number) => {};

  return (
    <div>
      <SimpleSlider width={"100%"} onUpdate={onUpdate} />
      <p>Hello! 😀</p>
    </div>
  );
}
