import * as React from "react";
import { useStaticQuery, graphql, Link, GatsbyLinkProps } from "gatsby";
import { unstable_useId } from "reakit/utils/useId";
import {
  useTooltipState,
  Tooltip,
  TooltipReference,
  TooltipArrow
} from "reakit";
import kebabCase from "lodash/kebabCase";
import { css } from "emotion";
import TestTube from "../icons/TestTube";

const className = css`
  ul {
    padding: 0;
    margin: 0;
  }
  li {
    list-style: none;
  }
  a {
    display: flex;
    align-items: center;
    padding: 0.5em 0 0.5em 2em;
    text-decoration: none;
    color: black;
    border-left: 5px solid transparent;
    cursor: pointer;

    &:hover {
      color: #6b46c1;
    }

    &[aria-current="page"] {
      background-color: #e9d8fd;
      border-left-color: #9f7aea;
    }

    svg {
      margin-left: 0.25em;
    }
  }
`;

type Data = {
  allDocsYaml: {
    nodes: Array<{
      section: string;
      paths: string[];
    }>;
  };
  allMarkdownRemark: {
    nodes: Array<{
      title: string;
      frontmatter: {
        path: string;
        experimental?: boolean;
      };
    }>;
  };
};

function ExperimentalLink(props: GatsbyLinkProps<{}>) {
  const tooltip = useTooltipState({ placement: "right" });
  return (
    <>
      <TooltipReference as={Link} {...props} {...tooltip}>
        {props.children}
        <TestTube role="presentation" />
      </TooltipReference>
      <Tooltip {...tooltip}>
        <TooltipArrow {...tooltip} /> Experimental
      </Tooltip>
    </>
  );
}

function DocsNavigation() {
  const baseId = unstable_useId("docs-navigation-");
  const { allDocsYaml, allMarkdownRemark } = useStaticQuery<Data>(graphql`
    query {
      allDocsYaml {
        nodes {
          section
          paths
        }
      }
      allMarkdownRemark {
        nodes {
          title
          frontmatter {
            path
            experimental
          }
        }
      }
    }
  `);

  const getId = (section: string) => `${baseId}-${kebabCase(section)}`;
  const findMeta = (path: string) =>
    allMarkdownRemark.nodes.find(node => node.frontmatter.path === path)!;
  const getTitle = (path: string) => findMeta(path).title;
  const getIsExperimental = (path: string) =>
    Boolean(findMeta(path).frontmatter.experimental);

  return (
    <div className={className}>
      {allDocsYaml.nodes.map(node => (
        <nav key={node.section} aria-labelledby={getId(node.section)}>
          <h3 id={getId(node.section)}>{node.section}</h3>
          <ul>
            {node.paths.map(path => (
              <li key={path}>
                {getIsExperimental(path) ? (
                  <ExperimentalLink to={path}>
                    {getTitle(path)}
                  </ExperimentalLink>
                ) : (
                  <Link to={path}>{getTitle(path)}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
  );
}

export default DocsNavigation;
