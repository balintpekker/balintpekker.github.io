/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/
 */

const React = require("react")
/**
 * @type {import('gatsby').GatsbySSR['onRenderBody']}
 */
exports.onRenderBody = ({ setHtmlAttributes, setPostBodyComponents }) => {
  setHtmlAttributes({ lang: `en` })
  setPostBodyComponents([
    <script
      data-name="BMC-Widget"
      src="https://cdn.buymeacoffee.com/widget/1.0.0/prod/widget.prod.min.js"
      data-id="balintpekkg"
      data-description="Support me on Buy me a coffee!"
      data-message="Thank you for visiting. Feel free to fuel me up with some caffeine!"
      data-color="#00afdb"
      data-position="right"
      data-x_margin="21"
      data-y_margin="21"
    ></script>,
  ])
}
