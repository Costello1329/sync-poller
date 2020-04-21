import {Guid} from "../../utils/Guid";
import {logoutEventGuid} from "../../static/Constants";
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



/**
 * Service subscription model implementation:
 */

export class LogoutServiceEvent extends Event<void> {
  constructor (guid: Guid) {
    super(undefined, guid);
  }
};

export class LogoutServiceEventRecipient
extends EventRecepient<void, LogoutServiceEvent> {
  constructor (callback: Subscriber<void, LogoutServiceEvent>) {
    super(logoutService, callback);
  }
}


/**
 * HttpClient request-response JSON protocols:
 */

interface LogoutRequest {
  session: string /// Guid string
}

interface LogoutResponse {}

export class LogoutService
extends EventSender<void, LogoutServiceEvent> {
  constructor () {
    super();
  }

  logout (): void {
    const connection: HttpConnection<LogoutRequest, LogoutResponse> =
      new HttpConnection<LogoutRequest, LogoutResponse>(apiUrl);

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

    const session: string | undefined = Cookies.get('session');

    if (session === undefined) {
      /// TODO: send message about bad cookie:
      return;
    }

    const request: HttpQuery<LogoutRequest> =  {
      headers: {},
      data: {
        session: session
      }
    };

    connection
      .send(apiEndpoints.user, HttpMethod.get, request)
      .then(
        (response: HttpQuery<LogoutResponse>): void => {
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
