import * as React from "react";
import { injectGlobal, css } from "emotion";
import { usePalette, useFade } from "reakit-system-palette/utils";
import DocsNavigation from "./DocsNavigation";

injectGlobal`
  body {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI",
      "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
  }
  
  .CodeMirror {
    font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;
    font-size: 15px !important;
  }
`;

function useCodeCSS() {
  const foreground = usePalette("foreground");
  const backgroundColor = useFade(foreground, 0.95);
  const code = css`
    font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;
    background-color: ${backgroundColor};
    color: ${foreground};
    border-radius: 3px;
    font-size: 0.875em;
    padding: 0.2em 0.4em;
  `;

  return code;
}

export default function CoreLayout(props: { children: React.ReactNode }) {
  const code = useCodeCSS();
  const main = css`
    code {
      ${code}
    }
  `;
  return (
    <>
      <div
        style={{
          position: "fixed",
          background: "white",
          width: 240,
          zIndex: 900,
          top: 0,
          left: 0,
          overflow: "auto",
          height: "100vh",
          padding: 16,
          paddingBottom: 100,
          boxSizing: "border-box"
        }}
      >
        <DocsNavigation />
      </div>
      <main className={main}>{props.children}</main>
    </>
  );
}
