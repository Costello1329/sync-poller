import React from "react";
import classNames from "classnames";

import "./styles.scss";



type ButtonHandler = () => void;

export enum ButtonColor {
  Red, Gray, Transparent
}

export enum ButtonSize {
  Small, Medium, Large, ExtraLarge
}

export interface ButtonType {
  color: ButtonColor;
  size: ButtonSize;
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

    switch (this.props.type.color) {
      case ButtonColor.Red:
        classes.push("commonButtonRed");
        break;
      case ButtonColor.Gray:
        classes.push("commonButtonGray");
        break;
      case ButtonColor.Transparent:
        classes.push("commonButtonTransparent");
        break;
    }

    switch (this.props.type.size) {
      case ButtonSize.Small:
        classes.push("commonButtonSmall");
        break;
      case ButtonSize.Medium:
        classes.push("commonButtonMedium");
        break;
      case ButtonSize.Large:
        classes.push("commonButtonLarge");
        break;
      case ButtonSize.ExtraLarge:
        classes.push("commonButtonExtraLarge");
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
