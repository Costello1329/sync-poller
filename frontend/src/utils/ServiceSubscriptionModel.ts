import {Guid} from "./Guid";



export abstract class Event<Data> {
  constructor (readonly data: Data, readonly eventGuid: Guid) {}
}

export abstract class EventSubscriber<Data, ReceivedEvent extends Event<Data>> {
  abstract gotEvent: GotEventCallback<Data, ReceivedEvent>;
}


type GotEventCallback<Data, ReceivedEvent extends Event<Data>> =
  (event: ReceivedEvent) => void;

export abstract class EventSender<Data, ReceivedEvent extends Event<Data>> {
  declare private subscribers:
    Map<string, [GotEventCallback<Data, ReceivedEvent>, number]>;

  constructor () {
    this.subscribers =
      new Map<string, [GotEventCallback<Data, ReceivedEvent>, number]>();
  }

  subscribe (
    subscriber: EventSubscriber<Data, ReceivedEvent>,
    priority: number = 0,
    override: boolean = false
  ): void {
    if (!override)
      for (let [subscriberName, _] of this.subscribers)
        if (subscriberName === subscriber.constructor.name)
          return;
  
    this.subscribers.set(
      subscriber.constructor.name,
      [subscriber.gotEvent, priority]
    );
  }

  unsubscribe (
    subscriber: EventSubscriber<Data, ReceivedEvent>
  ): void {
    this.subscribers.delete(subscriber.constructor.name);
  }

  protected sendEvent (event: ReceivedEvent): void {
    const array: [GotEventCallback<Data, ReceivedEvent>, number][] =
      Array.from(this.subscribers.values());

    array
    .sort(
      (
        first: [GotEventCallback<Data, ReceivedEvent>, number],
        second: [GotEventCallback<Data, ReceivedEvent>, number]
      ): number => {
        return first[1] - second[1];
      }
    )
    .forEach(
      (element: [GotEventCallback<Data, ReceivedEvent>, number]): void => {
        element[0](event);
      }
    );
  }
}
