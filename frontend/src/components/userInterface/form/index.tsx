import React from "react";
import {Guid, getRandomGuid} from "../../../utils/Guid";
import {Input, InputHandler, InputProps} from "../input";
import {Button, ButtonProps} from "../button";
import {
  ValidationError
} from "../../../utils/validation/Validator";

import "./styles.scss";



export type FormHandler = (values: string[]) => void;

export interface FormProps {
  header: string;
  controls: InputProps[];
  submitButton: ButtonProps;
  footer?: {
    text?: string,
    button?: ButtonProps
  };
  submitHandler?: FormHandler;
}

interface FormState {
  values: string[];
  validationPassed: boolean[];
  commonFormControlGuids: Guid[];
  showAllValidationErrors: boolean;
}

/**
 * Warning: This is a static-props component, that was'nt properly designed
 * to handle props change. Please, don't change props of this
 * component's instances. Use keys instead.
 */

export class Form extends React.Component<FormProps, FormState> {
  constructor (props: FormProps) {
    super(props);

    this.state = {
      values: props.controls.map((): string => ""),
      validationPassed: props.controls.map((): boolean => false),
      commonFormControlGuids: props.controls.map((): Guid => getRandomGuid()),
      showAllValidationErrors: false
    };
  }

  private readonly getControls = (): JSX.Element[] => {
    return (
      this.props.controls.map(
        (inputProps: InputProps, index: number): JSX.Element => {
          const newInputHandler: InputHandler =
            (value: string, errors: ValidationError[]) => {
              const values: string[] = this.state.values;
              const validationPassed: boolean[] = this.state.validationPassed;
              values[index] = value;
              validationPassed[index] = (errors.length === 0);

              if (inputProps.handler !== undefined)
                inputProps.handler(value, errors);

              this.setState({
                values: values,
                validationPassed: validationPassed
              });
            };

          const newInputProps: InputProps = Object.assign({}, inputProps);
          newInputProps.handler = newInputHandler;

          if (this.state.showAllValidationErrors)
            newInputProps.value = this.state.values[index];

          return (
            <div
              key = {
                "common-form-control-" +
                this.state.commonFormControlGuids[index].guid
              }
              className = "commonFormControl"
            >
              <Input {...newInputProps} />
            </div>
          );
        }
      )
    );
  }

  private readonly handleSubmit =
    (event: React.FormEvent<HTMLFormElement>): void => {
      if (this.state.validationPassed.indexOf(false) === -1) {
        if (this.props.submitHandler !== undefined)
          this.props.submitHandler(this.state.values);
      }

      else if (!this.state.showAllValidationErrors)
        this.setState({showAllValidationErrors: true});

      event.preventDefault();
    }

  shouldComponentUpdate = (_: FormProps, nextState: FormState): boolean => {
    return !this.state.showAllValidationErrors && nextState.showAllValidationErrors;
  }

  render = (): JSX.Element => {
    return (
      <div className = "commonForm">
        <div className = "commonFormHeader">
          <h1>
            {this.props.header}
          </h1>
        </div>
        <form
          onSubmit = {this.handleSubmit}
          className = "commonFormBody"
        >
          {this.getControls()}
          <Button {...this.props.submitButton}/>
        </form>
      </div>
    );
  }
}
