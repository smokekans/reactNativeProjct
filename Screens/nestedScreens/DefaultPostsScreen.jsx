import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { styles } from "./Screens.styles";


const DefaultPostsScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  const { avatar, login, email, userId } = useSelector((state) => state.auth);

  const getAllPosts = async () => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdDate", "desc")
    );

    onSnapshot(postsQuery, (data) => {
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  useEffect(() => {
     getAllPosts();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
       <Image source={{ uri: avatar }} style={styles.userImage} />
        <View>
          <Text style={styles.userName}>{login}</Text>
          <Text
            style={{
              fontSize: 11,
              lineHeight: 12.89,
              color: "#212121",
              fontFamily: "Roboto-Regular",
            }}
          >
           {email}
          </Text>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item.photo }} style={styles.itemPhoto} />
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
                    color={item.commentsQuantity > 0 ? "#FF6C00" : "#BDBDBD"}
                    style={{
                      marginRight: 9,
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.commentsAmount}>
                  {item.commentsQuantity ? item.commentsQuantity : "0"}
                </Text>
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
  );
};

export default DefaultPostsScreen;