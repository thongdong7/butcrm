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

var CallHistoryAndroid = require('../../CallHistoryAndroid');
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
    CallHistoryAndroid.getUnknownCalls(limit, (data) => {
      console.log(data);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
        loaded: true
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
           style={styles.toolbar} />
        {content}
      </View>
    );
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
      <TouchableHighlight>
        <View style={styles.itemContainer}>
          <View style={styles.rightContainer}>
            <Text style={styles.phone}>{call.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</Text>
            <Text style={styles.callDate}>{moment(call.date).fromNow()}</Text>
            <Text style={styles.callType}>{call.type}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },
});

module.exports = CallHistory;
