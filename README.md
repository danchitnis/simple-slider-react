# simple-slider-react

A simple range slider optimized for numerical applications. Features include:

- Compatible with React v16
- min, max, and default values
- Single file library with no dependency, written in Typescript and compatible with ES6
- Touch enabled for touchscreen devices
- Responsive to real-time layout change

## How to use

Initialization

```HTML
<div>
    <SimpleSlider
        min={0}
        max={10}
        inValue={sliderVal}
        onDrag={onDrag}
        onUpdate={onUpdate}
        divs={11}
    />
</div>
```

handle the update events

```javascript
const onUpdate = (value: number): void => {
  //do something
};

const onDrag = (value: number): void => {
  //do something
};
```

## Demo

See [here](https://simple-slider-react.now.sh/)

## API documentation

## Contributions

inspired by [noUiSlider](https://github.com/leongersen/noUiSlider/)
