import React from "react";
import {Header} from "../../components/bars/header";
import {Footer} from "../../components/bars/footer";



export interface PollLayoutProps {}

interface PollLayoutState {}

export class PollLayout extends React.Component<PollLayoutProps, PollLayoutState> {
  constructor (props: PollLayoutProps) {
    super(props);

    this.state = {};
  }

  render = (): JSX.Element => {
    return (
      <React.Fragment>
        <Header/>

        <Footer/>
      </React.Fragment>
    );
  }
}
