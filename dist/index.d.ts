declare type prop = {
    min: number;
    max: number;
    divs?: number;
    inValue?: number;
    onDrag: (value: number) => void;
    onUpdate: (value: number) => void;
    debug?: boolean;
};
export default function Slider({ min, max, divs, inValue, onUpdate, onDrag, debug, }: prop): JSX.Element;
export {};
