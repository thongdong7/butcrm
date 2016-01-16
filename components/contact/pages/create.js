/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  ToolbarAndroid,
  View,
} = React;

var ContactList = require('./list.js');

var contactService = require("../service.js");

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#9999ff',
    height: 56,
  },
});

var ContactCreate = React.createClass({
  getInitialState: function() {
    return {
      name: null,
    };
  },
  render: function() {
    console.log('props contact');
    console.log('props contact', this.props);
    return (
      <View>
        <ToolbarAndroid
         title="Create contact"
         style={styles.toolbar}
         actions={[{title: 'Save', show: 'always'}]}
         onActionSelected={this.onActionSelected} />

        <View style={{padding: 15, flex: 1}}>
        <TextInput
          autoCapitalize='words'
          placeholder='Name'
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({name: text})}
          value={this.state.name}
        />
        <TextInput
          placeholder='Phone'
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({name: text})}
          value={this.state.name}
        />
        </View>
      </View>
    );
  },
  onActionSelected: function(position) {
    if (position === 0) { // index of 'Settings'
      this.save();
    }
  },
  save: function() {
    if (this.state.name) {
      contactService.create({name: this.state.name}).then(() => {
        // Go to ContactList page
        this.gotoContactList();
      });
    }
  },
  gotoContactList: function() {
    console.log('go to contact list');
    this.props.navigator.push({
        title: "Contacts",
        name: 'contact.list',
      });
  }
});

module.exports = ContactCreate;
