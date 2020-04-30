import {Guid} from "../../utils/Guid";
import {gotPollEventGuid} from "../../static/Constants";
import {
  Event,
  Subscriber,
  EventRecepient,
  EventSender
} from "../../utils/ServiceSubscriptionModel";
import {
  HttpQuery,
  HttpMethod,
  HttpConnection
} from "../../utils/HttpConnection";
import * as preferences from "../../static/Preferences";
import {JsonSchemaValidator} from "../../utils/JsonSchemaValidator";
import { storageService } from "../storage";



export enum PollStatus {
  Before = "before",
  Open = "open",
  After = "after"
}

export interface PollQuestion {
  endTime: number; /// time in ticks, when question should end.
  title: string;
  id: number;
  problem: {
    type: "text" | "code";
    text: string;
  }[],
  solution: {
    type: "selectOne" | "selectMultiple",
    labels: string[]
  } | {
    type: "textField"
  }
}


/**
 * Service subscription model implementation:
 */

export type PollDescriptor = PollResponse;

export class PollServiceEvent extends Event<PollDescriptor> {
  constructor (poll: PollDescriptor, guid: Guid) {
    super(poll, guid);
  }
};

export class PollServiceEventRecipient
extends EventRecepient<PollDescriptor, PollServiceEvent> {
  constructor (callback: Subscriber<PollDescriptor, PollServiceEvent>) {
    super(pollService, callback);
  }
}


/**
 * HttpClient request-response JSON protocols:
 */

interface PollRequest {
  session: string, /// Guid string
  poll: string /// Guid string
}

interface PollResponseBefore {
  status: PollStatus.Before,
  startTime: number /// time in ticks, when poll will start
}

interface PollResponseOpen {
  status: PollStatus.Open,
  currentQuestion: PollQuestion
}

interface PollResponseAfter {
  status: PollStatus.After
}

type PollResponse = PollResponseBefore | PollResponseOpen | PollResponseAfter;

export class PollService extends EventSender<PollDescriptor, PollServiceEvent> {
  constructor () {
    super();
  }

  getPoll (): void {
    const connection: HttpConnection<PollRequest, PollResponse> =
      new HttpConnection<PollRequest, PollResponse>(preferences.apiUrl);

    connection.setRequestValidator(
      new JsonSchemaValidator<PollRequest>(require("./requestSchema.json"))
    );

    connection.setResponseValidator(
      new JsonSchemaValidator<PollResponse>(require("./responseSchema.json"))
    );

    const session: Guid | null = storageService.getSession();
    const poll: Guid | null = storageService.getPoll();

    if (session === null || poll === null)
      return;

    const request: HttpQuery<PollRequest> =  {
      headers: {},
      data: {
        session: session.guid,
        poll: session.guid
      }
    };

    connection
      .send(preferences.apiEndpoints.poll, HttpMethod.post, request)
      .then(
        (response: HttpQuery<PollResponse>): void => {
          const poll: PollDescriptor = response.data;
          this.sendEvent(new PollServiceEvent(poll, gotPollEventGuid));
        },
        (error: Error): void => {
          /// TODO: Show error here
        }
      ).catch(
        (error: Error): void => {
          /// TODO: Show error here
        }
      );
  }
}


export const pollService = new PollService();
