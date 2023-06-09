import { useState } from "react";
import {
  TextInput,
  View,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { authSignInUser } from "../../redux/auth/authOperations";

import { styles } from "./Screens.styles.js";

const initialState = {
  email: "",
  password: "",
};

function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [passwordShow, setPasswordShow] = useState(true);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [state, setState] = useState(initialState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const keyboardHiden = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const isInputFocus = (inputName) => {
    setIsShowKeyboard(true);
    setFocusedInput(inputName);
  };

  const isInputBlur = () => {
    setIsShowKeyboard(false);
    setFocusedInput(null);
  };

  const isInputFocused = (inputName) => focusedInput === inputName;

  const onSubmit = () => {
    dispatch(authSignInUser({ email, password }));
    setEmail("");
    setPassword("");
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHiden}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.bgImage}
          source={require("../../image/bg.jpg")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.wrapperLogin}>
              <Text style={styles.title}>Увійти</Text>
              <View
                style={{
                  ...styles.form,
                  marginBottom: isShowKeyboard ? -110 : 78,
                }}
              >
                <View style={{ marginBottom: 16 }}>
                  <TextInput
                    style={[
                      styles.input,
                      isInputFocused("email") && styles.inputFocus,
                    ]}
                    placeholder="Адреса електронної пошти"
                    onFocus={() => isInputFocus("email")}
                    onBlur={isInputBlur}
                    onChangeText={(value) => setEmail(value)}
                    value={email}
                  />
                </View>
                <View style={{ marginBottom: 43 }}>
                  <TextInput
                    style={[
                      styles.input,
                      isInputFocused("password") && styles.inputFocus,
                    ]}
                    placeholder="Пароль"
                    secureTextEntry={passwordShow}
                    onFocus={() => isInputFocus("password")}
                    onBlur={isInputBlur}
                    onChangeText={(value) => setPassword(value)}
                    value={password}
                  />
                  <Pressable
                    onPress={() => setPasswordShow(!passwordShow)}
                    style={styles.btnPassword}
                  >
                    {passwordShow ? (
                      <Text style={styles.passwordText}>Показати</Text>
                    ) : (
                      <Text style={styles.passwordText}>Приховати</Text>
                    )}
                  </Pressable>
                </View>
                <Pressable style={styles.button} onPress={onSubmit}>
                  <Text style={styles.buttonText}>Увійти</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("Registration")}>
                  <Text style={styles.textLogin}>
                    Немає акаунту? Зареєструватися
                  </Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default LoginScreen;
