import * as React from "react";
import { injectGlobal } from "emotion";
import { graphql, Link } from "gatsby";
import RehypeReact from "rehype-react";
import {
  PlaygroundPreview,
  PlaygroundEditor,
  usePlaygroundState
} from "reakit-playground";
import createUseContext from "constate";
import kebabCase from "lodash/kebabCase";
import { FaUniversalAccess } from "react-icons/fa";
import { VisuallyHidden, Button } from "reakit";
import CoreLayout from "../components/CoreLayout";
import FiraCodeBold from "../fonts/FiraCode-Bold.woff";
import FiraCodeLight from "../fonts/FiraCode-Light.woff";
import FiraCodeMedium from "../fonts/FiraCode-Medium.woff";
import FiraCodeRegular from "../fonts/FiraCode-Regular.woff";
import DocsNavigation from "../components/DocsNavigation";

injectGlobal`
  body {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI",
      "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol";
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
  #carbonads {
    display: block;
    overflow: hidden;
    padding: 1em;
    max-width: 360px;
  }

  #carbonads a {
    text-decoration: none;
  }

  #carbonads span {
    position: relative;
    display: block;
    overflow: hidden;
  }

  .carbon-img {
    float: left;
    margin-right: 1em;
  }

  .carbon-img img {
    display: block;
  }

  .carbon-text {
    display: block;
    float: left;
    line-height: 1.4;
    max-width: calc(100% - 130px - 1em);
    text-align: left;
  }

  .carbon-poweredby {
    position: absolute;
    left: calc(130px + 1rem);
    bottom: 0;
    display: block;
    font-size: 10px;
    text-transform: uppercase;
    line-height: 1;
    letter-spacing: 1px;
  }
`;

type DocsProps = {
  location: {
    pathname: string;
  };
  pageContext: {
    sourceUrl: string;
    readmeUrl: string;
  };
  data: {
    markdownRemark: {
      title: string;
      htmlAst: object;
      tableOfContents: string;
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

// function getText(props: { children?: React.ReactNode }): string {
//   const children = React.Children.toArray(props.children);
//   return children.reduce<string>((acc, curr) => {
//     if (typeof curr === "string") {
//       return `${acc}${curr}`;
//     }
//     if (typeof curr === "object" && curr !== null && "props" in curr) {
//       return `${acc}${getText(curr.props)}`;
//     }
//     return acc;
//   }, "");
// }

const { Compiler: renderAst } = new RehypeReact({
  createElement: React.createElement,
  components: {
    a: ({ href, ...props }: React.AnchorHTMLAttributes<any>) => {
      if (href && !/^(http|www|\/\/|#)/.test(href)) {
        return <Link to={href} {...props} />;
      }
      return (
        <a href={href} {...props}>
          {props.children}
        </a>
      );
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

function loadScript(src, position) {
  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.src = src;
  position.appendChild(script);

  return script;
}

class AdCarbon extends React.Component {
  componentDidMount() {
    const scriptSlot = document.querySelector("#carbon-ad");

    // Concurrence issues
    if (!scriptSlot) {
      return;
    }

    const script = loadScript(
      "https://cdn.carbonads.com/carbon.js?serve=CK7DV27N&placement=reakitio",
      scriptSlot
    );
    script.id = "_carbonads_js";
  }

  render() {
    return <span id="carbon-ad" />;
  }
}

function Comp({ data, location, pageContext }: DocsProps) {
  const {
    markdownRemark: { title, htmlAst, tableOfContents }
  } = data;
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
      <div style={{ marginLeft: 260 }}>
        <AdCarbon />
        {/* <div
          dangerouslySetInnerHTML={{
            __html: `<script
          async
          type="text/javascript"
          src="https://cdn.carbonads.com/carbon.js?serve=CK7DV27N&placement=reakitio"
          id="_carbonads_js"
        />`
          }}
        /> */}

        <VisuallyHidden id={`${kebabCase(title)}-subnav`}>
          {title} sections
        </VisuallyHidden>
        <Button as="a" href={pageContext.sourceUrl}>
          View source on GitHub
        </Button>
        <Button as="a" href={pageContext.readmeUrl}>
          Edit this page
        </Button>
        <nav
          aria-labelledby={`${kebabCase(title)}-subnav`}
          dangerouslySetInnerHTML={{
            __html: tableOfContents
              .replace(/(<\/?p>)/gim, "")
              .replace(new RegExp(`${location.pathname}/?`, "gim"), "")
          }}
        />
        <h1>{title}</h1>
        {renderAst(htmlAst)}
      </div>
    </>
  );
}

export default function Docs(props: DocsProps) {
  return (
    <CoreLayout>
      <Comp {...props} />
    </CoreLayout>
  );
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      title
      htmlAst
      tableOfContents(pathToSlugField: "frontmatter.path")
      frontmatter {
        path
      }
    }
  }
`;
