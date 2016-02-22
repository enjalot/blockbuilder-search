import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IconLoader } from './icons'

import './results.scss';

const ResultsComponent = React.createClass({
  handleLoadMore() {
    this.props.getPage(this.props.query, this.props.results.length)
  },
  render() {
    var query = this.props.query;
    var results = this.props.results;
    var totalResults = this.props.totalResults || 0;
    //var aggregations = this.props.aggregations;

    var resultDivs = results.map((d) => {
      var block = d._source;
      var style = {};
      if(block.thumb) {
        style.backgroundImage = "url(https://gist.githubusercontent.com/" + block.userId + "/" + d._id + "/raw/" + block.thumb + "/thumbnail.png)"
      }
      return (
        <a key={"block-" + d._id} className="block-link" href={"/" + block.userId + "/" + d._id} style={style} target="_blank">
          <div className="block-description">{block.description}</div>
          <div className="block-user">@{block.userId}</div>
        </a>
      )
    })

    // If there is no text query we want to show a "latest query"
    var summary;
    if(!query.text) {
      //console.log("LATEST!")
      var mostleast = query.sort_dir === "desc" ? "most" : "least";
      var updatedcreated = query.sort === "updated_at" ? "updated" : "created";
      // TODO: make the mostleast and updatedcreated into dropdown menus which affect the query.
      summary = (<span>Showing {results.length}/{totalResults} of the {mostleast} recently {updatedcreated} blocks.</span>)
    } else {
      summary = (<span>Showing {results.length}/{totalResults} of the most relevant blocks.</span>)
    }
    var loading;
    if(this.props.loading) {
      loading = (<div className=".loading"><IconLoader></IconLoader></div>)
    }

    var loadMore;
    if(results.length < totalResults) {
      loadMore = <a className="load-more" onClick={this.handleLoadMore}>Load more</a>
    }

    return (
      <div id="results">
        <div className="summary">
          {summary}
        </div>
        <div className="blocks">
          {resultDivs}
        </div>
        {loading}
        {loadMore}
      </div>
    )
  }
})

const mapStateToProps = (state, ownProps) => {
	return {
    query: state.query,
    results: state.results,
    totalResults: state.totalResults,
    loading: state.loading
    //aggregations: state.aggregations
  }
}
const mapActionsToProps = (dispatch) => {
	return {
  }
}
const Results = connect(mapStateToProps, mapActionsToProps)(ResultsComponent);
export default Results
