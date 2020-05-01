import {Guid} from "../../utils/Guid";
import {logoutEventGuid} from "../../static/Constants";
import {
  Event,
  EventSubscriber,
  EventSender
} from "../../utils/ServiceSubscriptionModel";
import {
  HttpQuery,
  HttpMethod,
  HttpConnection
} from "../../utils/HttpConnection";
import * as preferences from "../../static/Preferences";
import {JsonSchemaValidator} from "../../utils/JsonSchemaValidator";
import Cookies from 'js-cookie'
import { storageService } from "../storage";



/**
 * Service subscription model implementation:
 */

export class LogoutServiceEvent extends Event<null> {
  constructor (guid: Guid) {
    super(null, guid);
  }
};


/**
 * HttpClient request-response JSON protocols:
 */

interface LogoutRequest {
  session: string, /// Guid string
  poll: string /// Guid string
}

interface LogoutResponse {}

class LogoutService extends EventSender<null, LogoutServiceEvent> {
  constructor () {
    super();
  }

  logout (): void {
    const connection: HttpConnection<LogoutRequest, LogoutResponse> =
      new HttpConnection<LogoutRequest, LogoutResponse>(preferences.apiUrl);

    connection.setRequestValidator(
      new JsonSchemaValidator<LogoutRequest>(
        require("./requestSchema.json")
      )
    );

    connection.setResponseValidator(
      new JsonSchemaValidator<LogoutResponse>(
        require("./responseSchema.json")
      )
    );

    const session: Guid | null = storageService.getSession();
    const poll: Guid | null = storageService.getPoll();

    if (session === null || poll === null)
      return;

    const request: HttpQuery<LogoutRequest> =  {
      headers: {},
      data: {
        session: session.guid,
        poll: poll.guid
      }
    };

    connection
      .send(preferences.apiEndpoints.logout, HttpMethod.post, request)
      .then(
        (response: HttpQuery<LogoutResponse>): void => {
          storageService.deleteSession();
          this.sendEvent(new LogoutServiceEvent(logoutEventGuid));
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


export const logoutService = new LogoutService();
