import React, { Component } from 'react';
import './searchbar.scss'

const SearchBar = React.createClass({
  handleTyping (evt) {

  },
  handleKeyDown (evt) {
    console.log(evt)
  },
  handleSearch (evt) {
    console.log("search!")
  },

  render() {
    return (
      <div id="searchbar">
        <input className="text-search" type="text" onChange={this.handleTyping} onKeyDown={this.handleKeyDown} />
        <button className="search" onClick={this.handleSearch}>Search</button>
      </div>
    )
  }
})

export default SearchBar
