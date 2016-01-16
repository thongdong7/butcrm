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
  TouchableHighlight,
  View,
} = React;

var contactService = require('../service.js');
var ContactCreate = require('./create.js');
var Hello = require('./hello.js');

var ContactList = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
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
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderContact}
        style={styles.listView}
      />
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
        title: contact.name,
        component: 'contact.create',
        // contact: contact,
      });
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
