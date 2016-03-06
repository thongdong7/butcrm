'use strict';

var React = require('react-native');

var {
  StyleSheet,
  TouchableHighlight,
  Image,
  View,
} = React;


var styles = StyleSheet.create({
  backButton: {
    width: 10,
    height: 17,
    marginLeft: 10,
    marginTop: 3,
    marginRight: 10
  }
});


var BackButton = React.createClass({
  render() {
    console.log('render back BackButton.js')
    return (
      <Image source={require('../images/back_button.png')} style={styles.backButton} />
    )
  }
});

module.exports = BackButton;
