'use strict';

import ContactCreate from './Components/Contact/Create';
import ContactList from './Components/Contact/List';
import CallHistory from './Components/Contact/History';

import NavigationBar from './Components/Drawer';
import DefaultPage from './Components/BasicPage';

import Drawer from 'react-native-drawer'

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

var dismissKeyboard = require('dismissKeyboard');

class ButCRMApp extends React.Component {
  closeControlPanel() {
    this.refs.drawer.close()
  }

  openControlPanel() {
    this.refs.drawer.open()
  }

  render() {
    console.log('render app');

    // Don't know why the keyboard is showed when application started,
    // Workaround: call dismissKeyboard
    dismissKeyboard();

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
