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
    var hash = window.location.hash;
    if(hash) {
      var options = hash.slice(1).split(";");
      var object = {}
      options.forEach(function(option){
        var keyvalue = option.split("=");
        object[keyvalue[0]] = keyvalue[1];
      })
      if(object.text) {
        query.text = object.text
      }
    }
    this.props.actions.getSearch(query);
	},
	render() {
		return (
			<div>
        <Header></Header>
        <SearchBar
          query={this.props.query}
          setQuery={this.props.actions.setQuery}
          getSearch={this.props.actions.getSearch}
        ></SearchBar>
        <Results
          getPage={this.props.actions.getPage}
        ></Results>
        <ReactTooltip />
      </div>
    )
  }
})

const select = (state) => {
  console.log("select", state)
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
