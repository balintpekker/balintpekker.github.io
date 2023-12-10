import React from 'react'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'

class Toggler extends React.Component {
  render() {
    return (
      <ThemeToggler>
        {({ theme, toggleTheme }) => (
          <label className={"theme-switch"}>
            <input
              type="checkbox"
              onChange={e => toggleTheme(e.target.checked ? 'dark' : 'light')}
              checked={theme === 'dark'}
              className="theme-toggler"
            />
          </label>
        )}
      </ThemeToggler>
    )
  }
}

export default Toggler
