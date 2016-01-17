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
  Text,
  ToolbarAndroid,
  TouchableHighlight,
  View,
} = React;

var contactService = require('../service.js');
//var ContactCreate = require('./create.js');
var Hello = require('./hello.js');

var ContactList = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1.contact_id !== row2.contact_id,
      }),
      loaded: false,
    };
  },
  componentDidMount: function() {
    this.fetchData();
  },
  fetchData: function() {
    console.log('fetchData');
    contactService.list().then((contacts) => {
        console.log('contacts', contacts);

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(contacts),
          loaded: true,
        });
    }).done();
  },
  render: function() {
    console.log('render list');
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View>
        <ToolbarAndroid
         title="Contact List"
         style={styles.toolbar}
         actions={[{title: 'Add', show: 'always'}]}
         onActionSelected={this.onActionSelected} />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderContact}
          style={styles.listView}
        />
      </View>
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading contacts...
        </Text>
      </View>
    );
  },

  renderContact: function(contact) {
    return (
      <TouchableHighlight onPress={() => this.gotoContactCreate(contact)}>
        <View style={styles.container}>
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{contact.name}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },
  gotoContactCreate: function(contact) {
    console.log(`contact clicked `, contact);
    this.props.navigator.push({
        name: 'contact.create',
        contact: contact,
      });
  },
  onActionSelected: function(position) {
    console.log('on list action selected');
    if (position === 0) { // index of 'Settings'
      this.gotoContactCreate();
    }
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
  flex: 1,
},
  toolbar: {
    backgroundColor: '#9999ff',
    height: 56,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
  },
});

module.exports = ContactList;