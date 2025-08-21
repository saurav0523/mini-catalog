import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from './index';
import { RootState } from './index';

const PERSISTENCE_KEY = 'mini-catalog-state';

export const persistState = async () => {
  try {
    const state = store.getState();
    await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to persist state:', error);
  }
};

export const restoreState = async (): Promise<Partial<RootState> | null> => {
  try {
    const persistedState = await AsyncStorage.getItem(PERSISTENCE_KEY);
    if (persistedState) {
      return JSON.parse(persistedState);
    }
  } catch (error) {
    console.error('Failed to restore state:', error);
  }
  return null;
};

export const clearPersistedState = async () => {
  try {
    await AsyncStorage.removeItem(PERSISTENCE_KEY);
  } catch (error) {
    console.error('Failed to clear persisted state:', error);
  }
};
