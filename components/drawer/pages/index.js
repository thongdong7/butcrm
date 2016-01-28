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
  TouchableNativeFeedback,
  View,
} = React;

var styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: "#eeeeee"
  },
  listRow: {
    flex: 1,
  },
  listRowText: {
    paddingTop: 10,
    marginLeft: 10,
    fontSize: 20,
    flex: 1,
  }
});

let menuItems = [
  {name: "Contact List", route: "contact.list"},
  {name: "Contact Create", route: "contact.create"},
  {name: "Call History", route: "contact.history"},
];

var Menu = React.createClass({
  getInitialState: function() {
    let dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    dataSource = dataSource.cloneWithRows(menuItems);

    return {
      dataSource: dataSource
    };
  },
  render: function() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderMenuItem.bind(this)}
        style={styles.layout}
      />
    );
  },
  renderMenuItem: function(menuItem) {
    return (
          <TouchableNativeFeedback
        onPress={() => {this._onPressButton(menuItem)}}
        background={TouchableNativeFeedback.SelectableBackground()}>
    <View style={styles.listRow}>
      <Text style={styles.listRowText}>{menuItem.name}</Text>
    </View>
    </TouchableNativeFeedback>
    );
  },
  _onPressButton: function(menuItem) {
    console.log('menu selected', menuItem, this.props);

    if (this.props.navigatorProvider) {
      this.props.navigatorProvider().push({
        name: menuItem.route,
      })
    }

    this.props.hideDrawer();
  }
});

module.exports = Menu;
