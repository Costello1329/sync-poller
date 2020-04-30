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
  /// TODO: Solve the problem with double-subscribing.
  declare private subscribers: Set<Subscriber<Data, ReceivedEvent>>;

  constructor () {
    this.subscribers = new Set<Subscriber<Data, ReceivedEvent>>();
  }

  subscribe (eventRecepient: Subscriber<Data, ReceivedEvent>): void {
    this.subscribers.add(eventRecepient);
  }

  protected sendEvent (event: ReceivedEvent): void {
    this.subscribers.forEach((subscriber: Subscriber<Data, ReceivedEvent>) => {
      subscriber(event);
    });
  }
}
