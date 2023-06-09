import React, { useEffect, useState } from "react";
import { View, Text, Image, TextInput } from "react-native";
import { Camera } from "expo-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { storage, db } from "../../firebase/config";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useSelector } from "react-redux";
import { styles } from "./Screens.styles";

const CreatePostsScreen = ({ navigation }) => {
  const [camera, setCamera] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState("");
  const [location, setLocation] = useState(null);
  const [titlePhoto, setTitlePhoto] = useState("");
  const [place, setPlace] = useState("");
  const { login, userId, avatar } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }
    })();
  }, []);

  const takePhoto = async () => {
    let locationData = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: locationData.coords.latitude,
      longitude: locationData.coords.longitude,
    };
    setLocation(coords);
    const photo = await camera.takePictureAsync();
    await MediaLibrary.createAssetAsync(photo.uri);
    setPhoto(photo.uri);
  };

  const sendPhoto = async () => {
    uploadPostToServer();
    navigation.navigate("DefaultPosts");
    setPhoto("");
    setTitlePhoto("");
    setLocation("");
    setPlace("");
  };

  const deletePhoto = () => {
    setPhoto("");
    setTitlePhoto("");
    setLocation("");
    setPlace("");
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();
    const createdDate = Date.now();

    await addDoc(collection(db, `posts`), {
      photo,
      titlePhoto,
      location,
      place,
      userId,
      login,
      avatar,
      createdDate,
      likes: 0,
    });
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Доступ до камери не наданий!</Text>;
  }

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();
    const uniquePostId = Date.now().toString();
    const imageRef = ref(storage, `postImage/${uniquePostId}`);
    await uploadBytes(imageRef, file);
    const processedPhoto = await getDownloadURL(imageRef);
    return processedPhoto;
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} ref={setCamera}>
          {photo && (
            <View style={styles.takePhotoContainer}>
              <Image
                style={{ width: "100%", height: 240, borderRadius: 8 }}
                source={{ uri: photo }}
              />
            </View>
          )}
          <TouchableOpacity onPress={takePhoto} style={styles.cameraBtn}>
            <FontAwesome name="camera" size={24} color="#BDBDBD" />
          </TouchableOpacity>
        </Camera>
      </View>
      <Text style={styles.photoText}>
        {photo ? "Редагувати фото" : "Завантажте фото"}
      </Text>
      <TextInput
        style={{ ...styles.input, marginBottom: 16 }}
        placeholder="Назва..."
        placeholderTextColor="#BDBDBD"
        value={titlePhoto}
        onChangeText={setTitlePhoto}
      />
      <View style={{ marginBottom: 32, position: "relative" }}>
        <TextInput
          style={{ ...styles.input, paddingLeft: 24 }}
          placeholder="Місцевість..."
          placeholderTextColor="#BDBDBD"
          value={place}
          onChangeText={setPlace}
        />
        <Feather
          name="map-pin"
          size={20}
          color="#BDBDBD"
          style={{ position: "absolute", bottom: 13 }}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={sendPhoto}
          activeOpacity={0.8}
          style={
            photo
              ? { ...styles.sendBtn, backgroundColor: "#FF6C00" }
              : styles.sendBtn
          }
        >
          <Text
            style={
              photo ? { ...styles.btnTitle, color: "#FFFFFF" } : styles.btnTitle
            }
          >
            Опубліковати
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deletePhoto} style={styles.deleteBtn}>
          <Feather name="trash-2" size={24} color="#BDBDBD" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreatePostsScreen;
