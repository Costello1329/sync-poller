import React from "react";
import {Guid, getRandomGuid} from "../../../utils/Guid";

import "./styles.scss";



type RadioHandler = () => void;

export interface RadioProps {
  label: string;
  checked: boolean;
  groupName: string;
  radioName: string;
  handler?: RadioHandler
}

export class Radio extends React.Component<RadioProps> {

  constructor (props: RadioProps) {
    super(props);
  }

  private readonly handleChange =
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (this.props.handler !== undefined)
        this.props.handler()
    }

  render (): JSX.Element {
    return (
      <div className = "commonRadio">
        <label>
          {this.props.label}
          <input
            type = "radio"
            value = {this.props.radioName}
            onChange = {this.handleChange}
            name = {this.props.groupName}
          />
          <span></span>
        </label>
      </div>
    );
  }
}
