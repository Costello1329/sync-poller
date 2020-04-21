import React from "react";
import {Button, ButtonType} from "../../userInterface/button";
import {logoutService} from "../../../services/logout";
import {localization} from "../../../static/Localization";

import "./styles.scss";



export interface HeaderProps {};

export function Header (props: HeaderProps) {
  return (
    <header className = "headerBar">
      <div className = "headerTitle">
        <h1>
          {localization.mainTitle()}
        </h1>
      </div>
      <div className = "headerLogout">
        <Button
          type = {ButtonType.GrayMedium}
          text = {localization.exit()}
          handler = {(): void => logoutService.logout()}
        />
      </div>
    </header>
  );
}
