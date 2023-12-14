import * as React from "react"
import { FaRss, FaTwitter, FaLinkedinIn, FaGithub, FaDrupal } from 'react-icons/fa';
import { graphql, Link, useStaticQuery } from "gatsby"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          social {
            twitter
            linkedin
            github
          }
        }
      }
    }
  `)

  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <span>
          <Link className="header-link-home" to="/">
            {title}
          </Link>
      </span>
    )
  }

  const social = data.site.siteMetadata?.social

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
          {header}
          <div className="social-icons">
              <a href={`/rss.xml`} target="_blank" rel="noreferrer"><FaRss/></a>
              <a href={`https://twitter.com/${social?.twitter || ``}`} target="_blank" rel="noreferrer"><FaTwitter/></a>
              <a href={`https://linkedin.com/in/${social?.linkedin || ``}`} target="_blank" rel="noreferrer"><FaLinkedinIn/></a>
              <a href={`https://github.com/${social?.github || ``}`} target="_blank" rel="noreferrer"><FaGithub/></a>
              <a href={`https://drupal.org/u/balintpekker`} target="_blank" rel="noreferrer"><FaDrupal/></a>
          </div>
      </header>
      <main>{children}</main>
      <footer>
          © {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default Layout
