import React, { Component } from 'react';
import './searchbar.scss'

const SearchBar = React.createClass({
  handleKeyUp (evt) {
    // debounce the typing
    // (we only want to kick off search when we think someone is done typing)
    if(this.t) { clearTimeout(this.t); delete this.t; }
    this.t = setTimeout(() => {
      var value = this.refs.search.value
      console.log("value", value)
      // TODO: parse file: ?
      var query = {
        method: "text"
      }
      if(value) {
        query.text = value;
      } else {
        query.sort = "created_at";
        query.sort_dir = "desc";
      }
      // this overrides the reducer functionality a bit... seems off
      this.props.getSearch({...this.props.query, ...query})
    }, 500)
  },
  handleUserKeyUp (evt) {
    var user = this.refs.user.value;
    console.log("user")
  },
  render() {
    return (
      <div id="searchbar">
        <input ref="search" className="text-search" type="text" onKeyUp={this.handleKeyUp} />
        <input ref="user" className="user-search" type="text" onKeyUp={this.handleUserKeyUp} />
      </div>
    )
  }
})

export default SearchBar
