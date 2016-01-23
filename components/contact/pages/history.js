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
  ToastAndroid,
  ToolbarAndroid,
  TouchableHighlight,
  View,
} = React;

var emitter = require('../../event');

var CallHistoryAndroid = require('../../CallHistoryAndroid');
var contactService = require('../service.js');
var moment = require('moment');

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10
  },
  rightContainer: {
    marginLeft: 10,
  },
  toolbar: {
    backgroundColor: '#9999ff',
    height: 56,
  },
  listView: {
    paddingTop: 20,
  },
  phone: {
    fontSize: 20,
    textAlign: 'right',
  },
  callDate: {
    fontSize: 10,
    textAlign: 'right',
  },
  callType: {
    fontSize: 10,
    textAlign: 'right',
  },
});

// Only show last 20 calls
var limit = 20;

var CallHistory = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1.phone !== row2.phone,
      }),
      loaded: false
    };
  },
  componentDidMount: function() {
    emitter.addListener('contact.service.ready', this._fetchData);

    this._fetchData();
  },
  _fetchData: function() {
    if (!contactService.isReady()) {
      console.log('contact service is not ready');
      return;
    }

    console.log('fetch data');
    // ToastAndroid.show("fetch data", ToastAndroid.SHORT);

    CallHistoryAndroid.getUnknownCalls(limit, (data) => {
      // Get contacts base on this phones
      // ToastAndroid.show("have unknown call", ToastAndroid.SHORT);
      let phones = [];
      for (let i in data) {
        phones.push(data[i].phone);
      }

      // ToastAndroid.show("load our contact by phones, "+phones[0], ToastAndroid.SHORT);
      contactService.getByPhones(phones).then((phoneMap) => {
        console.log('phone map2', phoneMap)
        // ToastAndroid.show("merge with contact", ToastAndroid.SHORT);
        for (let i in data) {
          let phone = data[i].phone;
          if (phoneMap[phone] != undefined) {
            data[i].name = phoneMap[phone].name;
            data[i].contact = phoneMap[phone];
          }
        }
        // ToastAndroid.show("merge with contact2", ToastAndroid.SHORT);

        return data;
      }).then((data) => {
        // ToastAndroid.show("apply phone map", ToastAndroid.SHORT);
        console.log('apply phone map', data);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data),
          loaded: true
        });
      });
    });
  },
  render: function() {
    var content = !this.state.loaded ? this._renderLoadingView() :
      <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderCall}
          style={styles.listView}
          automaticallyAdjustContentInsets={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
          showsVerticalScrollIndicator={false}
        />;

    return (
      <View style={styles.container}>
        <ToolbarAndroid
          title="Call History"
          actions={[{title: 'Refresh', show: 'always'}]}
          onActionSelected={this._onActionSelected}
          style={styles.toolbar} />
        {content}
      </View>
    );
  },
  _onActionSelected: function(position) {
    if (position === 0) { // index of 'Settings'
      this._fetchData();
    }
  },
  _renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
      </View>
    );
  },
  _renderCall: function(call) {
    return (
      <TouchableHighlight
        onPress={() => this._onCallSelected(call)}>
        <View style={styles.itemContainer}>
          <View style={styles.rightContainer}>
            <Text style={styles.name}>{call.name}</Text>
            <Text style={styles.phone}>{call.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</Text>
            <Text style={styles.callDate}>{moment(call.date).fromNow()}</Text>
            <Text style={styles.callType}>{call.type}</Text>

          </View>
        </View>
      </TouchableHighlight>
    );
  },
  _onCallSelected: function(call) {
    let contact;
    if (call.contact) {
      contact = call.contact;
    } else {
      contact = {
        phone: call.phone
      }
    }

    this.props.navigator.push({
      name: 'contact.create',
      contact: contact
    })
  }
});

module.exports = CallHistory;
