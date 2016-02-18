import React, { Component } from 'react';
import './searchbar.scss'

const SearchBar = React.createClass({
  handleSearch() {
    var value = this.refs.search.value
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
    var mergedQuery = {...this.props.query, ...query};
    // TODO: this will have to account for other features
    // like user and apis
    window.location.hash = "text=" + mergedQuery.text;
    this.props.getSearch(mergedQuery)
  },
  handleKeyDown (evt) {
    if(evt.nativeEvent.keyCode === 13) {
      this.handleSearch();
    }
  },
  handleChange () {
    var value = this.refs.search.value;
    var query = { ...this.props.query, text: value }
    this.props.setQuery(query)
  },
  handleUserKeyUp (evt) {
    var user = this.refs.user.value;
    //console.log("user")
  },
  componentDidUpdate() {
    if(this.refs && this.refs.search) {
      console.log("update!", this.refs.search.value, this.props.query.text)
      this.refs.search.value = this.props.query.text;
    }
  },
  render() {
    console.log("sup", this.props.query.text)
    return (
      <div id="searchbar">
        <input ref="search" className="text-search" type="text" onKeyDown={this.handleKeyDown} onChange={this.handleChange} />
        <a className="search-button" onClick={this.handleSearch}>Search</a>
        <input ref="user" className="user-search" type="text" onKeyUp={this.handleUserKeyUp} />
      </div>
    )
  }
})

export default SearchBar
