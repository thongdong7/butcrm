'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  ToolbarAndroid,
  View,
} = React;

class DefaultPage extends React.Component {
  render() {
    console.log('default render');

    return (
      <View style={styles.container}>
        <ToolbarAndroid
          ref="toolbar"
          navIcon={require('../../../images/menu.png')}
          onIconClicked={this._onNavIconClicked.bind(this)}
          onActionSelected={this._onActionSelected.bind(this)}
          title={this.getTitle()}
          style={styles.toolbar} />
        {this.renderContent()}
      </View>
    );
  }

  getTitle() {
    return "";
  }

  renderContent() {
    return (
      <Text>Put your content here</Text>
      );
  }

  _onActionSelected() {
    console.log('action selected')
  }

  _onNavIconClicked() {
    console.log('nav icon clicked');
    // this.refs.drawer.toggle();
    if (this.props.onNavIconClicked) {
      this.props.onNavIconClicked();
    }
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
});

module.exports = DefaultPage;
