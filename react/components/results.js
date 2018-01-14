import Mousetrap from 'mousetrap';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IconLoader } from './icons';
import { graphSearchIPAddress } from '../constants';

import './results.scss';

const ResultsComponent = React.createClass({
  constructor() {

  }
  handleLoadMore() {
    this.props.getPage(this.props.query, this.props.results.length);
  },

  onMouseOver(i, event) {
    const currentBlockId = event.slice(14);

    // if the shift key is pressed
    // while mousing over a result
    // open up the blockbuilder graph search result
    Mousetrap.bind('shift', () => {
      console.log('event', event);
      console.log('currentBlockId', currentBlockId);
      // point to blockbuilder graph search prototype
      // running on digital ocean server
      window.open(
        `http://${graphSearchIPAddress}:8080/?gist_id=${currentBlockId}`,
        '_blank'
      );
    });
  },
  onMouseOut() {
    Mousetrap.unbind('shift');
  },
  render() {
    var query = this.props.query;
    console.log('query', query);
    let results = this.props.results;

    // if we are querying for only blocks with thumbnail images
    if (
      typeof query.filenames !== 'undefined' &&
      query.filenames.indexOf('thumbnail.png') > -1
    ) {
      results = this.props.results.filter(
        d => typeof d._source.thumb !== 'undefined'
      );
    }
    var totalResults = this.props.totalResults || 0;
    var screenshots = this.props.screenshots || [];
    //var aggregations = this.props.aggregations;

    var resultDivs = results.map(d => {
      var block = d._source;
      var style = {};
      var classNameString = 'block-link';
      if (block.thumb) {
        style.backgroundImage =
          'url(https://gist.githubusercontent.com/' +
          block.userId +
          '/' +
          d._id +
          '/raw/' +
          block.thumb +
          '/thumbnail.png)';
      } else {
        if (screenshots.indexOf(d._id + '.png') > -1) {
          style.backgroundImage =
            'url(http://christopheviau.com/block_screenshot/' + d._id + '.png)';
          classNameString = classNameString + ' ' + 'no-thumbnail';
        }
      }
      return (
        <div
          key={'block-' + d._id}
          className={classNameString}
          data-tag={block.description}
          style={style}
          onMouseOver={this.onMouseOver}
          onMouseOut={this.onMouseOut}
        >
          <a href={'/' + block.userId + '/' + d._id} target="_blank">
            <div className="block-description">{block.description}</div>
            <div className="block-user">@{block.userId}</div>
          </a>
          <a
            className="block-org-link"
            href={'http://bl.ocks.org/' + block.userId + '/' + d._id}
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
      );
    });

    // If there is no text query we want to show a "latest query"
    var summary;
    if (!query.text) {
      //console.log("LATEST!")
      var mostleast = query.sort_dir === 'desc' ? 'most' : 'least';
      var updatedcreated = query.sort === 'updated_at' ? 'updated' : 'created';
      // TODO: make the mostleast and updatedcreated into dropdown menus which affect the query.
      summary = (
        <span>
          Showing {results.length}/{totalResults} of the {mostleast} recently{' '}
          {updatedcreated} blocks.
        </span>
      );
    } else {
      summary = (
        <span>
          Showing {results.length}/{totalResults} of the most relevant blocks.
        </span>
      );
    }
    var loading;
    if (this.props.loading) {
      loading = (
        <div className=".loading">
          <IconLoader />
        </div>
      );
    }

    var loadMore;
    if (results.length < totalResults) {
      loadMore = (
        <a className="load-more" onClick={this.handleLoadMore}>
          Load more
        </a>
      );
    }

    return (
      <div id="results">
        <div className="summary">{summary}</div>
        <div className="blocks">{resultDivs}</div>
        {loading}
        {loadMore}
      </div>
    );
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    query: state.query,
    results: state.results,
    totalResults: state.totalResults,
    screenshots: state.screenshots,
    loading: state.loading
    //aggregations: state.aggregations
  };
};
const mapActionsToProps = dispatch => {
  return {};
};
const Results = connect(mapStateToProps, mapActionsToProps)(ResultsComponent);
export default Results;
