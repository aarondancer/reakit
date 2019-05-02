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

export default function Docs({ data, pageContext, location }: DocsProps) {
  const {
    markdownRemark: { title, htmlAst, tableOfContents }
  } = data;
  return (
    <>
      <div style={{ marginLeft: 260 }}>
        <DocsInnerNavigation
          {...pageContext}
          pathname={location.pathname}
          title={title}
          tableOfContents={tableOfContents}
        />
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
      tableOfContents(pathToSlugField: "frontmatter.path")
      frontmatter {
        path
      }
    }
  }
`;
