import {Guid, getRandomGuid} from "../../utils/Guid";
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
import {apiEndpoints, apiUrl} from "../../static/Preferences";
import {JsonSchemaValidator} from "../../utils/JsonSchemaValidator";
import Cookies from 'js-cookie'



enum PollStatus {
  Before = "before",
  Open = "open",
  After = "after"
}

export class PollDescriptor {
  constructor (readonly status: PollStatus) {

  }
}


/**
 * Service subscription model implementation:
 */

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
  session: string /// Guid string
}

interface PollResponseBefore {
  status: PollStatus.Before,
  time: number /// time in ticks
}

interface PollResponseOpen {
  status: PollStatus.Open
  /// TODO: poll descriptor here.
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
      new HttpConnection<PollRequest, PollResponse>(apiUrl);

    connection.setRequestValidator(
      new JsonSchemaValidator<PollRequest>(require("./requestSchema.json"))
    );

    connection.setResponseValidator(
      new JsonSchemaValidator<PollResponse>(require("./responseSchema.json"))
    );

    const session: string | undefined = Cookies.get('session');

    if (session === undefined) {
      /// TODO: send message about bad cookie:
      return;
    }

    const request: HttpQuery<PollRequest> =  {
      headers: {},
      data: {
        session: session
      }
    };

    connection
      .send(apiEndpoints.poll, HttpMethod.post, request)
      .then(
        (response: HttpQuery<PollResponse>): void => {
          let poll: PollDescriptor = new PollDescriptor(response.data.status);

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
