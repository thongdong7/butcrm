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

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#9999ff',
    height: 56,
  },
});

var Hello = React.createClass({
    render: function() {
        return (
          <View>
            <ToolbarAndroid
               title="Hello"
               style={styles.toolbar}
               actions={[{title: 'Save', show: 'always'}]}
               onActionSelected={this._goToWorld} />
            <TouchableHighlight onPress={this._goToWorld}>
              <Text>Hello is me</Text>
            </TouchableHighlight>
          </View>
        );
    },
    _goToWorld: function() {
      this.props.navigator.push({
        name: 'contact.create'
      });
    }
});

module.exports = Hello;
