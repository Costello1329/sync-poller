class Localization {
  readonly authorizationHeader = (): string => "Authorization";
  readonly token = (): string => "Token";
  readonly emptyString = (): string => "Field is necessary";
  readonly notValidToken = (): string => "Token is not valid";
  readonly unforseenValidationError =
    (): string => "Unforseen validation error occured";
  readonly submitAuthorization =
    (): string => "Log in";
  readonly mainTitle = (): string => "Sync Poller";
  readonly exit = (): string => "exit";
  readonly developers = (): string => ["Konstantin Leladze"].join(", ");
  readonly copyright = (): string =>
    localization.mainTitle() + " © " + new Date().getFullYear();
  readonly solution = (): string => "Answer";
  readonly pollHasntStartedYet = (): string => "Poll hasn't started yet";
  readonly pollAlreadyClosed = (): string => "Poll has been already finished";
  readonly pollWillStartIn = (): string => "Poll will start in";
  readonly h = (): string => "h";
  readonly m = (): string => "m";
  readonly s = (): string => "s";
  readonly marksWillBeRevealedSoon =
    (): string => "Your marks will be revealed soon";
}

export const localization: Localization = new Localization();
