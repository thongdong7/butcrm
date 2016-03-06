import React, {
  Image,
  ListView,
  PullToRefreshViewAndroid,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableHighlight,
  View,
} from 'react-native'

import Emitter from '../Emitter'

import CallHistoryAndroid from '../CallHistoryAndroid'
import ContactService from './Service'
import moment from 'moment'

import DefaultPage from '../BasicPage'

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  layout: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 5
  },
  rightContainer: {
    marginLeft: 10,
  },
  toolbar: {
    backgroundColor: '#9999ff',
    height: 56,
  },
  listView: {
    // paddingTop: 20,
  },
  phone: {
    fontSize: 20,
    textAlign: 'right',
  },
  callDate: {
    fontSize: 10,
    textAlign: 'right',
  },
  callType: {
    fontSize: 10,
    textAlign: 'right',
  },
});

// Only show last 20 calls
var limit = 20;

export default class CallHistory extends DefaultPage {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isRefreshing: false,
      loaded: false
    };
  }

  getTitle() {
    return "Call History";
  }

  componentDidMount() {
    // console.log('componentDidMount')
    Emitter.addListener('contact.service.ready', this._fetchData.bind(this));

    this._fetchData();
  }

  _fetchData() {
    this.setState({
      isRefreshing: true
    })
    if (!ContactService.isReady()) {
      // console.log('contact service is not ready');
      return;
    }

    // console.log('fetch data');

    CallHistoryAndroid.getUnknownCalls(limit, (data) => {
      // Get contacts base on this phones
      let phones = [];
      for (let i in data) {
        phones.push(data[i].phone);
      }

      ContactService.getByPhones(phones).then((phoneMap) => {
       // console.log('phone map2')
        for (let i in data) {
          let phone = data[i].phone;
          if (phoneMap[phone] != undefined) {
            data[i].name = phoneMap[phone].name;
            data[i].contact = phoneMap[phone];
          }
        }

        return data;
      }).then((data) => {
       // console.log('apply phone map');
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data),
          isRefreshing: false,
          loaded: true
        });

        // console.log('fetch data completed');
      });
    });
  }

  renderContent() {
    // console.log('render history.js2', this.state.loaded);
    var content = !this.state.loaded ? this._renderLoadingView() :
      <PullToRefreshViewAndroid
        style={styles.layout}
        refreshing={this.state.isRefreshing}
        onRefresh={this._fetchData.bind(this)}
        >
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderCall.bind(this)}
            style={styles.listView}
            automaticallyAdjustContentInsets={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps={true}
            showsVerticalScrollIndicator={false}
          />
      </PullToRefreshViewAndroid>;

    return content;
  }

  _renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
        </Text>
      </View>
    );
  }

  _renderCall(call) {
    return (
      <TouchableHighlight
        onPress={() => this._onCallSelected(call)}>
        <View style={styles.itemContainer}>
          <View style={styles.rightContainer}>
            <Text style={styles.name}>{call.name}</Text>
            <Text style={styles.phone}>{call.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}</Text>
            <Text style={styles.callDate}>{moment(call.date).fromNow()}</Text>
            <Text style={styles.callType}>{call.type}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  _onCallSelected(call) {
    let contact;
    if (call.contact) {
      contact = call.contact;
    } else {
      contact = {
        phone: call.phone
      }
    }

    this.props.navigator.push({
      name: 'contact.create',
      contact: contact,
      callback: this._fetchData.bind(this)
    })
  }
}
