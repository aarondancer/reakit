/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const { resolve, relative, dirname } = require("path");
const { repository } = require("./package.json");

exports.createPages = ({ actions, graphql }) => {
  const { createPage, createRedirect } = actions;
  const template = resolve(`src/templates/Docs.tsx`);

  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fileAbsolutePath
            frontmatter {
              path
              redirect_from
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    return result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const { frontmatter, fileAbsolutePath } = node;
      const { path, redirect_from } = frontmatter;

      const root = `${__dirname}/../..`;
      const repo = `${repository.replace(/(\/tree.+|\/)$/, "")}/tree/master/`;
      const sourceUrl = `${repo}${relative(root, dirname(fileAbsolutePath))}`;
      const readmeUrl = `${repo}${relative(root, fileAbsolutePath)}`;

      createPage({
        path,
        component: template,
        context: {
          sourceUrl,
          readmeUrl
        }
      });

      if (redirect_from) {
        const redirects = Array.isArray(redirect_from)
          ? redirect_from
          : [redirect_from];

        redirects.forEach(redirectPath => {
          createRedirect({
            fromPath: redirectPath,
            toPath: path,
            isPermanent: true,
            redirectInBrowser: true
          });
        });
      }
    });
  });
};
