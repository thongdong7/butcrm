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

var styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "#eeeeee"
  },
});

var Menu = React.createClass({
  render: function() {
    return (
      <View style={styles.layout}>
        <Text>Hello World</Text>
      </View>
    );
  },
});

module.exports = Menu;
