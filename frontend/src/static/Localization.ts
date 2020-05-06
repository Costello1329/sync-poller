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
  readonly contractValidationErrorTitle =
    (): string => "Contract error";
  readonly contractValidationErrorMessage =
    (): string => "Respose or request hasn't passed the JSON schema validation.";
  readonly authorizationErrorTitle =
    (): string => "Authorization error";
  readonly authorizationErrorMessage =
    (): string => "You haven't been authorized. Check your token.";
  readonly logoutErrorTitle =
    (): string => "Logout error";
  readonly logoutErrorMessage =
    (): string => "You haven't been logged out.";
  readonly answerSuccessTitle =
    (): string => "Answer saved";
  readonly answerSuccessMessage =
    (): string => "Your answer was received by the server.";
  readonly sessionErrorTitle =
    (): string => "Session error";
  readonly sessionNotFoundErrorMessage =
    (): string => "Session cookie was not found.";
  readonly sessionStoringErrorMessage =
    (): string => "Session cookie was not found.";
  readonly pollErrorTitle =
    (): string => "Poll error";
  readonly pollNotFoundErrorMessage =
    (): string => "Poll guid hasn't found. Check the poll link URL.";
  readonly pollStoringErrorMessage =
    (): string => "Poll guid isn't valid. Check the poll link URL.";
}

export const localization: Localization = new Localization();
