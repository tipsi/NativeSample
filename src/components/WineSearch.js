import React, { Component } from 'react';
import { ScrollView, View, TextInput, Text, Image } from 'react-native';

import * as api from '../api';


class Wine extends Component {
    showLabel() {
        const { wine } = this.props;
        const pi = wine.provider_info ? wine.provider_info[0] : null;
        if (pi && pi.label_url){
            const url = pi.label_url.split('?')[0];
            return (
                <View>
                <Image source={{uri: url}} style={{overflow: 'visible', width: 300, height: 300}}/>
                </View>
            );
        }
    }
    render() {
        const { wine } = this.props;
        return (
            <View>
              <Text>{ wine.wine_name } ({wine.vintage})</Text>
              { this.showLabel() }
            </View>
        );
    }
}

export default class WineSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {result: []};
    }
    onSearch = result => {
        this.state.result = 'before handle';
        this.state.result = 'RES OK: '+result;
    }

    ss = (obj) => {
        this.setState(obj);
    }
    search = async (e) => {
        let u = await api.searchWine(e.nativeEvent.text);
        let j = await u.json();
        this.setState({result: j.data});
    }

    render() {
        return (
            <ScrollView>
              <TextInput onSubmitEditing={this.search}/>
              {this.state.result.map( wine => <Wine key={wine.wineId} wine={wine} />)}
            </ScrollView>
        );
    }
}
