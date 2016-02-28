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
//    console.log('default render');

    return (
      <View style={styles.container}>
        <ToolbarAndroid
          ref="toolbar"
          navIcon={require('../../../images/menu.png')}
          onIconClicked={this._onNavIconClicked.bind(this)}
          actions={this.getActions()}
          onActionSelected={this.onActionSelected.bind(this)}
          title={this.getTitle()}
          style={styles.toolbar} />
        {this.renderContent()}
      </View>
    );
  }

  getTitle() {
    return "";
  }

  getActions() {
    return [];
  }

  renderContent() {
    return (
      <Text>Put your content here</Text>
      );
  }

  onActionSelected(position) {
    console.log('action selected', position)
  }

  _onNavIconClicked() {
   console.log('nav icon clicked');
    // this.refs.drawer.toggle();
    if (this.props.onNavIconClicked) {
      this.props.onNavIconClicked();
    }
  }

  closePage() {
    if (this.props.route && this.props.route.callback) {
      this.props.route.callback();
    }

    if (this.props.navigator) {
      this.props.navigator.pop();
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
