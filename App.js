import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import TodosApp from './Buoi5/TodosApp';
import firestore from '@react-native-firebase/firestore';

const App = () => {
  const ref = firestore().collection('todos');
  return (
    <PaperProvider>
      <TodosApp />
    </PaperProvider>
  );
};

export default App;