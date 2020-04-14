/// <reference types="react" />
declare type prop = {
    width: string;
    onUpdate: (value: number) => void;
};
export default function Slider({ width, onUpdate }: prop): JSX.Element;
export {};
