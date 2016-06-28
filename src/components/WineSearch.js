// -*- mode: Web; web-mode-content-type: "jsx"; web-mode-code-indent-offset: 2 -*-

import React, { Component } from 'react';
import { ScrollView, View, TextInput, Text, Image } from 'react-native';

import * as api from '../api';
import Wine from './Wine';



export default class WineSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {result: []};
  }

  search = async (term) => {
    let u = await api.searchWine(term);
    let j = await u.json();
    this.setState({result: j.data});
  }

  onSubmit = (e) => {
    this.search(e.nativeEvent.text).done();
  }

  componentWillMount() {
    this.search('red').done();
  }

  render() {
    return (
      <ScrollView>
          <TextInput style={{height: 60}} onSubmitEditing={this.onSubmit} accessibilityLabel="searchInputAcc"/>
          { this.state.result.map( wine => <Wine key={wine.wineId} wine={wine} />) }
      </ScrollView>
    );
  }
}
