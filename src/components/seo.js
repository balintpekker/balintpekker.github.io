/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Seo = ({ description, title, children }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            keywords
            social {
              twitter
            }
            author {
              name
            }
            siteUrl
          }
        }
      }
    `
  )

  const author = site.siteMetadata?.author?.name
  const metaDescription = description || site.siteMetadata?.description
  const metaKeywords = description || site.siteMetadata?.keywords
  const defaultTitle = site.siteMetadata?.title
  const metaSiteUrl = site.siteMetadata?.siteUrl
  const metaTitle = title ? title + ' | ' + defaultTitle : defaultTitle

  return (
    <>
      <title>{metaTitle}</title>
      <link rel="canonical" href={metaSiteUrl} />
      <link rel="shortlink" href={metaSiteUrl} />
      <meta name="author" content={author} />
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta itemprop="name" content={metaTitle} />
      <meta itemprop="description" content={metaDescription} />
      <meta property="og:site_name" content={defaultTitle} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content="" />
      <meta property="og:url" content={metaSiteUrl} />
      <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:creator"
        content={site.siteMetadata?.social?.twitter || ``}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      {children}
    </>
  )
}

export default Seo
