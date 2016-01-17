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
  TextInput,
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

var World = React.createClass({
    render: function() {
        return (
          <View>
            <ToolbarAndroid
               title="World"
               style={styles.toolbar}
               actions={[{title: 'Create', show: 'always'}]}
               onActionSelected={this._goToHello} />

            <View style={{padding: 15, flex: 1}}>
            <TextInput
              autoCapitalize='words'
              placeholder='Name'
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            />
            <TextInput
              placeholder='Phone'
              keyboardType='numeric'
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            />
            </View>
          </View>
            );
    },
    _goToHello: function() {
      this.props.navigator.push({
        name: 'hello'
      });
    }
});

module.exports = World;
