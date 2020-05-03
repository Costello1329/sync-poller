import React from "react";
import classNames from "classnames";

import "./styles.scss";



type CheckboxHandler = (_: boolean) => void;

export interface CheckboxProps {
  label: string;
  checked: boolean;
  handler?: CheckboxHandler
}

interface CheckboxState {
  checked: boolean;
}

export class Checkbox extends React.Component<CheckboxProps, CheckboxState> {
  constructor (props: CheckboxProps) {
    super(props);

    this.state = {
      checked: this.props.checked
    }
  }

  private readonly handleChange =
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const value: boolean = event.target.checked;

      this.setState(
        {
          checked: value
        },
        () => {
          if (this.props.handler !== undefined)
            this.props.handler(value)
        }
      );
    }

  render (): JSX.Element {
    return (
      <div className = "commonCheckbox">
        <label>
          {this.props.label}
          <input
            type = "checkbox"
            checked = {this.state.checked}
            onChange = {this.handleChange}
          />
          <span></span>
        </label>
      </div>
    );
  }
}
