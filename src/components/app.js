import { connect } from 'react-redux'
import React from 'react'
import { bindActionCreators } from 'redux'
import ReactTooltip from 'react-tooltip'
import ActionCreators from '../actions/actionCreators'
import updateQueryString from '../util/update-query-string.js'
import removeLocationHash from '../util/remove-location-hash.js'

import { README_FILENAME, THUMB_FILENAME } from '../constants';

import Header from './header'
import Results from './results'
import SearchBar from './searchbar'

class App extends React.Component {
  componentDidMount() {
    //
    // redirect old hash links to query strings
    //
    const hash = decodeURIComponent(window.location.hash)
    if (hash) {
      const options = hash.slice(1).split(';')
      options.forEach(option => {
        const pair = option.split('=')
        const key = pair[0]
        const value = pair[1]
        updateQueryString(key, value)
      })
      removeLocationHash()
    }

    const query = { ...this.props.query }
    const url = new URL(window.location)
    const params = new URLSearchParams(url.search)
    let key
    let value
    // eslint-disable-next-line no-restricted-syntax
    for (const p of params.entries()) {
      key = p[0]
      value = p[1]
      switch (key) {
        case 'text':
          query.text = value
          break
        case 'user':
          query.user = value
          query.userRaw = value
          break
        case 'd3version':
          query.d3version = value
          break
        case 'api':
          query.api = value.split(',')
          break
        case 'd3modules':
          query.d3modules = value.split(',')
          break
        case 'thumb':
          if (!Array.isArray(query.filenames)) query.filenames = []
          // intentionally use double equals type coercion
          // to check if string value is boolean true
          // eslint-disable-next-line eqeqeq
          if (value === 'true') {
            query.filenames.push(THUMB_FILENAME)
          } else {
            // look for 'thumbnail.png' and remove it if we find it
            const thumbIndex = query.filenames.indexOf(THUMB_FILENAME)
            if (thumbIndex > -1) {
              query.filenames.splice(thumbIndex, 1)
            }
          }
          break
        case 'hasReadme':
          if (!Array.isArray(query.filenames)) query.filenames = []
          // intentionally use double equals type coercion
          // to check if string value is boolean true
          // eslint-disable-next-line eqeqeq
          if (value === 'true') {
            query.filenames.push(README_FILENAME)
          } else {
            query.filenames = query.filenames.filter(filename => filename !== README_FILENAME)
          }
          break
        default:
      }
    }

    this.props.actions.getSearch(query)
    this.props.actions.getScreenshotList()
  }

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
          <span>
            Made with love for the <a href="https://d3js.org">d3.js</a>{' '}
            community by <a href="https://twitter.com/enjalot">@enjalot</a>,{' '}
            <a href="https://twitter.com/micahstubbs">@micahstubbs</a> and{' '}
            <a href="https://github.com/enjalot/blockbuilder-search/graphs/contributors">
              contributors
            </a>
          </span>
          <br />
          <span>
            Hosted with love on{' '}
            <a href="https://cloud.google.com/community/">
              Google Cloud Platform
            </a>
          </span>
        </div>
        <ReactTooltip />
      </div>
    )
  }
}

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

export default connect(
  select,
  mapDispatchToProps
)(App)
