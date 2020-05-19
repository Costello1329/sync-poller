import React, {useState, Dispatch, SetStateAction, Fragment} from "react";
import {PollClosed, PollStatus} from "../../../services/poll";
import {localization} from "../../../static/Localization";
import {logoutService} from "../../../services/logout";
import {
  Button,
  ButtonType,
  ButtonColor,
  ButtonSize
} from "../../userInterface/button";

import "./styles.scss";



export const Message: React.FunctionComponent<PollClosed> =
  (props: PollClosed): JSX.Element => {
    const [time, setTime]: [number, Dispatch<SetStateAction<number>>] =
      useState(Math.floor((new Date()).getTime() / 1000) * 1000);

    const nextDate: Date = new Date();
    nextDate.setTime(nextDate.getTime() + 1000);
    nextDate.setMilliseconds(0);

    if (props.status === PollStatus.Before)
      setTimeout(
        (): void => setTime(nextDate.getTime()),
        nextDate.getTime() - (new Date()).getTime()
      );

    const getDiffString = (diff: number): JSX.Element => {
      const s: number = Math.floor((diff)) % 60;
      const m: number = Math.floor((diff / 60)) % 60;
      const h: number = Math.floor((diff / 60 / 60));

      return (
        <Fragment>
          <span>{h}</span>
          {localization.h() + " "}
          <span>{m}</span>
          {localization.m() + " "}
          <span>{s}</span>
          {localization.s()}
        </Fragment>
      );
    }

    return (
      <div className = "pollMessage">
        {(
            (): JSX.Element => {
              switch(props.status) {
                case PollStatus.Before:
                  return (
                   <Fragment>
                      <h1>{localization.pollHasntStartedYet()}</h1>
                      <div className = "pollMessageBody">
                        <h2>
                          {localization.pollWillStartIn() + " "}
                          {getDiffString((props.startTime - time) / 1000)}
                        </h2>
                        <div className = "buttonContainer">
                          <Button
                            type = {
                              {
                                size: ButtonSize.Large,
                                color: ButtonColor.Transparent
                              } as ButtonType
                            }
                            text = {localization.exit()}
                            handler = {(): void => logoutService.logout()}
                          />
                        </div>
                      </div>
                    </Fragment>
                  );
                case PollStatus.After:
                  return (
                    <Fragment>
                      <h1>{localization.pollAlreadyClosed()}</h1>
                      <div className = "pollMessageBody">
                        <h2>{localization.marksWillBeRevealedSoon()}</h2>
                        <div className = "buttonContainer">
                          <Button
                            type = {
                              {
                                size: ButtonSize.Large,
                                color: ButtonColor.Transparent
                              } as ButtonType
                            }
                            text = {localization.exit()}
                            handler = {(): void => logoutService.logout()}
                          />
                        </div>
                      </div>
                    </Fragment>
                  );
              }
            }
        )()}
      </div>
    );
  }
