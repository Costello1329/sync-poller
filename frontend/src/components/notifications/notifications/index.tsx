import React from "react";
import {Notification, NotificationProps} from "../notification";
import {
  NotificationServiceEvent,
  notificationService
} from "../../../services/notification";
import {notificationsShowEventGuid} from "../../../static/Constants";

import "./styles.scss";



export enum NotificationType {
  Success,
  Message,
  Warning,
  Error
}

interface NotificationsProps {}

interface NotificationsState {
  notification: NotificationProps | null
}

export class Notifications
extends React.Component<NotificationsProps, NotificationsState> {
  declare private showing: boolean;
  declare private readonly queue: Array<NotificationProps>;
  private readonly notificationShowingTime: number = 3000;

  constructor (props: NotificationsProps) {
    super(props);

    this.showing = false;
    this.queue = [];

    this.state = {
      notification: null
    }

    notificationService.subscribe(this);
  }

  gotEvent = (event: NotificationServiceEvent): void => {
    if (event.eventGuid === notificationsShowEventGuid) {
      this.queue.push(event.data);
      this.tryShow();
    }
  }

  private tryShow (): void {
    if (this.showing === true)
      return;

    const notification: NotificationProps | undefined = this.queue.shift();

    if (notification === undefined)
      return;

    this.showing = true;
    this.setState(
      {notification: notification},
      (): void => {
        setTimeout((): void => this.hide(), this.notificationShowingTime)
      }
    );
  }

  private hide (): void {
    if (this.showing === false)
      return;

    this.showing = false;

    this.setState(
      {notification: null},
      (): void => this.tryShow()
    );
  }

  shouldComponentUpdate (
    _: NotificationsProps,
    nextState: NotificationsState
  ): boolean {
    return this.state !== nextState;
  }

  render (): JSX.Element {
    if (this.state.notification === null)
      return <></>;

    else
      return (
        <div className = "Notifications">
          <Notification {...this.state.notification}/>
        </div>
      );
  }
}
