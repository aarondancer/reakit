import * as React from "react";
import { injectGlobal, css } from "emotion";
import { usePalette, useFade } from "reakit-system-palette/utils";
import { Link } from "gatsby";
import { FaFacebook, FaTwitter, FaGithub } from "react-icons/fa";
import { VisuallyHidden } from "reakit";
import useViewportWidthGreaterThan from "../hooks/useViewportWidthGreaterThan";
import DocsNavigation from "./DocsNavigation";
import DocsInnerNavigation from "./DocsInnerNavigation";
import Anchor from "./Anchor";
import Paragraph from "./Paragraph";
import SkipToContent from "./SkipToContent";

const year = new Date().getFullYear();

type CoreLayoutProps = {
  children: React.ReactNode;
  pageContext: {
    sourceUrl?: string;
    readmeUrl?: string;
    tableOfContentsAst?: object;
  };
  data?: {
    markdownRemark?: {
      title?: string;
      htmlAst?: object;
      frontmatter?: {
        path?: string;
        experimental?: boolean;
      };
    };
  };
};

injectGlobal`
  html, body {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI",
      "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
    margin: 0;
    padding: 0;
  }
`;

function useCodeCSS() {
  const foreground = usePalette("foreground");
  const backgroundColor = useFade(foreground, 0.95);
  const code = css`
    font-family: Consolas, Liberation Mono, Menlo, Courier, monospace;
    background-color: ${backgroundColor};
    border-radius: 3px;
    font-size: 0.875em;
    padding: 0.2em 0.4em;
  `;

  return code;
}

export default function CoreLayout(props: CoreLayoutProps) {
  const isMedium = useViewportWidthGreaterThan(780);
  const isLarge = useViewportWidthGreaterThan(1024);
  const title =
    props.data && props.data.markdownRemark && props.data.markdownRemark.title;
  const code = useCodeCSS();
  const main = css`
    code {
      ${code}
    }
    margin: 72px 232px 200px 262px;
    padding: 8px;
    box-sizing: border-box;

    @media (max-width: 1024px) {
      margin-right: 0;
    }
    @media (max-width: 780px) {
      margin-left: 0;
    }
    @media (min-width: 1440px) {
      max-width: 946px;
      margin-right: auto;
      margin-left: auto;
    }
  `;
  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 901,
          height: 60,
          boxSizing: "border-box",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
          background: "white"
        }}
      >
        <SkipToContent />
        <Anchor as={Link} to="/">
          Reakit
        </Anchor>
        <Anchor as={Link} to="/docs/">
          Documentation
        </Anchor>
        <Anchor href="https://github.com/reakit/reakit">GitHub</Anchor>
      </header>
      {title && isMedium && (
        <div
          style={{
            position: "fixed",
            background: "white",
            width: 240,
            zIndex: 900,
            top: 60,
            left: 0,
            overflow: "auto",
            height: "calc(100vh - 60px)",
            padding: 16,
            paddingBottom: 100,
            boxSizing: "border-box"
          }}
        >
          <DocsNavigation />
        </div>
      )}
      <main id="main" className={main}>
        {props.children}
      </main>
      {title && props.pageContext.tableOfContentsAst && isLarge && (
        <aside
          style={{
            position: "fixed",
            top: 60,
            right: 0,
            width: 210,
            background: "white",
            padding: "72px 16px",
            boxSizing: "border-box",
            overflow: "auto",
            height: "calc(100vh - 60px)"
          }}
        >
          <DocsInnerNavigation
            sourceUrl={props.pageContext.sourceUrl!}
            readmeUrl={props.pageContext.readmeUrl!}
            tableOfContentsAst={props.pageContext.tableOfContentsAst}
            title={title}
          />
        </aside>
      )}
      <footer style={{ marginLeft: 300 }}>
        <Anchor href="https://facebook.com/reakitjs" target="_blank">
          <FaFacebook />
          <VisuallyHidden>Facebook</VisuallyHidden>
        </Anchor>
        <Anchor href="https://twitter.com/reakitjs" target="_blank">
          <FaTwitter />
          <VisuallyHidden>Twitter</VisuallyHidden>
        </Anchor>
        <Anchor href="https://github.com/reakit/reakit" target="_blank">
          <FaGithub />
          <VisuallyHidden>GitHub</VisuallyHidden>
        </Anchor>
        <Paragraph>
          Released under the{" "}
          <Anchor href="https://opensource.org/licenses/MIT" target="_blank">
            MIT License
          </Anchor>
        </Paragraph>
        <Paragraph>
          Copyright © 2017-
          {year} Diego Haz
        </Paragraph>
      </footer>
    </>
  );
}
