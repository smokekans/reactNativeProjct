import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useFonts } from "expo-font";
import MainRoute from "./MainRoute";



export default function App() {
  const [fonts] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  });

  if (!fonts) {
    return null;
  }

  return (
    <Provider store={store}>
      <MainRoute />
    </Provider>
  );
}
