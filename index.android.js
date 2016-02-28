/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var ContactCreate = require('./components/contact/pages/create.js');
var ContactList = require('./components/contact/pages/list.js');
var CallHistory = require('./components/contact/pages/history.js');
var Hello = require('./components/contact/pages/hello.js');
var World = require('./components/contact/pages/world.js');
var NavigationBar = require('./components/drawer/pages/index.js');
var DefaultPage = require('./components/common/pages/default.js');

var BackButton = require('./components/BackButton');

var Drawer = require('react-native-drawer')

var React = require('react-native');
var {
  AppRegistry,
  BackAndroid,
  Navigator,
  StyleSheet,
  ToolbarAndroid,
  View
} = React;

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

var routes = {
  'hello': {
    title: 'Hello',
    component: Hello
  },
  'world': {
    title: 'World',
    component: World
  },
  'contact.create': {
    title: 'Create contact',
    component: ContactCreate
  },
  'contact.list': {
    title: 'Contact List',
    component: ContactList
  },
  'contact.history': {
    title: 'Call History',
    component: CallHistory,
    toolbar: {
      actions: [
        {title: 'Refresh', show: 'always'}
      ]
    }
  }
}

class ButCRMApp extends React.Component {
  closeControlPanel() {
    this.refs.drawer.close()
  }

  openControlPanel() {
    this.refs.drawer.open()
  }

  render() {
    console.log('render app');
    var initialRoute = {name: 'contact.list'};
    let title;
    if (this.state && this.state.title) {
      title = this.state.title;
    }
    return (
      <Drawer
        ref="drawer"
        tapToClose={true}
        type="static"
        content={<NavigationBar hideDrawer={this._hideDrawer.bind(this)} navigatorProvider={this._getNavigator.bind(this)} />}
        openDrawerOffset={100}
        styles={{main: {shadowColor: "#000000", shadowOpacity: 0.4, shadowRadius: 3}}}
        tweenHandler={Drawer.tweenPresets.parallax}
        >
        <Navigator
          style={styles.container}
          initialRoute={initialRoute}
          renderScene={this._routeMapper.bind(this)}
        />
      </Drawer>
    );
  }

  _getNavigator() {
    return _navigator;
  }

  _hideDrawer() {
    this.refs.drawer.close();
  }

  _routeMapper(route, navigationOperations, onComponentRef) {
    _navigator = navigationOperations;

    let routeConfig = routes[route.name];
    let ContentComponent = routeConfig.component;

    return (
        <ContentComponent navigator={navigationOperations} route={route} onNavIconClicked={this._onNavIconClicked.bind(this)}/>
    );
  }

  _onActionSelected() {
    console.log('action selected')
  }

  _onNavIconClicked() {
    console.log('nav icon clicked2');
    // console.log('drawer', this.refs.drawer);
    this.refs.drawer.toggle();
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    backgroundColor: '#a9a9a9',
    height: 56,
  },
  header: {
    backgroundColor: '#5cafec'
  }
});

AppRegistry.registerComponent('butCRM', () => ButCRMApp);
