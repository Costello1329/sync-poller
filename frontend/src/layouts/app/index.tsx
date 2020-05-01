import React from "react";
import {AuthorizationLayout} from "../authorization";
import {
  User,
  UnauthorizedUser,
  AuthorizedUser,
  StudentUser,
  UserServiceEvent,
  userService,
} from "../../services/user";
import {
  AuthorizationServiceEvent,
  authorizationService
} from "../../services/authorization";
import {
  LogoutServiceEvent,
  logoutService
} from "../../services/logout";
import {
  gotUserEventGuid,
  authorizedEventGuid,
  logoutEventGuid
} from "../../static/Constants";
import {PollLayout} from "../poll";

import "./styles.scss";



export interface AppProps {};

interface AppState {
  user: User;
  gotUser: boolean;
}

export class App extends React.Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props);

    this.state = {
      user: new UnauthorizedUser(),
      gotUser: false
    };

    userService.subscribe(this);
    authorizationService.subscribe(this);
    logoutService.subscribe(this, 1);
  }

  readonly gotEvent = (
    event: UserServiceEvent | AuthorizationServiceEvent | LogoutServiceEvent
  ): void => {
    /// User service:
    if (event instanceof UserServiceEvent) {
      if (event.eventGuid == gotUserEventGuid) {
        this.setState({user: event.data, gotUser: true});
      }
    }

    /// Authorization service:
    else if (event instanceof AuthorizationServiceEvent) {
      if (event.eventGuid === authorizedEventGuid)
        if (event.data === true)
          userService.getUser();
    }

    /// Logout service:
    else if (event instanceof LogoutServiceEvent) {
      if (event.eventGuid == logoutEventGuid)
        this.setState({user: new UnauthorizedUser(), gotUser: true});
    }

    else {
      /// TODO: unknown event error ?
    }
  }

  componentDidMount (): void {
    userService.getUser();
  }

  componentWillUnmount (): void {
    userService.unsubscribe(this);
    authorizationService.unsubscribe(this);
    logoutService.unsubscribe(this);
  }

  render (): JSX.Element {
    if (!this.state.gotUser) {
      // TODO: loading screen:
      return <></>;
    }

    if (this.state.user instanceof UnauthorizedUser)
      return <AuthorizationLayout/>;
    
    else if (this.state.user instanceof AuthorizedUser) {
      if (this.state.user instanceof StudentUser)
        return <PollLayout/>;

      else
        return <></>; // TODO: Forbidden screen
    }

    else
      return <></>; // TODO: Forbidden screen
  }
}
