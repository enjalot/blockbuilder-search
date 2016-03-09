import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect'
import ActionCreators from '../actions/actionCreators';
import ReactTooltip from 'react-tooltip'

import Header from './header'
import Results from './results'
import SearchBar from './searchbar'


const App = React.createClass({
	componentDidMount() {
    var query = {...this.props.query}
    var hash = decodeURIComponent(window.location.hash);
    if(hash) {
      var options = hash.slice(1).split(";");
      var object = {}
      options.forEach(function(option){
        var keyvalue = option.split("=");
        object[keyvalue[0]] = keyvalue[1];
      })
      if(object.text) {
        query.text = object.text;
      }
      if(object.user) {
        query.user = object.user;
      }
      if(object.api) {
        query.api = object.api.split(",")
      }
    }
    this.props.actions.getSearch(query);
    this.props.actions.getScreenshotList();
	},
	render() {
		return (
			<div>
        <Header></Header>
        <SearchBar
          query={this.props.query}
          d3Apis={this.props.d3Apis}
          setQuery={this.props.actions.setQuery}
          getSearch={this.props.actions.getSearch}
          getAggregateD3API={this.props.actions.getAggregateD3API}
        ></SearchBar>
        <Results
          getPage={this.props.actions.getPage}
        ></Results>
        <div id="credits">
          made with love for the <a href="http://d3js.org">d3.js</a> community by <a href="https://twitter.com/enjalot">@enjalot</a>
        </div>
        <ReactTooltip />
      </div>
    )
  }
})

const select = (state) => {
  /*
	let gistsFiltered = gistFilter(state);
	return {
		...state, gistsFiltered
  };
  */
  return {
    ...state
  }
}
const mapDispatchToProps = (dispatch) => {
	let actions = bindActionCreators(ActionCreators, dispatch);
	return {
		actions
	};
}

export default connect(select, mapDispatchToProps)(App);
