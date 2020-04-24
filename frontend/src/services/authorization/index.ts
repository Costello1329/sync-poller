import {Guid} from "../../utils/Guid";
import {authorizedEventGuid} from "../../static/Constants";
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



/**
 * Service subscription model implementation:
 */

export class AuthorizationServiceEvent extends Event<boolean> {
  constructor (authorized: boolean, guid: Guid) {
    super(authorized, guid);
  }
};

export class AuthorizationServiceEventRecipient
extends EventRecepient<boolean, AuthorizationServiceEvent> {
  constructor (callback: Subscriber<boolean, AuthorizationServiceEvent>) {
    super(authorizationService, callback);
  }
}


/**
 * HttpClient request-response JSON protocols:
 */

interface AuthorizationRequest {
  user: string, /// Guid string
  poll: string /// Guid string
}

interface AuthorizationResponseHaveAuthorized {
  haveAuthorized: true
  session: string /// Guid string
}

interface AuthorizationResponseHaveNotAuthorized {
  haveAuthorized: false
}

type AuthorizationResponse =
  AuthorizationResponseHaveAuthorized | AuthorizationResponseHaveNotAuthorized;

export class AuthorizationService
extends EventSender<boolean, AuthorizationServiceEvent> {
  constructor () {
    super();
  }

  authorize (user: Guid): void {
    const connection: HttpConnection<AuthorizationRequest, AuthorizationResponse> =
      new HttpConnection<AuthorizationRequest, AuthorizationResponse>(
        preferences.apiUrl
      );

    connection.setRequestValidator(
      new JsonSchemaValidator<AuthorizationRequest>(
        require("./requestSchema.json")
      )
    );

    connection.setResponseValidator(
      new JsonSchemaValidator<AuthorizationResponse>(
        require("./responseSchema.json")
      )
    );

    const poll: Guid | null = storageService.getPoll();

    if (poll === null)
      return;

    const request: HttpQuery<AuthorizationRequest> =  {
      headers: {},
      data: {
        user: user.guid,
        poll: poll.guid
      }
    };

    connection
      .send(preferences.apiEndpoints.authorization, HttpMethod.post, request)
      .then(
        (response: HttpQuery<AuthorizationResponse>): void => {
          if (response.data.haveAuthorized === true)
            storageService.setSession(new Guid(response.data.session));

          this.sendEvent(
            new AuthorizationServiceEvent(
              response.data.haveAuthorized,
              authorizedEventGuid
            )
          );
        },
        (error: Error): void => {
          this.sendEvent(
            new AuthorizationServiceEvent(
              false,
              authorizedEventGuid
            )
          );
          /// TODO: Show error here
        }
      ).catch(
        (error: Error): void => {
          this.sendEvent(
            new AuthorizationServiceEvent(
              false,
              authorizedEventGuid
            )
          );
          /// TODO: Show error here
        }
      );
  }
}


export const authorizationService = new AuthorizationService();
