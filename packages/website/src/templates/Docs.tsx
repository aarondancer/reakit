import * as React from "react";
import { injectGlobal, css } from "emotion";
import { graphql, Link } from "gatsby";
import RehypeReact from "rehype-react";
import {
  PlaygroundPreview,
  PlaygroundEditor,
  usePlaygroundState
} from "reakit-playground";
import createUseContext from "constate";
import { FaUniversalAccess } from "react-icons/fa";
import FiraCodeBold from "../fonts/FiraCode-Bold.woff";
import FiraCodeLight from "../fonts/FiraCode-Light.woff";
import FiraCodeMedium from "../fonts/FiraCode-Medium.woff";
import FiraCodeRegular from "../fonts/FiraCode-Regular.woff";
import CarbonAd from "../components/CarbonAd";
import DocsInnerNavigation from "../components/DocsInnerNavigation";

injectGlobal`
  body {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI",
      "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
  }
  code {
    font-family: "Fira Code", monospace;
    background-color: #eee;
    padding: 0.15em 0.3em;
  }
  a {
    color: blue;
  }
  @font-face {
    font-family: "Fira Code";
    src: url(${FiraCodeLight});
    font-weight: 300;
    font-style: normal;
  }
  @font-face {
    font-family: "Fira Code";
    src: url(${FiraCodeRegular});
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: "Fira Code";
    src: url(${FiraCodeMedium});
    font-weight: 500;
    font-style: normal;
  }
  @font-face {
    font-family: "Fira Code";
    src: url(${FiraCodeBold});
    font-weight: 700;
    font-style: normal;
  }
  .CodeMirror {
    font-family: "Fira Code", monospace !important;
    font-size: 15px !important;
  }
`;

type DocsProps = {
  pageContext: {
    sourceUrl: string;
    readmeUrl: string;
    tableOfContentsAst: object;
  };
  data: {
    markdownRemark: {
      title: string;
      htmlAst: object;
      frontmatter: {
        path: string;
        experimental: boolean;
      };
    };
  };
};

function getChildrenCode(props: { children?: React.ReactNode }) {
  const children = React.Children.toArray(props.children);
  const [first] = children;
  if (typeof first === "object" && first !== null && "type" in first) {
    return first.type === "code" ? first : null;
  }
  return null;
}

const { Compiler: renderAst } = new RehypeReact({
  createElement: React.createElement,
  components: {
    "carbon-ad": CarbonAd,
    a: ({ href, ...props }: React.AnchorHTMLAttributes<any>) => {
      if (href && /^\/(?!\/)/.test(href)) {
        return <Link to={href} {...props} />;
      }
      return (
        <a href={href} {...props}>
          {props.children}
        </a>
      );
    },
    p: props => {
      const p = css`
        line-height: 1.5;
      `;
      return <p className={p} {...props} />;
    },
    ul: props => {
      const ul = css`
        line-height: 1.5;
        li {
          margin-bottom: 0.5em;
        }
      `;
      return <ul className={ul} {...props} />;
    },
    kbd: props => {
      const kbd = css`
        border-radius: 0.25em;
        font-family: "Fira Code", monospace;
        background-color: #f5f5f5;
        padding: 0.3em 0.5em 0.25em;
        border: 1px solid #e0e0e0;
        border-width: 1px 1px 2px 1px;
        font-size: 0.875em;
      `;
      return <kbd className={kbd} {...props} />;
    },
    blockquote: props => {
      const blockquote = css`
        background-color: rgb(255, 248, 216);
        border-left-color: rgb(255, 229, 102);
        border-left-width: 8px;
        border-left-style: solid;
        padding: 20px 16px 20px 25px;
        margin: 20px 0;
      `;
      return <blockquote className={blockquote} {...props} />;
    },
    pre: (props: React.HTMLAttributes<any>) => {
      const codeElement = getChildrenCode(props);
      if (codeElement) {
        const { static: isStatic, maxHeight, className } = codeElement.props;
        let [, mode] = className.match(/language-(.+)/) || ([] as any[]);

        const modeMap = {
          html: "htmlmixed",
          js: "javascript"
        };

        if (mode in modeMap) {
          mode = modeMap[mode as keyof typeof modeMap];
        }

        const isDynamic =
          !isStatic && ["js", "jsx", "ts", "tsx"].indexOf(mode) !== -1;
        const [code] = codeElement.props.children;
        const state = usePlaygroundState({ code });

        React.useEffect(() => {
          state.update(code);
        }, [code]);

        if (isDynamic) {
          return (
            <div>
              <PlaygroundPreview
                modules={{
                  constate: createUseContext,
                  "./UniversalAccess": FaUniversalAccess
                }}
                {...state}
              />
              <PlaygroundEditor mode={mode} maxHeight={maxHeight} {...state} />
            </div>
          );
        }

        return (
          <PlaygroundEditor
            readOnly="nocursor"
            mode={mode}
            maxHeight={maxHeight}
            {...state}
            {...props}
          />
        );
      }
      return <pre {...props} />;
    }
  }
});

export default function Docs({ data, pageContext }: DocsProps) {
  const {
    markdownRemark: { title, htmlAst }
  } = data;
  return (
    <>
      <div style={{ marginLeft: 260, marginRight: 240 }}>
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 0,
            width: 210,
            background: "white"
          }}
        >
          <DocsInnerNavigation
            {...pageContext}
            title={title}
            tableOfContentsAst={pageContext.tableOfContentsAst}
          />
        </div>
        <h1>{title}</h1>
        {renderAst(htmlAst)}
      </div>
    </>
  );
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      title
      htmlAst
      frontmatter {
        path
      }
    }
  }
`;
