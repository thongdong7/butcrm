import React, {
  Image,
  ListView,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  Text,
  TextInput,
  ToolbarAndroid,
  View,
} from 'react-native'

import ContactList from './List';
import dismissKeyboard from 'dismissKeyboard';
import contactService from "./service";
import DefaultPage from '../BasicPage';
import TagAutoComplete from '../Tag';

var styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#9999ff',
    height: 56,
  },
});

export default class ContactCreate extends DefaultPage {
  constructor(props) {
    super(props);

    let state = {
      contact_id: undefined,
      name: null,
      phone: null,
      note: null,
      tag_ids: []
    }

    let route = this.props.route;
    if (route && route.contact) {
      for (let f in route.contact) {
        state[f] = route.contact[f];
      }
    }

    if (state.contact_id) {
      state.loadingTag = true;
    } else {
      state.loadingTag = false;
    }

    this.state = state;
    this._loadData();
    this.types = [
      {
          id: 1,
          name: "Dang co nhu cau"
      },
      {
          id: 2,
          name: "Mua o"
      },
      {
          id: 3,
          name: "Dau tu"
      },
      {
          id: 4,
          group: 1,
          name: "Nam"
      },
      {
          id: 5,
          group: 1,
          name: "Nu"
      }
    ];
  }

  async _loadData() {
    let contactTypes = await contactService.getContactType();

    if (this.state.contact_id) {

      // Load tag_ids
      let tagIds = await contactService.getTagIds(this.state.contact_id);
      this.setState({tag_ids: tagIds, loadingTag: false});
    }

    this.types = contactTypes;
  }

  getTitle() {
    return "Create contact";
  }

  renderContent() {
    let tagAutoComplete;
    if (this.state.loadingTag) {
      tagAutoComplete = <Text>Loading tags...</Text>;
    } else {
      tagAutoComplete = <TagAutoComplete ref="tag" data={this.types} selected={this.state.tag_ids}/>
    }
    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}
            keyboardShouldPersistTaps={true}>
            <View style={{padding: 15, flex: 1}}>
            <TextInput
              autoCapitalize='words'
              placeholder='Name'
              onChangeText={(text) => this.setState({name: text})}
              value={this.state.name}
            />
            <TextInput
              placeholder='Phone'
              keyboardType='numeric'
              onChangeText={(text) => this.setState({phone: text})}
              value={this.state.phone}
            />
            {tagAutoComplete}
            <TextInput
              placeholder='Note'
              multiline={true}
              numberOfLines={3}
              onChangeText={(text) => this.setState({note: text})}
              value={this.state.note}
            />
            </View>
            <View style={{paddingBottom: 300}} />
        </ScrollView>
      </View>
    );
  }

  getActions() {
    return [{title: 'Save', show: 'always'}];
  }

  onActionSelected(position) {
    // console.log('on action selected');
    if (position === 0) { // index of 'Settings'
      this.save();
    }
  }

  async save() {
    if (this.state.name) {
      dismissKeyboard();
      let contact = {};
      for (let f in this.state) {
        if (f == "tag_ids" || f == "loadingTag") {
          continue;
        }

        contact[f] = this.state[f];
      }

      await contactService.create(contact, this.refs.tag.selectedTags());

      let msg;
      if (this.state.contact_id) {
        msg = `Updated ${this.state.name}`;
      } else {
        msg = `Added ${this.state.name} to list`;
      }

      ToastAndroid.show(msg, ToastAndroid.SHORT);
      // close this page page
      this.closePage();
    }
  }
}
