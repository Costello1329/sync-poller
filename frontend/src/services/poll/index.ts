import {Guid} from "../../utils/Guid";
import {gotPollEventGuid, gotPollFailedEventGuid} from "../../static/Constants";
import {
  Event,
  EventSender
} from "../../utils/ServiceSubscriptionModel";
import {
  HttpQuery,
  HttpMethod,
  HttpConnection
} from "../../utils/HttpConnection";
import * as preferences from "../../static/Preferences";
import {JsonSchemaValidator} from "../../utils/JsonSchemaValidator";
import {storageService} from "../storage";
import {notificationService} from "../notification";
import * as commonNotifications from "../notification/CommonNotifications";
import { logoutService } from "../logout";



export enum PollStatus {
  Before = "before",
  Open = "open",
  After = "after"
}

export interface PollQuestion {
  startTime: number; /// time in ticks, when question should close.
  endTime: number; /// time in ticks, when question should close.
  title: string;
  guid: string; /// Guid string
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

export type PollSolution =
  PollSolutionCheckbox | PollSolutionRadio | PollSolutionTextfield;

export interface PollSolutionCheckbox {
  type: "checkbox";
  data: boolean[];
}

export interface PollSolutionRadio {
  type: "radio";
  data: number | null;
}

export interface PollSolutionTextfield {
  type: "textfield";
  data: string;
}


/**
 * Service subscription model implementation:
 */

export type PollDescriptor = PollResponse | undefined;

export class PollServiceEvent extends Event<PollDescriptor> {
  constructor (poll: PollDescriptor, guid: Guid) {
    super(poll, guid);
  }
};


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
  question: PollQuestion
}

interface PollResponseAfter {
  status: PollStatus.After
}

type PollResponse = PollResponseBefore | PollResponseOpen | PollResponseAfter;
export type PollClosed = PollResponseBefore | PollResponseAfter;

interface AnswerRequest {
  session: string, /// Guid string
  poll: string, /// Guid string
  answer: {
    guid: string /// Guid string,
    data: PollSolution
  }
}

interface AnswerResponse {}

export class PollService extends EventSender<PollDescriptor, PollServiceEvent> {
  constructor () {
    super();
  }

  sendAnswer (answerGuid: Guid, answerData: PollSolution): void {
    const connection: HttpConnection<AnswerRequest, AnswerResponse> =
      new HttpConnection<AnswerRequest, AnswerResponse>(preferences.apiUrl);

    connection.setRequestValidator(
      new JsonSchemaValidator<AnswerRequest>(
        require("./answerSchema/requestSchema.json")
      )
    );

    connection.setResponseValidator(
      new JsonSchemaValidator<AnswerResponse>(
        require("./answerSchema/responseSchema.json")
      )
    );

    const session: Guid | null = storageService.getSession();
    const poll: Guid | null = storageService.getPoll();

    if (session === null || poll === null)
      return;

    const request: HttpQuery<AnswerRequest> =  {
      headers: {},
      data: {
        session: session.guid,
        poll: poll.guid,
        answer: {
          guid: answerGuid.guid,
          data: answerData
        }
      }
    };

    connection
      .send(preferences.apiEndpoints.answer, HttpMethod.post, request)
      .then(
        (response: HttpQuery<AnswerResponse>): void => {
          /**
           * In the future, here we can receive the message, which
           * will contain answer check data. We could create a special
           * event and send it to the PollLayout. When this event will
           * be received by PollLayout, it will render the result of
           * the check. This approach will require creating new service.
           */
          notificationService.notify(commonNotifications.answerSuccess());
        },
        (error: Error): void => {
          throw(error)
        }
      ).catch(
        (error: Error): void => {

        }
      );
  }

  getPoll (): void {
    const connection: HttpConnection<PollRequest, PollResponse> =
      new HttpConnection<PollRequest, PollResponse>(preferences.apiUrl);

    connection.setRequestValidator(
      new JsonSchemaValidator<PollRequest>(
        require("./pollSchema/requestSchema.json")
      )
    );

    connection.setResponseValidator(
      new JsonSchemaValidator<PollResponse>(
        require("./pollSchema/responseSchema.json")
      )
    );

    const session: Guid | null = storageService.getSession();
    const poll: Guid | null = storageService.getPoll();

    if (session === null || poll === null)
      return;

    const request: HttpQuery<PollRequest> =  {
      headers: {},
      data: {
        session: session.guid,
        poll: poll.guid
      }
    };

    connection
      .send(preferences.apiEndpoints.poll, HttpMethod.post, request)
      .then(
        (response: HttpQuery<PollResponse>): void => {
          const poll: PollDescriptor = response.data;
          const currentTime: number = (new Date()).getTime();
          
          switch (poll.status) {
            case PollStatus.Before:
              poll.startTime += currentTime;
              break;
            case PollStatus.Open:
              poll.question.startTime += currentTime;
              poll.question.endTime += currentTime;
              break;
            case PollStatus.After:
              break;
          }
          
          this.sendEvent(new PollServiceEvent(poll, gotPollEventGuid));
        },
        (error: Error): void => {
          throw(error);
        }
      ).catch(
        (error: Error): void => {
          this.sendEvent(new PollServiceEvent(undefined, gotPollFailedEventGuid));
        }
      );
  }
}


export const pollService = new PollService();
