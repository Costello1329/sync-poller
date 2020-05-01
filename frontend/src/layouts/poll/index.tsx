import React from "react";
import {Header} from "../../components/bars/header";
import {Footer} from "../../components/bars/footer";
import {Question} from "../../components/poll/question";
import {
  PollStatus,
  PollServiceEvent,
  PollDescriptor,
  pollService
} from "../../services/poll";
import {
  LogoutServiceEvent,
  logoutService
} from "../../services/logout";
import {
  gotPollEventGuid,
  gotPollFailedEventGuid,
  logoutEventGuid
} from "../../static/Constants";

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

    pollService.subscribe(this);
    logoutService.subscribe(this, 0);
  }

  readonly gotEvent = (
    event: PollServiceEvent | LogoutServiceEvent
  ): void => {
    /// Poll service:
    if (event instanceof PollServiceEvent) {
      if (event.eventGuid === gotPollEventGuid)
        this.setState({
          gotPoll: true,
          poll: event.data
        });

      else if (event.eventGuid === gotPollFailedEventGuid)
        this.setState({
          gotPoll: true,
          poll: undefined
        })
    }

    /// Logout service:
    else if (event instanceof LogoutServiceEvent)
      if (event.eventGuid === logoutEventGuid) {
        // TODO: Don't forget to send data before logout.
      }

    else {
      /// TODO: unknown event error ?
    }
  }

  private getQuestion (): JSX.Element {
    if (this.state.poll === undefined)
      return <></>; // TODO: Error while getting poll here.
    
    if (this.state.poll.status === PollStatus.Before)
      return <></>; /// TODO: before poll

    else if (this.state.poll.status === PollStatus.After)
      return <></>; /// TODO: after poll

    else if (this.state.poll.status === PollStatus.Open)
      return <Question {...this.state.poll.currentQuestion}/>;

    else
      return <></>;
  }

  componentDidMount (): void {
    pollService.getPoll();
  }

  componentWillUnmount (): void {
    pollService.unsubscribe(this);
    logoutService.unsubscribe(this);
  }

  render (): JSX.Element {
    const question: JSX.Element =
      this.state.gotPoll ?
      this.getQuestion() :
      <></>; // #TODO: loading screen here.

    return (
      <div className = {"pollLayoutWrapper"}>
        <Header/>
        <main>
          {question}
        </main>
        <Footer/>
      </div>
    );
  }
}
