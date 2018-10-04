import Mousetrap from 'mousetrap'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IconLoader } from './icons'
import { graphSearchIPAddress } from '../constants'

import './results.scss'

const ResultsComponent = React.createClass({
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  handleLoadMore() {
    this.props.getPage(this.props.query, this.props.results.length)
  },

  isElementInViewport(el) {
    const rect = el.getBoundingClientRect()

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      Math.floor(rect.bottom) <=
        (window.innerHeight ||
          document.documentElement.clientHeight) /*or $(window).height() */ &&
      Math.floor(rect.right) <=
        (window.innerWidth ||
          document.documentElement.clientWidth) /*or $(window).width() */
    )
  },

  handleScroll(event) {
    // is the See More button in view?
    // if yes, load more data
    const footerEl = document.getElementById('credits')
    const footerIsVisible = this.isElementInViewport(footerEl)

    // let results = this.props.results
    // const totalResults = this.props.totalResults || 0

    if (footerIsVisible) {
      this.handleLoadMore()
    }
  },

  onMouseOver(i, event) {
    const currentBlockId = event.slice(14)

    // if the shift key is pressed
    // while mousing over a result
    // open up the blockbuilder graph search result
    Mousetrap.bind('shift', () => {
      // point to blockbuilder graph search prototype
      // running on digital ocean server
      window.open(
        `http://${graphSearchIPAddress}:8080/?gist_id=${currentBlockId}`,
        '_blank'
      )
    })
  },
  onMouseOut() {
    Mousetrap.unbind('shift')
  },
  render() {
    const query = this.props.query
    console.log('query', query)
    let results = this.props.results

    // if we are querying for only blocks with thumbnail images
    if (
      typeof query.filenames !== 'undefined' &&
      query.filenames.indexOf('thumbnail.png') > -1
    ) {
      results = this.props.results.filter(
        d => typeof d._source.thumb !== 'undefined'
      )
    }
    const totalResults = this.props.totalResults || 0
    const screenshots = this.props.screenshots || []
    // var aggregations = this.props.aggregations;

    const resultDivs = results.map((d, i) => {
      const block = d._source
      const style = {}
      let classNameString = 'block-link'
      if (block.thumb) {
        style.backgroundImage = `url(https://gist.githubusercontent.com/${
          block.userId
        }/${d._id}/raw/${block.thumb}/thumbnail.png)`
      } else if (screenshots.indexOf(`${d._id}.png`) > -1) {
        style.backgroundImage = `url(http://christopheviau.com/block_screenshot/${
          d._id
        }.png)`
        classNameString = `${classNameString} ` + `no-thumbnail`
      }
      return (
        <div
          key={`block-${i}-${d._id}`}
          className={classNameString}
          data-tag={block.description}
          style={style}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
        >
          <a href={`/${block.userId}/${d._id}`} target="_blank">
            <div className="block-description">{block.description}</div>
            <div className="block-user">@{block.userId}</div>
          </a>
          <a
            className="block-org-link"
            href={`http://bl.ocks.org/${block.userId}/${d._id}`}
            target="_blank"
          >
            bl.ocks.org
          </a>
          <a
            className="block-graph-link"
            href={`http://${graphSearchIPAddress}:8080/?gist_id=${d._id}`}
            target="_blank"
          >
            graph search
          </a>
        </div>
      )
    })

    // If there is no text query we want to show a "latest query"
    let summary
    if (!query.text) {
      // console.log("LATEST!")
      const mostleast = query.sort_dir === 'desc' ? 'most' : 'least'
      const updatedcreated = query.sort === 'updated_at' ? 'updated' : 'created'
      // TODO: make the mostleast and updatedcreated into dropdown menus which affect the query.
      summary = (
        <span>
          Showing {results.length}/{totalResults} of the {mostleast} recently{' '}
          {updatedcreated} blocks.
        </span>
      )
    } else {
      summary = (
        <span>
          Showing {results.length}/{totalResults} of the most relevant blocks.
        </span>
      )
    }
    let loading
    if (this.props.loading) {
      loading = (
        <div className=".loading">
          <IconLoader />
        </div>
      )
    }

    // let loadMore
    // if (results.length < totalResults) {
    //   loadMore = (
    //     <a className="load-more" onClick={this.handleLoadMore}>
    //       Load more
    //     </a>
    //   )
    // }

    return (
      <div id="results">
        <div className="summary">{summary}</div>
        <div className="blocks">{resultDivs}</div>
        {loading}
      </div>
    )
  }
})

const mapStateToProps = (state, ownProps) => ({
  query: state.query,
  results: state.results,
  totalResults: state.totalResults,
  screenshots: state.screenshots,
  loading: state.loading
  // aggregations: state.aggregations
})
const mapActionsToProps = dispatch => ({})
const Results = connect(
  mapStateToProps,
  mapActionsToProps
)(ResultsComponent)
export default Results
