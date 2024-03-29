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
  PullToRefreshViewAndroid,
  StyleSheet,
  Text,
  ToolbarAndroid,
  TouchableHighlight,
  View,
} = React;

var emitter = require('../../event');

var contactService = require('../service');
var DefaultPage = require('../../common/pages/default.js');
//var ContactCreate = require('./create.js');
// var Hello = require('./hello.js');

class ContactList extends DefaultPage {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isRefreshing: false,
      loaded: false,
    };
  }

  getTitle() {
    return "Contact list";
  }

  getActions() {
    return [{title: 'Add', show: 'always'}];
  }

  componentDidMount() {
    emitter.addListener('contact.service.ready', this._fetchData.bind(this));

    this._fetchData();
  }

  async _fetchData() {
    // console.log('fetchData1');
    this.setState({isRefreshing: true})

    let contacts = await contactService.list();

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(contacts),
      isRefreshing: false,
      loaded: true,
    });
    // console.log('fetch data and set state completed');
  }

  renderContent() {
    // console.log('render list3');
    var content = !this.state.loaded ? this._renderLoadingView() :
      <PullToRefreshViewAndroid
        style={styles.layout}
        refreshing={this.state.isRefreshing}
        onRefresh={this._fetchData.bind(this)}
        >
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderContact.bind(this)}
            style={styles.listView}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
          />
      </PullToRefreshViewAndroid>;

    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  }

  _renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading contacts...
        </Text>
      </View>
    );
  }

  _renderContact(contact) {
    return (
      <TouchableHighlight onPress={() => this.gotoContactCreate(contact)}>
        <View style={styles.itemContainer}>
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{contact.name}</Text>
            <Text style={styles.phone}>{contact.phone}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  gotoContactCreate(contact) {
    console.log(`contact clicked `, contact);
    this.props.navigator.push({
        name: 'contact.create',
        contact: contact,
        callback: this._fetchData.bind(this)
      });
  }

  onActionSelected(position) {
    // console.log('on list action selected1');
    if (position === 0) { // index of 'Settings'
      this.gotoContactCreate();
    }
  }
}

var styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  rightContainer: {
    paddingTop: 5,
    marginLeft: 10,
  },
  toolbar: {
    backgroundColor: '#9999ff',
    height: 56,
  },
  listView: {
//    paddingTop: 20,
//    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    width: 53,
    height: 81,
  },
  title: {
    fontSize: 20,
    textAlign: 'right',
  },
  phone: {
    fontSize: 10,
    textAlign: 'right',
  },
  year: {
    textAlign: 'center',
  },
});

module.exports = ContactList;
