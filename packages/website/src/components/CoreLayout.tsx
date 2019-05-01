import * as React from "react";
import DocsNavigation from "./DocsNavigation";

function CoreLayout(props: { children: React.ReactNode }) {
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
      <main>{props.children}</main>
    </>
  );
}

export default CoreLayout;
