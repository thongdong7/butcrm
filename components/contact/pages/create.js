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
var DefaultPage = require('../../common/pages/default.js');

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#9999ff',
    height: 56,
  },
});

class ContactCreate extends DefaultPage {
  constructor(props) {
    super(props);

    let state = {
      contact_id: undefined,
      name: null,
      phone: null,
      note: null,
    }

    let route = this.props.route;
    if (route && route.contact) {
      for (let f in route.contact) {
        state[f] = route.contact[f];
      }
    }

    this.state = state;
  }

  getTitle() {
    return "Create contact";
  }

  renderContent() {
    return (
      <View>
        <View style={{padding: 15, flex: 1}}>
        <TextInput
          autoCapitalize='words'
          placeholder='Name'
          onChangeText={(text) => this.setState({name: text})}
          value={this.state.name}
        />
        <TextInput
          placeholder='Phone'
          keyboardType='numeric'
          onChangeText={(text) => this.setState({phone: text})}
          value={this.state.phone}
        />
        <TextInput
          placeholder='Note'
          multiline={true}
          numberOfLines={3}
          onChangeText={(text) => this.setState({note: text})}
          value={this.state.note}
        />
        </View>
      </View>
    );
  }

  getActions() {
    return [{title: 'Save', show: 'always'}];
  }

  onActionSelected(position) {
    // console.log('on action selected');
    if (position === 0) { // index of 'Settings'
      this.save();
    }
  }

  save() {
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
        this.closePage();
      });
     }
  }
}

module.exports = ContactCreate;
