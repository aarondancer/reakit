import * as React from "react";
import { Provider } from "reakit";
import * as bootstrapSystem from "reakit-system-bootstrap";
import * as playgroundSystem from "reakit-playground/system";

Provider.unstable_use(bootstrapSystem, playgroundSystem);

function CoreLayout(props: { children: React.ReactNode }) {
  return <Provider>{props.children}</Provider>;
}

export default CoreLayout;
