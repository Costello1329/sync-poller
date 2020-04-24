import React from "react";
import {AuthorizationLayout} from "../authorization";
import {
  User,
  UnauthorizedUser,
  AuthorizedUser,
  StudentUser,
  UserServiceEvent,
  UserServiceEventRecipient,
  userService,
} from "../../services/user";
import {
  AuthorizationServiceEvent,
  AuthorizationServiceEventRecipient,
  authorizationService
} from "../../services/authorization";
import {
  LogoutServiceEvent,
  LogoutServiceEventRecipient,
  LogoutService
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

    new UserServiceEventRecipient(this.gotEvent);
    new AuthorizationServiceEventRecipient(this.gotEvent);
    new LogoutServiceEventRecipient(this.gotEvent);
  }

  private readonly gotEvent = (
    event: UserServiceEvent | AuthorizationServiceEvent | LogoutServiceEvent
  ): void => {
    /// User service event:
    if (event instanceof UserServiceEvent) {
      if (event.eventGuid == gotUserEventGuid)
        this.setState({user: event.data, gotUser: true});
    }

    /// Authorization service event:
    if (event instanceof AuthorizationServiceEvent) {
      if (event.eventGuid === authorizedEventGuid)
        if (event.data === true)
          userService.getUser();
    }

    /// Logout service event:
    if (event instanceof LogoutServiceEvent) {
      if (event.eventGuid == logoutEventGuid)
        this.setState({user: new UnauthorizedUser(), gotUser: true});
    }
  }

  componentDidMount () {
    this.setState({}, (): void => userService.getUser());
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
