import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Appbar, TextInput, Button, Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Todo from './Todo';

const TodosApp = () => {
  const [todo, setTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const ref = firestore().collection('todos');

  useEffect(() => {
    const unsubscribe = ref.onSnapshot(snapshot => {
      const items = [];
      snapshot.forEach(doc => {
        const { title, complete } = doc.data();
        items.push({ id: doc.id, title, complete });
      });
      setTodos(items);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addTodo = async () => {
    if (todo.trim() === '') return;
    await ref.add({ title: todo, complete: false });
    setTodo('');
  };

  const toggleComplete = async (id, current) => {
    await ref.doc(id).update({ complete: !current });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#2196f3' }}>
        <Appbar.Content title="TODOs List" color="#fff" />
      </Appbar.Header>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={todos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Todo {...item} />}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          label="New Todo"
          value={todo}
          onChangeText={setTodo}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={addTodo}
          style={[styles.addButton, { backgroundColor: '#2196f3' }]}
          contentStyle={{ height: 48 }}
          labelStyle={{ fontWeight: 'bold' }}
        >
          ADD TODO
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  list: { flex: 1 },
  todoText: { fontSize: 18, marginBottom: 8, color: '#222' },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: 12,
    backgroundColor: '#f3e6fa',
    borderTopWidth: 1,
    borderColor: '#e1bee7',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1bee7',
    width: '100%',
    marginBottom: 10,
  },
  addButton: {
    borderRadius: 6,
    elevation: 2,
    backgroundColor: '#9c27b0',
    width: '100%',
  },
});

export default TodosApp;