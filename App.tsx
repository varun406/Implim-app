import React from 'react';
import {Appearance} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import RootNavigator from './src/navigators/RootNavigator';
import {persistor, store} from './src/redux/store';
import Config from 'react-native-config';

function App(): React.JSX.Element {
  const colorScheme = Appearance.getColorScheme();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{flex: 1}}>
          <RootNavigator />
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

export default App;
