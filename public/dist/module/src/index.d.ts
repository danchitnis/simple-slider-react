/// <reference types="react" />
declare type prop = {
    min: number;
    max: number;
    inValue?: number;
    onUpdate: (value: number) => void;
    debug?: boolean;
};
export default function Slider({ min, max, inValue, onUpdate, debug }: prop): JSX.Element;
export {};
