import React, { Component } from 'react'
import { IconClose } from './icons'
import './searchbar.scss'

const ACAPIDiv = React.createClass({
  handleClick() {
    this.props.handleAPISelect(this.props.api.substring(2))
  },
  render() {
    return (
      <div className="ac-api" onClick={this.handleClick}>
        {this.props.api}
      </div>
    )
  }
})

const APIDiv = React.createClass({
  handleClick() {
    this.props.handleAPIDeselect(this.props.api)
  },
  render() {
    return (
      <div className="selected-api">
        <span>{this.props.api}</span>{' '}
        <span className="remove-api" onClick={this.handleClick}>
          <IconClose />
        </span>{' '}
      </div>
    )
  }
})

const SearchBar = React.createClass({
  getInitialState() {
    return {
      apiValue: '',
      apiPos: { top: 0, left: 0 },
      showApis: false,
      moduleValue: '',
      modulePos: { top: 0, left: 0 },
      showModules: false
    }
  },
  handleSearch() {
    const value = this.refs.search.value
    // TODO: parse file: ?
    const query = {
      method: 'text',
      text: value
    }

    if (!value) {
      query.sort = 'created_at'
      query.sort_dir = 'desc'
    }
    const mergedQuery = { ...this.props.query, ...query }
    // TODO: this will have to account for other features
    // like user and apis
    let hash = ''
    if (mergedQuery.text) hash += `text=${mergedQuery.text}`
    if (mergedQuery.user) {
      if (hash) hash += ';'
      hash += `user=${mergedQuery.user}`
    }
    if (mergedQuery.d3version) {
      if (hash) hash += ';'
      hash += `d3version=${mergedQuery.d3version}`
    }
    if (mergedQuery.api.length) {
      if (hash) hash += ';'
      hash += `api=${mergedQuery.api}`
    }
    if (mergedQuery.d3modules.length) {
      if (hash) hash += ';'
      hash += `d3modules=${mergedQuery.d3modules}`
    }
    window.location.hash = encodeURIComponent(hash)
    this.props.getSearch(mergedQuery)
  },
  handleObservableSearch() {
    const value = this.refs.search.value
    const searchString = encodeURIComponent(value)

    const observableSearchURI = `https://beta.observablehq.com/search?query=${searchString}`
    window.open(observableSearchURI)
  },
  handleKeyDown(evt) {
    if (evt.nativeEvent.keyCode === 13) {
      this.handleSearch()
    }
  },
  handleChange() {
    const value = this.refs.search.value
    const query = { ...this.props.query, text: value }
    this.props.setQuery(query)
  },
  handleUserKeyDown(evt) {
    if (evt.nativeEvent.keyCode === 13) {
      this.handleSearch()
    }
  },
  handleThumbnailChange() {
    const checked = this.refs.thumbnail.checked
    let query
    if (checked) {
      query = {
        ...this.props.query,
        filenames: ['thumbnail.png']
      }
    } else {
      query = {
        ...this.props.query,
        filenames: []
      }
    }
    this.props.setQuery(query)
  },
  handleUserChange() {
    // lowercase all user names
    // since this seems to be how we index them
    // in elasticsearch
    const value = `${this.refs.user.value}`.toLowerCase()
    const rawValue = this.refs.user.value
    const query = { ...this.props.query, user: value, userRaw: rawValue }
    this.props.setQuery(query)
  },
  handleVersionChange() {
    let value = this.refs.d3version.value
    if (value === 'any version') value = ''
    const query = { ...this.props.query, d3version: value }
    this.props.setQuery(query)
    const that = this
    setTimeout(() => {
      that.handleSearch()
    })
  },
  onAPIFocus() {
    if (!this.props.d3Apis.length) this.props.getAggregateD3API()

    const bbox = this.refs.api.getBoundingClientRect()
    this.setState({
      apiPos: { top: bbox.bottom, left: bbox.left },
      showApis: true
    })
  },
  onAPIBlur() {
    const that = this
    setTimeout(() => {
      that.setState({ showApis: false })
    }, 250)
  },
  handleAPIChange() {
    const value = this.refs.api.value
    this.setState({ apiValue: value })
  },
  handleAPIKeyDown(evt) {
    if (evt.nativeEvent.keyCode === 27) {
      this.setState({ showApis: false })
    }
  },
  handleAPISelect(api) {
    this.setState({ showApis: false })
    if (this.props.query.api.indexOf(api) >= 0) return
    const apis = this.props.query.api.concat([api])
    this.props.setQuery({
      ...this.props.query,
      api: apis
    })
    this.refs.api.value = ''
    const that = this
    setTimeout(() => {
      that.handleSearch()
    })
  },
  handleAPIDeselect(api) {
    const index = this.props.query.api.indexOf(api)
    if (index < 0) return
    const apis = this.props.query.api.concat([])
    apis.splice(index, 1)
    this.props.setQuery({
      ...this.props.query,
      api: apis
    })
    const that = this
    setTimeout(() => {
      that.handleSearch()
    })
  },

  // ///////////////////////////////////////////////////////////
  onModuleFocus() {
    if (!this.props.d3Modules.length) this.props.getAggregateD3Modules()

    const bbox = this.refs.modules.getBoundingClientRect()
    this.setState({
      modulePos: { top: bbox.bottom, left: bbox.left },
      showModules: true
    })
  },
  onModuleBlur() {
    const that = this
    setTimeout(() => {
      that.setState({ showModules: false })
    }, 250)
  },
  handleModuleChange() {
    const value = this.refs.modules.value
    this.setState({ moduleValue: value })
  },
  handleModuleKeyDown(evt) {
    if (evt.nativeEvent.keyCode === 27) {
      this.setState({ showModules: false })
    }
  },
  handleModuleSelect(module) {
    this.setState({ showModules: false })
    if (this.props.query.d3modules.indexOf(module) >= 0) return
    const d3modules = this.props.query.d3modules.concat([module])
    this.props.setQuery({
      ...this.props.query,
      d3modules
    })
    this.refs.modules.value = ''
    const that = this
    setTimeout(() => {
      that.handleSearch()
    })
  },
  handleModuleDeselect(module) {
    const index = this.props.query.d3modules.indexOf(module)
    if (index < 0) return
    const d3modules = this.props.query.d3modules.concat([])
    d3modules.splice(index, 1)
    this.props.setQuery({
      ...this.props.query,
      d3modules
    })
    const that = this
    setTimeout(() => {
      that.handleSearch()
    })
  },
  componentDidUpdate() {
    if (this.refs) {
      if (this.refs.search || this.refs.search == "") {
        this.refs.search.value = this.props.query.text
      }
      if (this.refs.user && this.props.query.userRaw) {
        this.refs.user.value = this.props.query.userRaw
      }
    }
  },
  render() {
    const that = this
    const apiDivs = []
    const api = this.props.query.api
    if (api) {
      api.forEach(fn => {
        apiDivs.push(
          <APIDiv
            key={`fn-${fn}`}
            api={fn}
            handleAPIDeselect={that.handleAPIDeselect}
          />
        )
      })
    }
    const allApiDivs = []
    const d3Apis = this.props.d3Apis
    const apiValue = this.state.apiValue
    if (d3Apis.length) {
      var top20 = []
      d3Apis.forEach(fn => {
        if (!apiValue || (apiValue && fn.key.indexOf(apiValue)) >= 0)
          top20.push(fn)
      })
      top20 = top20.sort((a, b) => b.doc_count - a.doc_count).slice(0, 20)
      top20.forEach(fn => {
        // allApiDivs.push( (<div className="ac-api" key={"all-fn-" + fn.key} onClick={that.handleAPISelect(fn.key)}>{fn.key}</div>) )
        allApiDivs.push(
          <ACAPIDiv
            key={`ac-fn-${fn.key}`}
            api={`\u002B ${fn.key}`}
            handleAPISelect={that.handleAPISelect}
          />
        )
      })
    }
    const apiStyle = {
      display: this.state.showApis ? 'block' : 'none',
      top: `${this.state.apiPos.top}px`,
      left: `${this.state.apiPos.left}px`
    }

    // TODO: make this a component...
    const moduleDivs = []
    const d3modules = this.props.query.d3modules
    if (d3modules) {
      d3modules.forEach(module => {
        moduleDivs.push(
          <APIDiv
            key={`module-${module}`}
            api={module}
            handleAPIDeselect={that.handleModuleDeselect}
          />
        )
      })
    }
    const allModuleDivs = []
    const alld3Modules = this.props.d3Modules
    const moduleValue = this.state.moduleValue
    if (alld3Modules.length) {
      var top20 = []
      alld3Modules.forEach(module => {
        if (
          !moduleValue ||
          (moduleValue && module.key.indexOf(moduleValue)) >= 0
        )
          top20.push(module)
      })
      top20 = top20.sort((a, b) => b.doc_count - a.doc_count).slice(0, 20)
      top20.forEach(module => {
        // allApiDivs.push( (<div className="ac-api" key={"all-fn-" + fn.key} onClick={that.handleAPISelect(fn.key)}>{fn.key}</div>) )
        allModuleDivs.push(
          <ACAPIDiv
            key={`ac-module-${module.key}`}
            api={`\u002B ${module.key}`}
            handleAPISelect={that.handleModuleSelect}
          />
        )
      })
    }
    const moduleStyle = {
      display: this.state.showModules ? 'block' : 'none',
      top: `${this.state.modulePos.top}px`,
      left: `${this.state.modulePos.left}px`
    }
    return (
      <div id="searchbar">
        <input
          ref="search"
          className="text-search"
          type="text"
          onKeyDown={this.handleKeyDown}
          onChange={this.hanleChange}
        />
        <a className="search-button" onClick={this.handleSearch}>
          Search
        </a>
        <a
          className="search-button-emoji"
          onClick={this.handleObservableSearch}
        >
          📓
        </a>
        <input
          ref="user"
          className="user-search"
          type="text"
          placeholder="username"
          onKeyDown={this.handleUserKeyDown}
          onChange={this.handleUserChange}
        />

        <input
          ref="api"
          className="api-autocomplete"
          type="text"
          placeholder="API functions: d3..."
          onFocus={this.onAPIFocus}
          onBlur={this.onAPIBlur}
          onKeyDown={this.handleAPIKeyDown}
          onChange={this.handleAPIChange}
        />

        <input
          ref="modules"
          className="modules-autocomplete"
          type="text"
          placeholder="d3-modules"
          onFocus={this.onModuleFocus}
          onBlur={this.onModuleBlur}
          onKeyDown={this.handleModuleKeyDown}
          onChange={this.handleModuleChange}
        />

        <select
          ref="d3version"
          value={this.props.query.d3version}
          onChange={this.handleVersionChange}
        >
          <option defaultValue="">any version</option>
          <option defaultValue="v4">v4</option>
          <option defaultValue="v3">v3</option>
          <option defaultValue="v2">v2</option>
        </select>

        <div>
          <input
            ref="thumbnail"
            id="thumbnail-checkbox"
            className="thumbnail-checkbox"
            type="checkbox"
            onChange={this.handleThumbnailChange}
          />
          <label htmlFor="thumbnail-checkbox">with thumbnail image</label>
        </div>

        <div id="selected-apis">{apiDivs}</div>
        <div id="selected-modules">{moduleDivs}</div>
        <div id="autocomplete-apis" style={apiStyle}>
          {allApiDivs}
        </div>
        <div id="autocomplete-modules" style={moduleStyle}>
          {allModuleDivs}
        </div>
      </div>
    )
  }
})

export default SearchBar
