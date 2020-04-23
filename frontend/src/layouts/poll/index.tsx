import React from "react";
import {Header} from "../../components/bars/header";
import {Footer} from "../../components/bars/footer";

import "./styles.scss";



export interface PollLayoutProps {}

interface PollLayoutState {}

export class PollLayout extends React.Component<PollLayoutProps, PollLayoutState> {
  constructor (props: PollLayoutProps) {
    super(props);

    this.state = {};
  }

  render = (): JSX.Element => {
    return (
      <div className = {"pollLayoutWrapper"}>
        <Header/>
        <main>
          <></>
        </main>
        <Footer/>
      </div>
    );
  }
}
