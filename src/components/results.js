import Mousetrap from 'mousetrap'
import React from 'react'
import { connect } from 'react-redux'
import { IconLoader } from './icons'
import { graphSearchIPAddress, README_FILENAME, THUMB_FILENAME } from '../constants'

import './results.scss'

class ResultsComponent extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleLoadMore = () => {
    this.props.getPage(this.props.query, this.props.results.length)
  };

  isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect()

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      Math.floor(rect.bottom) <=
        (window.innerHeight ||
          document.documentElement.clientHeight) /* or $(window).height() */ &&
      Math.floor(rect.right) <=
        (window.innerWidth ||
          document.documentElement.clientWidth) /* or $(window).width() */
    )
  };

  handleScroll = (event) => {
    // is the footer in view?
    // if yes, load more data
    const footerEl = document.getElementById('credits')
    const footerIsVisible = this.isElementInViewport(footerEl)
    if (footerIsVisible) {
      this.handleLoadMore()
    }
  };

  onMouseOver = (i, event) => {
    const currentBlockId = event.slice(14)

    // if the shift key is pressed
    // while mousing over a result
    // open up the blockbuilder graph search result
    Mousetrap.bind('shift', () => {
      // point to blockbuilder graph search prototype
      window.open(
        // no https for graph search server yet
        `http://${graphSearchIPAddress}:8080/?gist_id=${currentBlockId}`,
        '_blank'
      )
    })
  };

  onMouseOut = () => {
    Mousetrap.unbind('shift')
  };

  render() {
    const query = this.props.query
    // console.log('query', query)
    let results = this.props.results

    // filter results by member filenames
    // if we are querying for only blocks with thumbnail images
    const hasFiles = typeof query.filenames !== 'undefined';
    if (hasFiles && query.filenames.indexOf(THUMB_FILENAME) > -1) {
      results = this.props.results.filter(
        d => typeof d._source.thumb !== 'undefined'
      )
    }
    // if we are querying for only blocks with README.md
    if (hasFiles && query.filenames.includes(README_FILENAME)) {
      results = this.props.results.filter(
        d => d._source.filenames.includes(README_FILENAME)
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
        const chrisVStem = 'https://christopheviau.com'
        const chrisVUrl = `${chrisVStem}/block_screenshot/${d._id}.png`

        style.backgroundImage = `url(${chrisVUrl})`
        classNameString = `${classNameString} no-thumbnail`
      } else {
        // construct a url for a thumbnail image
        // that is stored as an object inside a GCP (Google Cloud) bucket
        //
        // example:
        // https://storage.googleapis.com/blockbuilder-screenshots/https-bl-ocks-org-aaizemberg-raw-8063f8c2d1adb7c7ee68-thumbnail.png
        const gcpStem = 'https://storage.googleapis.com'
        const bucket = 'blockbuilder-screenshots'
        const blocksStem = 'https-bl-ocks-org'
        const user = block.userId
        const gistId = d._id
        const thumbnailFilename = `${blocksStem}-${user}-raw-${gistId}-thumbnail.png`
        const gcpBucketObjectUrl = `${gcpStem}/${bucket}/${thumbnailFilename}`

        style.backgroundImage = `url(${gcpBucketObjectUrl})`
        classNameString = `${classNameString} no-thumbnail`
      }
      /* eslint-disable react/no-array-index-key */
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
            href={`https://bl.ocks.org/${block.userId}/${d._id}`}
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

    return (
      <div id="results">
        <div className="summary">{summary}</div>
        <div className="blocks">{resultDivs}</div>
        {loading}
      </div>
    )
  }
}

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
