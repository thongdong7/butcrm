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

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#9999ff',
    height: 56,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  phone: {
    fontSize: 10,
//    marginBottom: 8,
    textAlign: 'right',
  },
});

var CallHistory = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      name: null,
    };
  },
  componentDidMount: function() {
    CallHistoryAndroid.getAll((data) => {
      console.log(data);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
        name: 'data'
      });
    });
  },
  render: function() {
    return (
      <View>
        <ToolbarAndroid
           title="Hello1"
           style={styles.toolbar}
           actions={[{title: 'Save', show: 'always'}]}
           onActionSelected={this._goToWorld} />
          <Text>Hello is me: {this.state.name}</Text>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderContact}
            style={styles.listView}
          />
      </View>
    );
  },
  renderContact: function(call) {
    return (
      <TouchableHighlight>
        <View style={styles.container}>
          <View style={styles.rightContainer}>
            <Text style={styles.phone}>{call.phone}</Text>
            <Text style={styles.phone}>{call.type}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },
});

module.exports = CallHistory;
