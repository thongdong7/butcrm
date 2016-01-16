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

var Hello = React.createClass({
    render: function() {
        return (
            <Text>Hello world</Text>
            );
    }
});

module.exports = Hello;
