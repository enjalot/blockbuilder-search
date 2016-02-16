import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect'
import ActionCreators from '../actions/actionCreators';

import Header from './header'
import Results from './results'
import SearchBar from './searchbar'


const App = React.createClass({
	componentDidMount() {
    this.props.actions.getSearch(this.props.query)
	},
	render() {
		return (
			<div>
        <Header></Header>
        <SearchBar
          query={this.props.query}
          getSearch={this.props.actions.getSearch}
        ></SearchBar>
        <Results
          getPage={this.props.actions.getPage}
        ></Results>
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
