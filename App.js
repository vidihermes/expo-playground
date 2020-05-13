import React                                                                   from 'react';
import {Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Axios                                                                   from "axios";

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    input: '',
  };

  async componentDidMount() {
    await this.getInitialData();
  }

  async getInitialData() {
    try {
      const response = await Axios.get('http://167.71.195.177/api/todo/');
      await this.setState({todos: [...response.data.data]});
    } catch (e) {
      await this.setState({error: 'failed to get data'});
    }
  }

  async handleTextChange(enteredText) {
    await this.setState({input: enteredText});
  }

  async handleItemPress(id) {
    try {
      const response = await Axios.get('http://167.71.195.177/api/todo/delete/' + id);
      console.log(response.data);
    } catch (e) {
      await this.setState({error: 'failed to get data'});
      console.log(this.state.error);
    }
    await this.getInitialData();
  }

  async handleSubmit() {
    if (this.state.input.length > 0) {
      try {
        const response = await Axios.post('http://167.71.195.177/api/todo/create', {title: this.state.input});
        console.log(response.data);
        await this.getInitialData();
      } catch (e) {
        await this.setState({error: 'failed to get data'});
        console.log(this.state.error);
      }
    }
    await this.setState({
      input: ''
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <TextInput style={styles.input} placeholder={'input new todo'} value={this.state.input}
                     onChangeText={this.handleTextChange.bind(this)}/>
          <View style={styles.itemWrapper}>
            <Button title={"Save"} onPress={this.handleSubmit.bind(this)}/>
          </View>
          <View style={styles.itemWrapper}>
            <Button title={"Refresh"} onPress={this.getInitialData.bind(this)}/>
          </View>
        </View>
        <FlatList data={this.state.todos} keyExtractor={item => item.id.toString()} renderItem={itemData => (
          <TouchableOpacity onPress={this.handleItemPress.bind(this, itemData.item.id)}>
            <View style={styles.itemWrapper}>
              <Text>
                {itemData.item.title}
              </Text>
            </View>
          </TouchableOpacity>)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container  : {
    flex           : 1,
    backgroundColor: '#fff',
    alignItems     : 'center',
    justifyContent : 'center',
    paddingVertical: 50
  },
  itemWrapper: {
    paddingVertical: 10,
  },
  formWrapper: {
    width: '100%'
  },
  input      : {
    borderColor   : '#000',
    width         : '100%',
    borderWidth   : 1,
    padding       : 10,
    marginVertical: 10
  },
});
