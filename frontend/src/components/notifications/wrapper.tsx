import React from "react";
import {Notifications} from "./notifications";


export function notificationsWrapper (
  _: Object,
  __: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  descriptor.value = function (): JSX.Element {
    return (
      <React.Fragment>
        {original.call(this)}
        <Notifications/>
      </React.Fragment>
    )
  }
}