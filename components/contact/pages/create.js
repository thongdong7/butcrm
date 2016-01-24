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
  ToastAndroid,
  Text,
  TextInput,
  ToolbarAndroid,
  View,
} = React;

var ContactList = require('./list');
var dismissKeyboard = require('dismissKeyboard');
var contactService = require("../service");

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
    if (this.state.name) {
      dismissKeyboard();
      contactService.create(this.state).then(() => {
        let msg;
        if (this.state.contact_id) {
          msg = `Updated ${this.state.name}`;
        } else {
          msg = `Added ${this.state.name} to list`;
        }

        ToastAndroid.show(msg, ToastAndroid.SHORT);
        // close this page page
        this._closePage();
      });
     }
  },
  _closePage: function() {
    console.log('go to contact list1');
     this.props.navigator.pop();
//    this.props.navigator.push({
//        title: "Contacts",
//        name: 'contact.list',
//        // name: 'hello',
//      });
  }
});

module.exports = ContactCreate;
