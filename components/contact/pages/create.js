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
    let state = {
      contact_id: undefined,
      name: null,
      phone: null
    }

    let route = this.props.route;
    if (route && route.contact) {
      for (let f in route.contact) {
        state[f] = route.contact[f];
      }
    }

    return state;
  },
  render: function() {
    console.log('render view');
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
          keyboardType='numeric'
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({phone: text})}
          value={this.state.phone}
        />
        </View>
      </View>
    );
  },
  onActionSelected: function(position) {
    console.log('on action selected');
    if (position === 0) { // index of 'Settings'
      this.save();
    }
  },
  save: function() {
    // if (this.state.name) {
      // this.gotoContactList();
      contactService.create(this.state).then(() => {
        // Go to ContactList page
        this.gotoContactList();
      });
    // }
  },
  gotoContactList: function() {
    console.log('go to contact list1');
    // this.props.navigator.pop();
    this.props.navigator.push({
        title: "Contacts",
        name: 'contact.list',
        // name: 'hello',
      });
  }
});

module.exports = ContactCreate;
