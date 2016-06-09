// -*- mode: web; web-mode-content-type: "jsx"; web-mode-code-indent-offset: 2; -*-

import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Text, Image } from 'react-native';

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  bordered: {
    borderWidth: 0.5,
    padding: 3,
    margin: 1.5,
    height: width*0.2,
  },
  box: {
    flexDirection: 'row',
  },
  wine_desc: {
    width: width*0.8,
  },
  wine_label: {
  }
});

export default class Wine extends Component {
  showLabel() {
    const { wine } = this.props;
    const pi = wine.provider_info ? wine.provider_info[0] : null;
    if (pi && pi.label_url){
      const url = pi.label_url.split('?')[0];
      const {height, width} = Dimensions.get('window');
      const w = (width-5)*0.17
      return (
        <View style={styles.wine_label}>
          <Image source={{uri: url}} style={{overflow: 'visible', width: w, height: w}}/>
        </View>
      );
    }
  }

  render() {
    const { wine } = this.props;
    return (
      <View style={styles.bordered}>
        <View style={styles.box}>
          <Text style={styles.wine_desc} >{ wine.wine_name } ({ wine.vintage })</Text>
          { this.showLabel() }
        </View>
      </View>
    );
  }
}
