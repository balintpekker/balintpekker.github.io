import * as React from "react"
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
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  const social = data.site.siteMetadata?.social

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()} | <a href={`https://twitter.com/${social?.twitter || ``}`}>Twitter</a> | <a href={`https://linkedin.com/in/${social?.linkedin || ``}`}>LinkedIn</a> | <a href={`https://github.com/${social?.github || ``}`}>GitHub</a>
      </footer>
    </div>
  )
}

export default Layout
