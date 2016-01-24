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
  PullToRefreshViewAndroid,
  StyleSheet,
  Text,
  ToolbarAndroid,
  TouchableHighlight,
  View,
} = React;

var emitter = require('../../event');

var contactService = require('../service');
//var ContactCreate = require('./create.js');
// var Hello = require('./hello.js');

var ContactList = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isRefreshing: false,
      loaded: false,
    };
  },
  componentDidMount: function() {
    emitter.addListener('contact.service.ready', this._fetchData);

    this._fetchData();
  },
  _fetchData: function() {
    // console.log('fetchData1');
    this.setState({isRefreshing: true})
    contactService.list().then((contacts) => {
        console.log('contacts', contacts);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(contacts),
          isRefreshing: false,
          loaded: true,
        });
        console.log('fetch data and set state completed', this.state.dataSource);
    }).done();
  },
  render: function() {
    console.log('render list3', this.state.dataSource);
    var content = !this.state.loaded ? this._renderLoadingView() :
      <PullToRefreshViewAndroid
        style={styles.layout}
        refreshing={this.state.isRefreshing}
        onRefresh={this._fetchData}
        >
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderContact}
            style={styles.listView}
            automaticallyAdjustContentInsets={true}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
          />
      </PullToRefreshViewAndroid>;

    return (
      <View style={styles.container}>
        <ToolbarAndroid
           title="Contact List"
           style={styles.toolbar}
           actions={[{title: 'Add', show: 'always'}]}
           onActionSelected={this.onActionSelected} />
        {content}
      </View>
    );
  },
  _renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading contacts...
        </Text>
      </View>
    );
  },

  _renderContact: function(contact) {
    return (
      <TouchableHighlight onPress={() => this.gotoContactCreate(contact)}>
        <View style={styles.itemContainer}>
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{contact.name}</Text>
            <Text style={styles.phone}>{contact.phone}</Text>
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
    console.log('on list action selected1');
    if (position === 0) { // index of 'Settings'
      this.gotoContactCreate();
    }
  },
});

var styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  rightContainer: {
    paddingTop: 5,
    marginLeft: 10,
  },
  toolbar: {
    backgroundColor: '#9999ff',
    height: 56,
  },
  listView: {
//    paddingTop: 20,
//    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  title: {
    fontSize: 20,
    textAlign: 'right',
  },
  phone: {
    fontSize: 10,
    textAlign: 'right',
  },
  year: {
    textAlign: 'center',
  },
});

module.exports = ContactList;
