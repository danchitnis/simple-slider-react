/// <reference types="react" />
declare type prop = {
    width: string;
    onUpdate: (value: number) => void;
    debug?: boolean;
};
export default function Slider({ width, onUpdate, debug }: prop): JSX.Element;
export {};
