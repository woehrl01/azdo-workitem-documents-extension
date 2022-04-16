import "azure-devops-ui/Core/override.css";
import "es6-promise/auto";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./Common.scss";

export type NoProps = Record<string, never>;

export function showRootComponent(component: React.ReactElement<unknown>): void {
    ReactDOM.render(component, document.getElementById("root"));
}