import React from "react";
import {
  ValidationError,
  Validator
} from "../../../utils/validation/Validator";
import classNames from "classnames";

import "./styles.scss";



export type InputHandler =
  (newValue: string, newValidationErrors: ValidationError[]) => void;

export enum InputType {
  text = "text",
  password = "password"
}

export interface InputProps {
  type: InputType;
  label: string;
  value?: string;
  placeholder?: string;
  handler?: InputHandler;
  validator?: Validator;
}

export interface InputState {
  value: string;
  validationErrors: ValidationError[];
}

export class Input extends React.Component<InputProps, InputState> {
  constructor (props: InputProps) {
    super(props);

    let initialValue: string = "";
    let initialValidationErrors: ValidationError[] = [];

    if (this.props.value !== undefined) {
      initialValue = this.props.value;

      if (this.props.validator !== undefined)
        initialValidationErrors = this.props.validator.validate(initialValue);

      if (this.props.handler !== undefined)
        this.props.handler(initialValue, initialValidationErrors);
    }

    this.state = {
      value: initialValue,
      validationErrors: initialValidationErrors
    };
  }

  private readonly handleValueChange =
    (event: React.FormEvent<HTMLInputElement>): void => {
      this.setState({
        value: event.currentTarget.value,
        validationErrors: this.validate(event.currentTarget.value)
      });
    }

  private readonly validate =
    (value: string): ValidationError[] => {
      return (
        this.props.validator === undefined ?
        [] :
        this.props.validator.validate(value)
      );
    }

  private readonly getErrorClassName = (): string => {
    if (this.state.validationErrors.length !== 0)
      return classNames("commonInputHasError");
    
    else
      return classNames("");
  }

  componentDidUpdate = (prevProps: InputProps): void => {
    if (prevProps !== this.props && this.props.value !== undefined) {
      this.setState({
        value: this.props.value,
        validationErrors: this.validate(this.props.value)
      });
    }
    
    else
      if (this.props.handler !== undefined)
        this.props.handler(this.state.value, this.state.validationErrors);
  }

  private readonly getValidationErrorText = (): JSX.Element => {
    if (
      this.props.validator === undefined ||
      this.state.validationErrors[0] === undefined
    ) {
      return <></>;
    }

    return (
      <span className = "commonInputErrorLabel">
        {
          this.props.validator.localize(
            this.props.validator.prioritize(
              this.state.validationErrors
            )
          )
        }
      </span>
    );
  }

  render = (): JSX.Element => {
    return (
      <div className = "commonInput">
        <span className = "commonInputLabel">
          {this.props.label}
        </span>
        <label>
          <input
            className = {this.getErrorClassName()}
            type = {this.props.type}
            placeholder = {this.props.placeholder}
            value = {this.state.value}
            onChange = {this.handleValueChange}
          />
        </label>
        {this.getValidationErrorText()}
      </div>
    );
  }
}
