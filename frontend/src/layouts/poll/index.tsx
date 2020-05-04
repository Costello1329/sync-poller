import React, {Fragment} from "react";
import {Header} from "../../components/bars/header";
import {Footer} from "../../components/bars/footer";
import {Question} from "../../components/poll/question";
import {Message} from "../../components/poll/message";
import {ZipLine} from "../../components/poll/zipLine";
import {
  PollStatus,
  PollServiceEvent,
  PollDescriptor,
  pollService,
  PollSolution
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
import {Guid} from "../../utils/Guid";

import "./styles.scss";



export interface PollLayoutProps {}

interface PollLayoutState {
  gotPoll: boolean;
  poll: PollDescriptor;
}

export class PollLayout extends React.Component<PollLayoutProps, PollLayoutState> {
  declare answers: undefined | PollSolution;

  constructor (props: PollLayoutProps) {
    super(props);

    this.answers = undefined;

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
      if (event.eventGuid === gotPollEventGuid) {
        this.setState(
          {
            gotPoll: true,
            poll: event.data as NonNullable<PollDescriptor>
          },
          (): void => {
            if (this.state.poll === undefined)
              return;

            let diff: number | undefined;

            switch (this.state.poll.status) {
              case PollStatus.Before:
                diff = this.state.poll.startTime - (new Date()).getTime();
                break;
              case PollStatus.Open:
                diff = this.state.poll.question.endTime - (new Date()).getTime();
                break;
              case PollStatus.After:
                diff = undefined;
                break;
            }

            if (diff !== undefined && diff >= 0 && diff <= 0x7FFFFFFF)
              setTimeout((): void => this.getNextQuestion(), diff);
          }
        );
      }

      else if (event.eventGuid === gotPollFailedEventGuid)
        this.setState({
          gotPoll: true,
          poll: undefined
        })
    }

    /// Logout service:
    else if (event instanceof LogoutServiceEvent) {
      if (event.eventGuid === logoutEventGuid) {
        this.trySendAnswers();
      }
    }

    else {
      /// TODO: unknown event error ?
    }
  }

  private getNextQuestion (): void {
    this.trySendAnswers();

    this.setState(
      {
        gotPoll: false,
        poll: undefined
      },
      (): void => pollService.getPoll()
    );
  }

  private setAnswers = (solution: PollSolution): void => {
    this.answers = solution;
  }

  private trySendAnswers (): void {
    if (
      this.answers !== undefined &&
      this.state.poll !== undefined &&
      this.state.poll.status === PollStatus.Open
    )
      pollService.sendAnswer(new Guid(this.state.poll.question.guid), this.answers);
  }

  componentDidMount (): void {
    pollService.getPoll();
  }

  componentWillUnmount (): void {
    pollService.unsubscribe(this);
    logoutService.unsubscribe(this);
  }

  private getQuestion (): JSX.Element {
    if (this.state.poll === undefined)
      return <></>; // TODO: Error while getting poll here.

    switch (this.state.poll.status) {
      case PollStatus.Before:
        if (this.state.poll.startTime < (new Date()).getTime())
          return <></>; // TODO: poll time error here.
        
        return <Message {...this.state.poll}/>;
      case PollStatus.Open:
        if (
          this.state.poll.question.startTime > (new Date()).getTime() ||
          this.state.poll.question.endTime < (new Date()).getTime()
        )
          return <></>; // TODO: poll time error here.

        return (
          <Fragment>
            <ZipLine
              startTime = {new Date(this.state.poll.question.startTime)}
              endTime = {new Date(this.state.poll.question.endTime)}
            />
            <Question
              pollQuestion = {this.state.poll.question}
              setAnswers = {this.setAnswers}
            />
          </Fragment>
        );
      case PollStatus.After:
        return <Message {...this.state.poll}/>;
    }
  }

  render (): JSX.Element {
    console.log("HUI");
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
