import * as React from "react"
import { FaRss, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa';
import { graphql, Link, useStaticQuery } from "gatsby"
import Toggler from "./toggler"

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
        <Toggler />
      </h1>
    )
  } else {
    header = (
      <span>
          <Link className="header-link-home" to="/">
            {title}
          </Link>
          <Toggler />
      </span>
    )
  }

  const social = data.site.siteMetadata?.social

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
          {header}
          <div className="social-icons">
              <a href={`/rss.xml`}><FaRss/></a>
              <a href={`https://twitter.com/${social?.twitter || ``}`}><FaTwitter/></a>
              <a href={`https://linkedin.com/in/${social?.linkedin || ``}`}><FaLinkedinIn/></a>
              <a href={`https://github.com/${social?.github || ``}`}><FaGithub/></a>
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
