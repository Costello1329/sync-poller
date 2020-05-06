import {Guid} from "../../utils/Guid";
import {notificationsShowEventGuid} from "../../static/Constants";
import {
  Event,
  EventSender
} from "../../utils/ServiceSubscriptionModel";
import {NotificationProps} from "../../components/notifications/notification";



/**
 * Service subscription model implementation:
 */

export class NotificationServiceEvent extends Event<NotificationProps> {
  constructor (notification: NotificationProps, guid: Guid) {
    super(notification, guid);
  }
};


class NotificationService
extends EventSender<NotificationProps, NotificationServiceEvent> {
  constructor () {
    super();
  }

  notify (notification: NotificationProps): void {
    this.sendEvent(
      new NotificationServiceEvent(notification, notificationsShowEventGuid)
    );
  }
}


export const notificationService = new NotificationService();
