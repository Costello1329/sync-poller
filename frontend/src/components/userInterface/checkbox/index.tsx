import React from "react";
import classNames from "classnames";

import "./styles.scss";



type CheckboxHandler = () => void;

export interface CheckboxProps {
  label: string;
  checked: boolean;
}

export class Checkbox extends React.Component<CheckboxProps> {
  constructor (props: CheckboxProps) {
    super(props);
  }

  render (): JSX.Element {
    return (
      <label>
        {this.props.label}
        <input type = "checkbox"/>
        <span></span>
      </label>
    );
  }
}
