// src/utils/safeStorage.js
export const safeJsonParse = (data, defaultValue = null) => {
  if (!data) return defaultValue;
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
};

export const safeAsyncStorageGet = async (key, defaultValue = null) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return safeJsonParse(value, defaultValue);
  } catch (error) {
    console.error(`AsyncStorage get error for key ${key}:`, error);
    return defaultValue;
  }
};

export const safeAsyncStorageSet = async (key, value) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    console.error(`AsyncStorage set error for key ${key}:`, error);
    return false;
  }
};