import React from "react";
import {FormProps, Form} from "../../userInterface/form";
import {InputType} from "../../userInterface/input";
import {ButtonType, ButtonSize, ButtonColor} from "../../userInterface/button";
import {localization} from "../../../static/Localization";
import {getRandomGuid, Guid} from "../../../utils/Guid";
import {authorizationService} from "../../../services/authorization";
import {tokenValidator} from "./Validators";

import "./styles.scss";



export interface AuthorizationFormProps {}

interface AuthorizationFormState {}

export class AuthorizationForm extends
React.Component<AuthorizationFormProps, AuthorizationFormState> {
  constructor (props: AuthorizationFormProps) {
    super(props);
    this.state = {};
  }

  private getEnterAuthorizationDataForm (): FormProps {
    return {
      header: localization.authorizationHeader(),
      controls: [
        {
          type: InputType.text,
          label: localization.token(),
          placeholder: getRandomGuid().guid,
          validator: tokenValidator
        }
      ],
      submitButton: {
        type: {
          size: ButtonSize.Large,
          color: ButtonColor.Transparent
        } as ButtonType,
        text: localization.submitAuthorization()
      },
      submitHandler: (values: string[]) => {
        const [user] = values;

        authorizationService.authorize(new Guid(user));
      }
    };
  }

  render (): JSX.Element {
    return (
      <div className = "authorizationForm">
        <Form {...this.getEnterAuthorizationDataForm()}/>
      </div>
    );
  }
}
 




