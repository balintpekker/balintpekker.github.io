/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

const path = require(`path`)
const _ = require(`lodash`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const { graphql } = require(`gatsby`);

// Define the templates
const blogPostTemplate = path.resolve(`./src/templates/blog-post.js`)
const tagTemplate = path.resolve(`./src/templates/tags.js`)

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ graphql, actions, reporter, store }) => {
  const { createPage } = actions

  // Get all markdown blog posts sorted by date
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: ASC } }, limit: 1000) {
        nodes {
          id
          fields {
            slug
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: { frontmatter: { tags: SELECT }}) {
          fieldValue
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: blogPostTemplate,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }
  // Extract tag data from query
  const tags = result.data.tagsGroup.group

  if (tags.length > 0) {
    // Make tag pages
    tags.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
        component: tagTemplate,
        context: {
          tag: tag.fieldValue,
        },
      })
    })
  }

  const state = store.getState()

  const plugin = state.flattenedPlugins.find(plugin => plugin.name === "gatsby-plugin-feed")
  if (plugin) {
    // Add RSS feeds for tags.
    plugin.pluginOptions.feeds = [...plugin.pluginOptions.feeds, ...generateTagFeeds(tags)]
  }
}

function generateTagFeeds(tags) {
// Generate feeds for each tag
  return tags.map(tagObject => {
    const tag = tagObject.fieldValue;

    return {
      serialize: ({ query: { site, allMarkdownRemark } }) => {
        return allMarkdownRemark.edges
            .filter(e => e.node.frontmatter.tags.includes(tag))
            .map(e => {
              return {
                title: e.node.frontmatter.title,
                description: e.node.excerpt,
                date: e.node.frontmatter.date,
                url: site.siteMetadata.siteUrl + e.node.fields.slug,
                guid: site.siteMetadata.siteUrl + e.node.fields.slug,
                custom_elements: [
                  { "content:encoded": e.node.html },
                ],
              };
            });
      },
      query: `
        {
          allMarkdownRemark(
            sort: {frontmatter: {date: DESC}}
            filter: {frontmatter: {tags: {in: ["${tag}"]}}}
          ) {
            edges {
              node {
                excerpt
                html
                fields {
                  slug
                }
                frontmatter {
                  title
                  date
                  tags
                }
              }
            }
          }
        }
      `,
      output: `/${tag.toLowerCase()}.xml`,
      title: `${tag} related content | bPekker.dev`,
    };
  });
}


/**
 * @type {import('gatsby').GatsbyNode['onCreateNode']}
 */
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

/**
 * @type {import('gatsby').GatsbyNode['createSchemaCustomization']}
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
      linkedin: String
      github: String
      drupal: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
