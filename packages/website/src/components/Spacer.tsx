import * as React from "react";
import { css } from "emotion";

type Props = {
  p?: number | string;
  px?: number | string;
  py?: number | string;
  m?: number | string;
  mx?: number | string;
  my?: number | string;
};

export default function Spacer(props: Props) {
  const spacer = css(
    props.p && { padding: props.p },
    props.px && { paddingLeft: props.px, paddingRight: props.px },
    props.py && { paddingTop: props.py, paddingBottom: props.py },
    props.m && { margin: props.m },
    props.mx && { marginLeft: props.mx, marginRight: props.mx },
    props.my && { marginTop: props.my, marginBottom: props.my }
  );
  return <div className={spacer} />;
}
