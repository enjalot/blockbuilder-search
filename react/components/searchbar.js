import React, { Component } from 'react';
import { IconClose } from './icons'
import './searchbar.scss'

const ACAPIDiv = React.createClass({
  handleClick() {
    console.log("click!", this.props.api)
    this.props.handleAPISelect(this.props.api)
  },
  render() {
    return (<div className="ac-api" onClick={this.handleClick}>{this.props.api}</div>)
  }
})

const APIDiv = React.createClass({
  handleClick() {
    this.props.handleAPIDeselect(this.props.api)
  },
  render() {
    return (<div className="selected-api"><span>{this.props.api}</span> <span className="remove-api" onClick={this.handleClick}><IconClose></IconClose></span> </div>)
  }
})

const SearchBar = React.createClass({
  getInitialState() {
    return {
      apiValue: "",
      apiPos: { top: 0, left: 0 },
      showApis: false
    }
  },
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
    var hash = "";
    if(mergedQuery.text)
      hash += "text=" + mergedQuery.text;
    if(mergedQuery.user) {
      if(hash) hash += ";"
      hash += "user=" + mergedQuery.user;
    }
    if(mergedQuery.api.length) {
      if(hash) hash += ";"
      hash += "api=" + mergedQuery.api;
    }
    window.location.hash = hash;
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
  handleUserKeyDown (evt) {
    if(evt.nativeEvent.keyCode === 13) {
      this.handleSearch();
    }
  },
  handleUserChange () {
    var value = this.refs.user.value;
    var query = { ...this.props.query, user: value }
    this.props.setQuery(query)
  },
  onAPIFocus() {
    if(!this.props.d3Apis.length)
      this.props.getAggregateD3API()

    var bbox = this.refs.api.getBoundingClientRect()
    this.setState({
      apiPos: { top: bbox.bottom, left: bbox.left },
      showApis: true
    })
  },
  onAPIBlur() {
    var that = this;
    console.log("blur")
    setTimeout(function() {
      console.log("hmmm")
      that.setState({showApis: false})
    }, 250)
  },
  handleAPIChange() {
    var value = this.refs.api.value;
    this.setState({ apiValue: value })
  },
  handleAPIKeyDown (evt) {
    if(evt.nativeEvent.keyCode === 27) {
      this.setState({showApis: false})
    }
  },
  handleAPISelect(api) {
    this.setState({showApis: false})
    if(this.props.query.api.indexOf(api) >=0) return;
    var apis = this.props.query.api.concat([api])
    this.props.setQuery({
      ...this.props.query,
      api: apis
    })
    this.refs.api.value = "";
    var that = this;
    setTimeout(function() {
      that.handleSearch()
    })
  },
  handleAPIDeselect(api) {
    var index = this.props.query.api.indexOf(api)
    if(index < 0) return;
    var apis = this.props.query.api.concat([])
    apis.splice(index,1)
    this.props.setQuery({
      ...this.props.query,
      api: apis
    })
    var that = this;
    setTimeout(function() {
      that.handleSearch()
    })
  },
  componentDidUpdate() {
    if(this.refs) {
      if(this.refs.search) {
        this.refs.search.value = this.props.query.text;
      }
      if(this.refs.user && this.props.query.user) {
        this.refs.user.value = this.props.query.user;
      }
    }
  },
  render() {
    var that = this;
    var apiDivs = [];
    var api = this.props.query.api;
    if(api) {
      console.log("api", api)
      api.forEach(function(fn) {
        apiDivs.push( (<APIDiv key={"fn-" + fn} api={fn} handleAPIDeselect={that.handleAPIDeselect}/>) )
      })
    }

    var allApiDivs = [];
    var d3Apis = this.props.d3Apis
    var apiValue = this.state.apiValue
    if(d3Apis.length) {
      var top20 = [];
      d3Apis.forEach(function(fn) {
        if(!apiValue || (apiValue && fn.key.indexOf(apiValue)) >= 0)
          top20.push(fn)
      })
      top20 = top20.sort(function(a,b) { return b.doc_count - a.doc_count}).slice(0,20);
      top20.forEach(function(fn) {
        //allApiDivs.push( (<div className="ac-api" key={"all-fn-" + fn.key} onClick={that.handleAPISelect(fn.key)}>{fn.key}</div>) )
        allApiDivs.push( (<ACAPIDiv key={"ac-fn-" + fn.key} api={fn.key} handleAPISelect={that.handleAPISelect} />) )
      })
    }
    var apiStyle = {
      display: this.state.showApis ? "block" : "none",
      top: this.state.apiPos.top + "px",
      left: this.state.apiPos.left + "px",
    }
    return (
      <div id="searchbar">
        <input ref="search" className="text-search" type="text" onKeyDown={this.handleKeyDown} onChange={this.handleChange} />
        <a className="search-button" onClick={this.handleSearch}>Search</a>
        <input ref="user" className="user-search" type="text" placeholder="username" onKeyDown={this.handleUserKeyDown} onChange={this.handleUserChange} />
        <input ref="api" className="api-autocomplete" type="text" placeholder="API functions: d3..."
          onFocus={this.onAPIFocus}
          onBlur={this.onAPIBlur}
          onKeyDown={this.handleAPIKeyDown}
          onChange={this.handleAPIChange} />
        <div id="selected-apis">
          {apiDivs}
        </div>
        <div id="autocomplete-apis" style={apiStyle}>
          {allApiDivs}
        </div>
      </div>
    )
  }
})

export default SearchBar
