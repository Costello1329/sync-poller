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
}

export const localization: Localization = new Localization();
