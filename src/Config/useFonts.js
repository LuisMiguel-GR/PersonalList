import * as Font from 'expo-font';

const loadSunshineFont = () => {
  return Font.loadAsync({
    'Pacifico': require('./../../assets/fonts/Pacifico.ttf'),
  });
};

export default loadSunshineFont;
