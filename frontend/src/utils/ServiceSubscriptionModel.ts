import {Guid} from "./Guid";



export abstract class Event<Data> {
  constructor (readonly data: Data, readonly eventGuid: Guid) {}
}


export abstract class EventRecepient<Data, ReceivedEvent extends Event<Data>> {
  constructor (
    eventSender: EventSender<Data, ReceivedEvent>,
    readonly callback: Subscriber<Data, ReceivedEvent>
  ) {
    eventSender.subscribe(this.receiveEvent);
  }

  protected readonly receiveEvent = (event: ReceivedEvent): void => {
    this.callback(event);
  }
}


export type Subscriber<Data, ReceivedEvent extends Event<Data>> =
  (event: ReceivedEvent) => void;

export abstract class EventSender<Data, ReceivedEvent extends Event<Data>> {
  declare private subscribers: Subscriber<Data, ReceivedEvent>[];

  constructor () {
    this.subscribers = [];
  }

  subscribe (eventRecepient: Subscriber<Data, ReceivedEvent>): void {
    this.subscribers.push(eventRecepient);
  }

  protected sendEvent (event: ReceivedEvent): void {
    this.subscribers.forEach((subscriber: Subscriber<Data, ReceivedEvent>) => {
      subscriber(event);
    });
  }
}
