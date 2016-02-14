import React, { Component } from 'react';
import { connect } from 'react-redux';

import './results.scss';

const ResultsComponent = React.createClass({
  render() {
    var query = this.props.query;
    var results = this.props.results;
    var aggregations = this.props.aggregations;

    var resultDivs = results.map((d) => {
      var block = d._source;
      var style = {};
      if(block.thumb) {
        style.backgroundImage = "url(https://gist.githubusercontent.com/" + block.userId + "/" + d._id + "/raw/" + block.thumb + "/thumbnail.png)"
      }
      return (
        <a key={"block-" + d._id} className="block-link" href={"/" + block.userId + "/" + d._id} style={style}>
          <div className="block-description">{block.description}</div>
          <div className="block-user">@{block.userId}</div>
        </a>
      )
    })

    // If there is no text query we want to show a "latest query"
    var summary;
    console.log("query", query)
    if(query.method === "text" && !query.text) {
      console.log("LATEST!")
      var mostleast = query.sort_dir === "desc" ? "most" : "least";
      var updatedcreated = query.sort === "updated_at" ? "updated" : "created";
      // TODO: make the mostleast and updatedcreated into dropdown menus which affect the query.
      summary = (<span>Showing {results.length} of the {mostleast} recently {updatedcreated} blocks </span>)
    } else {
      summary = (<span>Showing {results.length} of the most relevant blocks.</span>)
    }

    return (
      <div id="results">
        <div className="summary">
          {summary}
        </div>
        <div className="blocks">
          {resultDivs}
        </div>
      </div>
    )
  }
})

const mapStateToProps = (state, ownProps) => {
	return {
    query: state.query,
    results: state.results,
    aggregations: state.aggregations
  }
}
const mapActionsToProps = (dispatch) => {
	return {
  }
}

const Results = connect(mapStateToProps, mapActionsToProps)(ResultsComponent);
export default Results
