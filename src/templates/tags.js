import React from "react"
import PropTypes from "prop-types"

// Components
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"

const Tags = ({ pageContext, data, location }) => {
    const siteTitle = data.site.siteMetadata?.title || `Title`
    const { tag } = pageContext
    const { edges, totalCount } = data.allMarkdownRemark
    const tagLink = "/tags/" + tag

    return (
        <Layout location={location} title={siteTitle}>
            <Bio />
            <div className="tags">
                <h1><Link to={tagLink}># {tag}</Link></h1>
                <ul className="tags-list-single">
                    {edges.map(({ node }, index) => {
                        const { slug } = node.fields
                        const { readingTime } = node.fields
                        const { title } = node.frontmatter
                        const { date } = node.frontmatter
                        return (
                            <li key={slug}>
                                <h2><Link to={slug}>{title}</Link></h2>
                                <small>{date} - {readingTime.text}</small>
                                { index + 1 < totalCount &&
                                    <hr />
                                }
                            </li>
                        )
                    })}
                </ul>
                <span className="tags"><Link to="/tags">All tags</Link></span>
            </div>
        </Layout>
    )
}

Tags.propTypes = {
    pageContext: PropTypes.shape({
        tag: PropTypes.string.isRequired,
    }),
    data: PropTypes.shape({
        allMarkdownRemark: PropTypes.shape({
            totalCount: PropTypes.number.isRequired,
            edges: PropTypes.arrayOf(
                PropTypes.shape({
                    node: PropTypes.shape({
                        frontmatter: PropTypes.shape({
                            title: PropTypes.string.isRequired,
                        }),
                        fields: PropTypes.shape({
                            slug: PropTypes.string.isRequired,
                        }),
                    }),
                }).isRequired
            ),
        }),
    }),
}

export default Tags

export const Head = () => <Seo />

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { frontmatter: { date: DESC }}
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            readingTime {
              text
            }
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`
