import React from "react";
import {Header} from "../../components/bars/header";
import {Footer} from "../../components/bars/footer";
import {Question} from "../../components/poll/question";
import {
  PollStatus,
  PollServiceEventRecipient,
  PollServiceEvent,
  pollService,
  PollDescriptor
} from "../../services/poll";
import {
  LogoutServiceEvent,
  LogoutServiceEventRecipient
} from "../../services/logout";
import {gotPollEventGuid, logoutEventGuid} from "../../static/Constants";

import "./styles.scss";



export interface PollLayoutProps {}

interface PollLayoutState {
  gotPoll: boolean;
  poll: undefined | PollDescriptor;
}

export class PollLayout extends React.Component<PollLayoutProps, PollLayoutState> {
  constructor (props: PollLayoutProps) {
    super(props);

    this.state = {
      gotPoll: false,
      poll: undefined
    };

    new PollServiceEventRecipient(this.gotEvent);
    new LogoutServiceEventRecipient(this.gotEvent);
  }

  private readonly gotEvent = (
    event: PollServiceEvent | LogoutServiceEvent
  ): void => {
    /// Poll service:
    if (event instanceof PollServiceEvent) {
      if (event.eventGuid === gotPollEventGuid)
        this.setState({
          gotPoll: true,
          poll: event.data
        });
    }

    /// Logout service:
    if (event instanceof LogoutServiceEvent)
      if (event.eventGuid === logoutEventGuid) {
        alert("HI");
        // TODO: Don't forget to sae data before logout.
      }
  }

  componentDidMount () {
    pollService.getPoll();
  }

  render (): JSX.Element {
    const questionBlock: JSX.Element =
      this.state.gotPoll ?
      <Question/> :
      <></>; // #TODO: loading screen here.

    return (
      <div className = {"pollLayoutWrapper"}>
        <Header/>
        <main>
          {questionBlock}
        </main>
        <Footer/>
      </div>
    );
  }
}
