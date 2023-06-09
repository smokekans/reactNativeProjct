import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  collectionGroup,
  updateDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { db, storage } from "../../firebase/config";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import {
  authSignOutUser,
  updateUserAvatar,
} from "../../redux/auth/authOperations";
import { styles } from "./Screens.styles";

const ProfileScreen = ({ navigation }) => {
  const [userPosts, setUserPosts] = useState([]);
  const { userId, login, avatar } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    const userQuery = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("createdDate", "desc")
    );

    onSnapshot(userQuery, (data) =>
      setUserPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };

  const updateUserComments = async (avatar) => {
    const userQuery = query(
      collectionGroup(db, "comments"),
      where("autorCommentId", "==", userId)
    );

    const querySnapshot = await getDocs(userQuery);
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        avatar,
      });
    });
  };

  const uploadPhotoToServer = async (avatar) => {
    let imageRef;

    if (avatar) {
      const response = await fetch(avatar);
      const file = await response.blob();
      const uniqueAvatarId = Date.now().toString();
      imageRef = ref(storage, `userAvatars/${uniqueAvatarId}`);
      await uploadBytes(imageRef, file);
    } else {
      imageRef = ref(storage, `userAvatars/default.jpg`);
    }

    const processedPhoto = await getDownloadURL(imageRef);
    return processedPhoto;
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const photo = await uploadPhotoToServer(result.assets[0].uri);
      await updateUserComments(photo);
      dispatch(updateUserAvatar(photo));
    }
  };

  const removeAvatar = async () => {
    const photo = await uploadPhotoToServer();
    await updateUserComments(photo);
    dispatch(updateUserAvatar(photo));
  };

  const signOut = () => {
    dispatch(authSignOutUser());
    navigation.navigate("Login");
  };

  const updateLikes = async (likes, itemId) => {
    try {
      const likeRef = doc(db, "posts", itemId);
      await updateDoc(likeRef, {
        likes: likes,
      });
    } catch (error) {
      console.log("err", error.message);
    }
  };

  return (
    <View style={styles.containerProfile}>
      <ImageBackground
        style={styles.bgImage}
        source={require("../../image/bg.jpg")}
      >
        <View style={styles.wrapper}>
          <View style={styles.avatar}>
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
            {!avatar || avatar.includes("default") ? (
              <TouchableOpacity
                style={styles.btnAddAvatar}
                activeOpacity={0.9}
                onPress={pickAvatar}
              >
                <Ionicons name="add" size={20} color="#FF6C00" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.btnRemoveAvatar}
                activeOpacity={0.9}
                onPress={removeAvatar}
              >
                <Ionicons name="close" size={20} color="#E8E8E8" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.btnRight}
            activeOpacity={0.5}
            onPress={signOut}
          >
            <Feather name="log-out" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <Text style={styles.title}>{login}</Text>
          {userPosts.length > 0 && (
            <View style={styles.postContainer}>
              <FlatList
                style={{ marginBottom: 90 }}
                data={userPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View>
                    <Image
                      source={{ uri: item.photo }}
                      style={styles.itemPhoto}
                    />
                    <Text style={styles.itemTitle}>{item.titlePhoto}</Text>
                    <View style={styles.description}>
                      <View style={styles.comments}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("Comments", {
                              postId: item.id,
                              postPhoto: item.photo,
                              autorPostId: item.userId,
                            })
                          }
                        >
                          <Feather
                            name="message-circle"
                            size={24}
                            color={
                              item.commentsQuantity > 0 ? "#FF6C00" : "#BDBDBD"
                            }
                            style={{
                              marginRight: 9,
                            }}
                          />
                        </TouchableOpacity>
                        <Text style={styles.commentsAmount}>
                          {item.commentsQuantity ? item.commentsQuantity : "0"}
                        </Text>
                      </View>
                      <View style={styles.likes}>
                        <TouchableOpacity
                          onPress={() => {
                            updateLikes(item.likes + 1, item.id);
                          }}
                        >
                          <Feather
                            name="thumbs-up"
                            size={24}
                            color={item.likes > 0 ? "#FF6C00" : "#BDBDBD"}
                            style={{ marginRight: 10 }}
                          />
                        </TouchableOpacity>
                        <Text style={styles.commentsAmount}>{item.likes}</Text>
                      </View>
                      <View style={styles.location}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("Map", {
                              location: item.location,
                              title: item.titlePhoto,
                              image: item.photo,
                            });
                          }}
                        >
                          <Feather
                            name="map-pin"
                            size={24}
                            color="#BDBDBD"
                            style={{ marginRight: 8 }}
                          />
                        </TouchableOpacity>
                        <Text
                          style={{
                            ...styles.commentsAmount,
                            textDecorationLine: "underline",
                          }}
                        >
                          {item.place}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default ProfileScreen;
