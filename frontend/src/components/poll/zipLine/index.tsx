import React, {useState, Dispatch, SetStateAction} from "react";

import "./styles.scss";



export interface ZipLineProps {
  startTime: Date,
  endTime: Date
}

export const ZipLine: React.FunctionComponent<ZipLineProps> =
  (props: ZipLineProps): JSX.Element => {
    const kFrameDuration: number = 1000;

    const [fill, setFill]: [number, Dispatch<SetStateAction<number>>] =
      useState(
        ((new Date).getTime() - props.startTime.getTime()) /
        (props.endTime.getTime() - props.startTime.getTime() - kFrameDuration)
      );

    if (fill < 1) {
      const nextDate: Date = new Date();
      nextDate.setTime(nextDate.getTime() + kFrameDuration);
      nextDate.setMilliseconds(0);
      const nextFill: number =
        (nextDate.getTime() - props.startTime.getTime()) /
        (props.endTime.getTime() - props.startTime.getTime() - kFrameDuration);

      setTimeout(
        (): void => {
          setFill(nextFill)
        },
        nextDate.getTime() - (new Date()).getTime()
      );
    }

    return (
      <div
        className = "zipLine"
        style = {{"width": `${Math.round(fill * 100)}%`}}
      >
      </div>
    );
  }
