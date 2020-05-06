import {Guid} from "../../utils/Guid";
import Cookies from "js-cookie";
import * as Preferences from "../../static/Preferences";
import {notificationService} from "../notification";
import * as commonNotifications from "../notification/CommonNotifications";



class StorageService {
  sessionExists (): boolean {
    return Cookies.get(Preferences.sessionCookie.key) !== undefined;
  }

  getSession (): Guid | null {
    const session: string | undefined = Cookies.get(Preferences.sessionCookie.key);

    if (session === undefined) {
      notificationService.notify(commonNotifications.sessionNotFoundError());
      return null;
    }

    try {
      return new Guid(session);
    } catch (error) {
      notificationService.notify(commonNotifications.sessionStoringError());
      Cookies.remove(Preferences.sessionCookie.key);
      return null;
    }
  }

  setSession (session: Guid): void {
    Cookies.set(
      Preferences.sessionCookie.key,
      session.guid,
      {
        expires: Preferences.sessionCookie.expirationTime
      }
    );
  }

  deleteSession (): void {
    if (Cookies.get(Preferences.sessionCookie.key) !== undefined)
      Cookies.remove(Preferences.sessionCookie.key);
  }

  getPoll (): Guid | null {
    const poll: string | null =
      new URLSearchParams(window.location.search)
      .get(Preferences.pollParameter.key);

    if (poll === null) {
      notificationService.notify(commonNotifications.pollNotFoundError());
      return null;
    }

    try {
      return new Guid(poll);
    } catch (error) {
      notificationService.notify(commonNotifications.pollStoringError());
      return null;
    }
  }
}


export const storageService: StorageService = new StorageService();
