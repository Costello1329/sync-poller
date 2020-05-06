import React, {CSSProperties} from "react";
import {notificationsParameters} from "../../../static/Preferences";

import "./styles.scss";



export enum NotificationType {
  Success,
  Message,
  Warning,
  Error
}

export interface NotificationProps {
  title: string,
  message: string,
  type: NotificationType
}

interface NotificationState {
  animationParameter: boolean
  readonly constructTime: Date
}

export class Notification
extends React.Component<NotificationProps, NotificationState> {
  private readonly kNotificationShowingTime: number = 3000;
  private readonly kNotificationTransitionTime: number = 300;
  private readonly kNotificationBeginShowDelay: number = 50;
  private readonly kAnimationPropertiesHiden: CSSProperties = {opacity: 0};
  private readonly kAnimationPropertiesShown: CSSProperties = {opacity: 1};

  constructor (props: NotificationProps) {
    super(props);
    
    this.state = {
      animationParameter: true,
      constructTime: new Date()
    }
  }

  animate (): void {
    this.setState({animationParameter: false});
    setTimeout(
      (): void => {
        this.setState({animationParameter: true});
      },
      this.state.constructTime.getTime() -
      (new Date).getTime() +
      this.kNotificationShowingTime -
      this.kNotificationTransitionTime -
      this.kNotificationBeginShowDelay
    );
  }

  componentDidMount (): void {
    setTimeout((): void => this.animate(), this.kNotificationBeginShowDelay);
  }

  render (): JSX.Element {
    return (
      <div
        className =
          {`Notification Notification${NotificationType[this.props.type]}`}
        style = {
          Object.assign(
            {transition: `opacity linear ${this.kNotificationTransitionTime}ms`},
            this.state.animationParameter ?
            this.kAnimationPropertiesHiden :
            this.kAnimationPropertiesShown
          ) as CSSProperties
        }
      >
        <h3>
          {
            this.props.title
              .substr(0, notificationsParameters.kMaxNotificationTitleLength) +
            (
              (this.props.title.length >
                notificationsParameters.kMaxNotificationTitleLength) ?
              "..." :
              ""
            )
          }
        </h3>
        <hr/>
        <p>
          {
            this.props.message
              .substr(0, notificationsParameters.kMaxNotificationMessageLength) +
            (
              (this.props.message.length >
                notificationsParameters.kMaxNotificationMessageLength) ?
              "..." :
              ""
            )
          }
        </p>
      </div>
    );
  }
}
