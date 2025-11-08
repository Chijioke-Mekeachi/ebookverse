import { registerRootComponent } from 'expo';
import App from './App';

// Ensures the main component (App) is registered correctly,
// whether running in Expo Go or as a standalone native build.
registerRootComponent(App);
export default App;