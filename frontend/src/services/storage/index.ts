import {Guid} from "../../utils/Guid";
import Cookies from "js-cookie";
import * as Preferences from "../../static/Preferences";



class StorageService {
  getSession (): Guid | null {
    const session: string | undefined  = Cookies.get(Preferences.sessionCookie.key);

    if (session === undefined) {
      /// TODO: show session storing key error.
      return null;
    }

    try {
      return new Guid(session);
    } catch (e) {
      /// TODO: show session storing value error.
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
    if (Cookies.get(Preferences.sessionCookie.key) === undefined) {
      /// TODO: show session storing key error.
    }

    else
      Cookies.remove(Preferences.sessionCookie.key);
  }

  getPoll (): Guid | null {
    const poll: string | null =
      new URLSearchParams(window.location.search)
      .get(Preferences.pollParameter.key);

    if (poll === null) {
      /// TODO: show poll storing key error.
      return null;
    }

    try {
      return new Guid(poll);
    } catch (e) {
      /// TODO: show poll storing value error.
      return null;
    }
  }
}


export const storageService: StorageService = new StorageService();
