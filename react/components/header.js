import React, { Component } from 'react'
import { IconHome, IconQuestion, IconSearch } from './icons.js'
import './header.scss'

const Header = React.createClass({
  render() {
    return (
      <div id="header">
        <h1>Search the Bl.ocks</h1>
        <div id="nav">
          <div className="nav-link">
            <a href="/" data-tip="Home" data-place="right" data-effect="float">
              <IconHome />
            </a>
          </div>
          <div className="nav-link">
            <a
              href="/about"
              data-tip="About"
              data-place="right"
              data-effect="float"
            >
              <IconQuestion />
            </a>
          </div>
          <div className="nav-link">
            <a
              href="/search"
              data-tip="Search"
              data-place="right"
              data-effect="float"
            >
              <IconSearch />
            </a>
          </div>
        </div>
      </div>
    )
  }
})

export default Header
