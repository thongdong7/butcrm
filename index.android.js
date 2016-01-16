/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var ContactCreate = require('./components/contact/pages/create.js');
var ContactList = require('./components/contact/pages/list.js');
var React = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  Navigator,
  StyleSheet,
} = React;

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var RouteMapper = function(route, navigationOperations, onComponentRef) {
  _navigator = navigationOperations;
  if (route.name === 'contact.create') {
    return (
      <ContactCreate navigator={navigationOperations} />
    );
  } else if (route.name === 'contact.list') {
    return (
      <ContactList navigator={navigationOperations} />
    );
  }
};

var MoviesApp = React.createClass({
  render: function() {
    var initialRoute = {name: 'contact.list'};
    return (
      <Navigator
        style={styles.container}
        initialRoute={initialRoute}
        configureScene={() => Navigator.SceneConfigs.FadeAndroid}
        renderScene={RouteMapper}
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
});

AppRegistry.registerComponent('butCRM', () => MoviesApp);
