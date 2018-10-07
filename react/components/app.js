import { connect } from 'react-redux'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { createSelector } from 'reselect'
import ReactTooltip from 'react-tooltip'
import ActionCreators from '../actions/actionCreators'

import Header from './header'
import Results from './results'
import SearchBar from './searchbar'

const App = React.createClass({
  componentDidMount() {
    const query = { ...this.props.query }
    const hash = decodeURIComponent(window.location.hash)
    if (hash) {
      const options = hash.slice(1).split(';')
      const object = {}
      options.forEach(option => {
        const keyvalue = option.split('=')
        object[keyvalue[0]] = keyvalue[1]
      })
      if (object.text) {
        query.text = object.text
      }
      if (object.user) {
        query.user = object.user
        query.userRaw = object.user
      }
      if (object.d3version) {
        query.d3version = object.d3version
      }
      if (object.api) {
        query.api = object.api.split(',')
      }
      if (object.d3modules) {
        query.d3modules = object.d3modules.split(',')
      }
    }
    this.props.actions.getSearch(query)
    this.props.actions.getScreenshotList()
  },
  render() {
    return (
      <div id="search-container">
        <Header />
        <SearchBar
          query={this.props.query}
          d3Apis={this.props.d3Apis}
          d3Modules={this.props.d3Modules}
          setQuery={this.props.actions.setQuery}
          getSearch={this.props.actions.getSearch}
          getAggregateD3API={this.props.actions.getAggregateD3API}
          getAggregateD3Modules={this.props.actions.getAggregateD3Modules}
        />
        <Results getPage={this.props.actions.getPage} />
        <div id="credits">
          <span>Made with love for the <a href="https://d3js.org">d3.js</a> community by <a href="https://twitter.com/enjalot">@enjalot</a>, <a href="https://twitter.com/micahstubbs">@micahstubbs</a> and <a href="https://github.com/enjalot/blockbuilder-search/graphs/contributors">contributors</a></span>
          <br/>
          <span>Hosted with love on <a href="https://cloud.google.com/community/">Google Cloud Platform</a></span>
        </div>
        <ReactTooltip />
      </div>
    )
  }
})

const select = state =>
  /*
  let gistsFiltered = gistFilter(state);
  return {
    ...state, gistsFiltered
  };
  */
  ({
    ...state
  })

const mapDispatchToProps = dispatch => {
  const actions = bindActionCreators(ActionCreators, dispatch)
  return {
    actions
  }
}

export default connect(select, mapDispatchToProps)(App)
