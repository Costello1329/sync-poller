import React from "react";
import classNames from "classnames";

import "./styles.scss";



type ButtonHandler = () => void;

export enum ButtonType {
  OrangeSmall,
  OrangeMedium,
  OrangeBig,
  GraySmall,
  GrayMedium,
  GrayBig,
  TransparentSmall,
  TransparentMedium,
  TransparentBig,
}

export interface ButtonProps {
  text: string,
  type: ButtonType,
  handler?: ButtonHandler
}

export class Button
extends React.Component<ButtonProps> {
  constructor (props: ButtonProps) {
    super(props);
  }

  private readonly getClasses = (): string => {
    let classes: string[] = ["commonButton"];

    switch (this.props.type) {
      case ButtonType.OrangeSmall:
        classes.push("commonButtonOrange");
        classes.push("commonButtonSmall");
        break;
      case ButtonType.OrangeMedium:
        classes.push("commonButtonOrange");
        classes.push("commonButtonMedium");
        break;
      case ButtonType.OrangeBig:
        classes.push("commonButtonOrange");
        classes.push("commonButtonBig");
        break;
      case ButtonType.GraySmall:
        classes.push("commonButtonGray");
        classes.push("commonButtonSmall");
        break;
      case ButtonType.GrayMedium:
        classes.push("commonButtonGray");
        classes.push("commonButtonMedium");
        break;
      case ButtonType.GrayBig:
        classes.push("commonButtonGray");
        classes.push("commonButtonBig");
        break;
      case ButtonType.TransparentSmall:
        classes.push("commonButtonTransparent");
        classes.push("commonButtonSmall");
        break;
      case ButtonType.TransparentMedium:
        classes.push("commonButtonTransparent");
        classes.push("commonButtonMedium");
        break;
      case ButtonType.TransparentBig:
        classes.push("commonButtonTransparent");
        classes.push("commonButtonBig");
        break;
    }

    return classNames(classes);
  }

  render (): JSX.Element {
    return (
      <button
        className = {this.getClasses()}
        onClick = {this.props.handler}
      >
        {this.props.text}
      </button>
    );
  }
}
