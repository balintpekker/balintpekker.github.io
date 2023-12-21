/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

const { nodes } = require("gatsby/dist/redux/reducers")
/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `bPekker.dev`,
    author: {
      name: `Balint Pekker`,
      summary: `a software engineer being really good at turning caffeine into code.`,
    },
    description: `A Drupal related blog Written by Balint Pekker, a software engineer being really good at turning caffeine into code.`,
    keywords: `blog, drupal, balint, pekker, bpekker, software`,
    siteUrl: `https://bpekker.dev/`,
    social: {
      twitter: `balint_pekker`,
      linkedin: `balintpekker`,
      github: `balintpekker`,
      drupal: `balintpekker`,
    },
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-reading-time`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `{
              allMarkdownRemark(sort: {frontmatter: {date: DESC}}) {
                nodes {
                  excerpt
                  html
                  fields {
                    slug
                    readingTime {
                      text
                    }
                  }
                  frontmatter {
                    title
                    date
                  }
                }
              }
            }`,
            output: "/rss.xml",
            title: "bPekker RSS Feed",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `bPekker`,
        short_name: `bPekker`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-remove-generator',
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          "G-YP5T5PRK27",
        ],
        pluginConfig: {
          head: true,
          respectDNT: true,
          exclude: ["/preview/**", "/___graphql"],
        },
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: '/',
        query: `
        {
          site {
            siteMetadata {
              siteUrl
            }
          }
          allSitePage {
            nodes {
              path
            }
          }
          allMarkdownRemark {
            nodes {
              frontmatter {
                date
              },
              fields {
                slug
              }
            }
          }
        }`,
        resolvePages: ({
          allSitePage: { nodes: allPages },
          allMarkdownRemark: { nodes: allPosts },
        }) => {
          const pathToDateMap = {};

          allPosts.map(post => {
            pathToDateMap [post.fields.slug] = { date: post.frontmatter.date };
          });

          return allPages.map(page => {
            return { ...page, ...pathToDateMap [page.path] };
          });
        },
        serialize: ({ path, date }) => {
          let entry = {
            url: path,
            changefreq: 'daily',
            priority: 0.5,
          };

          if (date) {
            entry.priority = 0.7;
            entry.lastmod = date;
          }

          return entry;
        }
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://bpekker.dev',
      }
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        showSpinner: false,
        trickle: false,
        minimum: 0.4,
      },
    },
  ],
}
