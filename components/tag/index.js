'use strict';

import React, {Component} from 'react-native';
var {
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} = React;

var update = require('react-addons-update');

var styles = StyleSheet.create({
  tag: {
    backgroundColor: "#eeeeee"
  }
});

class TagAutoComplete extends Component {
  constructor(props) {
    super(props);

    var typeMap = {};
    props.data.forEach(type => typeMap[type.id] = type);
    this.state = {
      tag: "",
      selectedTypes: [],
      types: props.data,
      typeMap: typeMap,
      matchedTags: [],
    };
  }

  render() {
    var items = [];
    this.state.selectedTypes.forEach((typeId) => {
      items.push(
        <View>
          <Text style={styles.tag}>{this.state.typeMap[typeId].name}</Text>
          <TouchableHighlight onPress={() => this._onTagRemove(typeId)}>
            <Text>x</Text>
          </TouchableHighlight>
        </View>
      );
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

  _onTagRemove(tagId) {
    var index = this.state.selectedTypes.indexOf(tagId);
    if (index == -1) {
      return;
    }

    this.setState({
      selectedTypes: update(this.state.selectedTypes, {$splice: [[index, 1]]})
    });
  }

  _onTagSelected(matchedTag) {
    // console.log('select tag', matchedTag);
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

    // console.log('matched tag1s', matchedTags);
    this.setState({tag: text, matchedTags: matchedTags})
  }
}

module.exports = TagAutoComplete;
