import {Guid} from "./Guid";



export abstract class Event<Data> {
  constructor (readonly data: Data, readonly eventGuid: Guid) {}
}

export abstract class EventSubscriber<Data, ReceivedEvent extends Event<Data>> {
  abstract gotEvent: GotEventCallback<Data, ReceivedEvent>;
}


export abstract class EventRecepient<Data, ReceivedEvent extends Event<Data>> {
  constructor (
    eventSender: EventSender<Data, ReceivedEvent>,
    subscriber: EventSubscriber<Data, ReceivedEvent>
  ) {
    eventSender.subscribe(subscriber.constructor.name, subscriber.gotEvent);
  }
}


type GotEventCallback<Data, ReceivedEvent extends Event<Data>> =
  (event: ReceivedEvent) => void;

export abstract class EventSender<Data, ReceivedEvent extends Event<Data>> {
  declare private subscribers: Map<string, GotEventCallback<Data, ReceivedEvent>>;

  constructor () {
    this.subscribers = new Map<string, GotEventCallback<Data, ReceivedEvent>>();
  }

  subscribe (
    name: string,
    gotEventCallback: GotEventCallback<Data, ReceivedEvent>,
    override: boolean = false
  ): void {
    if (!override)
      for (let [subscriberName, _] of this.subscribers)
        if (subscriberName === name)
          return;
  
    this.subscribers.set(name, gotEventCallback);
  }

  protected sendEvent (event: ReceivedEvent): void {
    for (let [_, gotEventCallback] of this.subscribers)
      gotEventCallback(event);
  }
}
