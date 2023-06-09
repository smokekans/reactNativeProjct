import { useState } from "react";
import {
  TextInput,
  View,
  ImageBackground,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import Icon from "../../image/icon.svg.js";
import AddIcon from "../../image/add.svg.js";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { authSignUpUser } from "../../redux/auth/authOperations.jsx";
import { storage } from "../../firebase/config.js";

import { styles } from "./Screens.styles.js";


function RegistrationScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [passwordShow, setPasswordShow] = useState(true);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

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

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
  };

  const uploadPhoto = async () => {
    let imageRef;

    if (avatar) {
      const response = await fetch(avatar);
      const file = await response.blob();
      const uniqueAvatarId = Date.now().toString();
      imageRef = ref(storage, `userAvatars/${uniqueAvatarId}`);
      await uploadBytes(imageRef, file);
    }

    const processedPhoto = await getDownloadURL(imageRef);
    return processedPhoto;
  };

  const onSubmit = async () => {
    const photo = await uploadPhoto();
    dispatch(authSignUpUser({ login, email, password, avatar: photo }));
    setLogin("");
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
            <View style={styles.wrapper}>
              <View style={styles.avatar}>
               <Image source={{ uri: avatar }} style={styles.avatarImage} />
                {!avatar ? (
                  <TouchableOpacity
                    style={styles.buttonIcon}
                    activeOpacity={0.9}
                    onPress={pickAvatar}
                  >
                    <AddIcon />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.btnRemoveAvatar}
                    activeOpacity={0.9}
                    onPress={removeAvatar}
                  >
                    <Icon />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.title}>Реєстрація</Text>
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
                      isInputFocused("login") && styles.inputFocus,
                    ]}
                    placeholder="Логін"
                    onFocus={() => isInputFocus("login")}
                    onBlur={isInputBlur}
                    onChangeText={(value) => setLogin(value)}
                    value={login}
                  />
                </View>
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
                  <Text style={styles.buttonText}>Зареєстуватися</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.text}>Вже є акаунт? Увійти</Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default RegistrationScreen;
