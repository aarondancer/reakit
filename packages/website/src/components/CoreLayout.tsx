import * as React from "react";
import { Provider, unstable_mergeSystem } from "reakit";
import * as bootstrapSystem from "reakit-system-bootstrap";
import * as playgroundSystem from "reakit-playground/system";

const system = unstable_mergeSystem(bootstrapSystem, playgroundSystem, {
  palette: {
    ...bootstrapSystem.palette,
    primary: "#805AD5"
  }
});

function CoreLayout(props: { children: React.ReactNode }) {
  return <Provider unstable_system={system}>{props.children}</Provider>;
}

export default CoreLayout;
