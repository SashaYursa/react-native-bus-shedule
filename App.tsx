import React from 'react';
import Navigation from './src/navigation/Navigation';
import { Provider } from 'react-redux';
import { persistor, store } from './src/store';
import { PersistGate } from 'redux-persist/integration/react';

const App: React.FC = () => {
  return(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Navigation/>
      </PersistGate>
    </Provider>
  )

}

export default App;