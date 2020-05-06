import {
  NotificationProps,
  NotificationType
} from "../../components/notifications/notification";
import {localization} from "../../static/Localization";


export const contractValidationError = (): NotificationProps => {
  return {
    title: localization.contractValidationErrorTitle(),
    message: localization.contractValidationErrorMessage(),
    type: NotificationType.Error
  };
}

export const authorizationError = (): NotificationProps => {
  return {
    title: localization.authorizationErrorTitle(),
    message: localization.authorizationErrorMessage(),
    type: NotificationType.Error
  };
}

export const logoutError = (): NotificationProps => {
  return {
    title: localization.authorizationErrorTitle(),
    message: localization.authorizationErrorMessage(),
    type: NotificationType.Error
  };
}

export const answerSuccess = (): NotificationProps => {
  return {
    title: localization.answerSuccessTitle(),
    message: localization.answerSuccessMessage(),
    type: NotificationType.Success
  };
}

export const sessionNotFoundError = (): NotificationProps => {
  return {
    title: localization.sessionErrorTitle(),
    message: localization.sessionNotFoundErrorMessage(),
    type: NotificationType.Error
  };
}

export const sessionStoringError = (): NotificationProps => {
  return {
    title: localization.sessionErrorTitle(),
    message: localization.sessionStoringErrorMessage(),
    type: NotificationType.Error
  };
}

export const pollNotFoundError = (): NotificationProps => {
  return {
    title: localization.pollErrorTitle(),
    message: localization.pollNotFoundErrorMessage(),
    type: NotificationType.Error
  };
}

export const pollStoringError = (): NotificationProps => {
  return {
    title: localization.pollErrorTitle(),
    message: localization.pollStoringErrorMessage(),
    type: NotificationType.Error
  };
}
