import React from "react";
import {
  AuthorizationForm
} from "../../components/forms/authorizationForm";

import "./styles.scss";



export interface AuthorizationLayoutProps {}

export interface AuthorizationLayoutState {}

export class AuthorizationLayout
extends React.Component<AuthorizationLayoutProps, AuthorizationLayoutState> {
  constructor (props: AuthorizationLayoutProps) {
    super(props);

    this.state = {};
  }

  render = (): JSX.Element => {
    return <AuthorizationForm/>;
  }
}
