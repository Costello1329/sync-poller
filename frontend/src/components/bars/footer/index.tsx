import React from "react";
import {localization} from "../../../static/Localization";

import "./styles.scss";



export interface FooterProps {}

export function Footer (props: FooterProps) {
  return (
    <footer className = "footerBar">
      <div className = "footerDevelopers">
        <h5>{localization.developers()}</h5>
      </div>
      <div className = "footerCopyright">
        <h5>{localization.copyright()}</h5>
      </div>
    </footer>
  );
}
