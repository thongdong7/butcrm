'use strict';

import React, {Component} from 'react-native';
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  Text,
  TextInput,
  ToolbarAndroid,
  TouchableHighlight,
  View,
} = React;

var styles = StyleSheet.create({
});

class TagAutoComplete extends Component {
  constructor(props) {
    super(props);

    var types = [
      {
          id: 1,
          name: "Dang co nhu cau"
      },
      {
          id: 2,
          name: "Mua o"
      },
      {
          id: 3,
          name: "Dau tu"
      }
    ];
    var typeMap = {};
    types.forEach(type => typeMap[type.id] = type);
    this.state = {
      tag: "",
      selectedTypes: [],
      types: types,
      typeMap: typeMap,
      matchedTags: [],
    };
  }

  render() {
    var items = [];
    this.state.selectedTypes.forEach((typeId) => {
      items.push(<Text>{this.state.typeMap[typeId].name}</Text>);
    });
    var matchedItems = [];
    this.state.matchedTags.forEach((matchedTag) => {
      matchedItems.push(
        <TouchableHighlight onPress={() => this._onTagSelected(matchedTag)}>
          <Text>{matchedTag.name}</Text>
        </TouchableHighlight>
      )
    });

    return (
      <View>
        {items}
        <TextInput
          placeholder='Tag'
          onChangeText={this._onTagChanged.bind(this)}
          value={this.state.tag} />
        {matchedItems}
      </View>
    );
  }

  _onTagSelected(matchedTag) {
    console.log('select tag', matchedTag);
    if (this.state.selectedTypes.indexOf(matchedTag.id) >= 0) {
      return;
    }


    this.setState({selectedTypes: this.state.selectedTypes.concat([matchedTag.id])});

    // Clean tag
    this._onTagChanged("");
  }

  _onTagChanged(text) {
    var matchedTags = [];
    var lowerText = text.toLowerCase().trim();
    if (lowerText != "") {
      this.state.types.forEach((type) => {
        if (type.name.toLowerCase().startsWith(lowerText) && this.state.selectedTypes.indexOf(type.id) == -1) {
          matchedTags.push({
            ...type,
            highlight: text
          });
        }
      });
    }

    console.log('matched tag1s', matchedTags);
    this.setState({tag: text, matchedTags: matchedTags})
  }
}

module.exports = TagAutoComplete;
