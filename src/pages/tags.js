import React from "react"
import PropTypes from "prop-types"
import kebabCase from "lodash/kebabCase"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { FaRss } from "react-icons/fa"

const TagsPage = ({
    data,
    location
}) => {
    const siteTitle = data.site.siteMetadata?.title || `Title`
    const group = data.allMarkdownRemark.group

    return (
        <Layout location={location} title={siteTitle}>
            <Bio />
            <div>
                <div className="tags">
                    <h2>Tags</h2>
                    <ul className="tags-list">
                        {group.map(tag => (
                            <li key={tag.fieldValue}>
                                <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
                                    #{tag.fieldValue} ({tag.totalCount})
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <hr/>
                    <h3 id="feeds">Feeds</h3>
                    <span>Site feed: </span>
                    <Link to={`/rss.xml`} className="rss">
                        <FaRss /> RSS
                    </Link>
                    <div>Stay updated on your favorite topics by subscribing to our tag-based feeds for a personalized reading experience.</div>
                    <ul className="feeds-list">
                        {group.map(tag => (
                            <li key={tag.fieldValue}>
                                <Link to={`/${kebabCase(tag.fieldValue)}.xml`}>
                                    <FaRss /> {tag.fieldValue}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    )
}

export default TagsPage

export const Head = () => <Seo />

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: { frontmatter: { tags: SELECT }}) {
        fieldValue
        totalCount
      }
    }
  }
`
