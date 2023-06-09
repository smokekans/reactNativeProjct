import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { Feather } from "@expo/vector-icons";


import {
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { styles } from "./Screens.styles";

const CommentsScreen = ({ route }) => {
  const { postId, postPhoto, autorPostId } = route.params;
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);

  const { userId, login, avatar } = useSelector((state) => state.auth);

  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    getAllComments();
  }, []);

  const createComment = async () => {
      const date = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const formattedDate = date.toLocaleString("uk-UA", options);

    await addDoc(collection(db, "posts", postId, "comments"), {
      comment,
      login,
      date: formattedDate,
      autorCommentId: userId,
      avatar,
    });
    const commentRef = doc(db, "posts", postId);
    await setDoc(
      commentRef,
      { commentsQuantity: allComments.length + 1 },
      { merge: true }
    );
    setComment("");
    keyboardHide();
  };

  const getAllComments = async () => {
    const commentsQuery = query(
      collection(db, "posts", postId, "comments"),
      orderBy("date")
    );
    onSnapshot(commentsQuery, (data) =>
      setAllComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };


  const keyboardHide = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={styles.containerComment}>
      <TouchableWithoutFeedback onPress={keyboardHide}>
        <View>
          <View style={{ marginBottom: 32 }}>
            <Image source={{ uri: postPhoto }} style={styles.postPhoto} />
          </View>
          
          <FlatList
            style={{ maxHeight: screenHeight * 0.35 }}
            data={allComments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              const formattedDate = item.date; // Определение переменной formattedDate
              return (
                <View
                  style={
                    autorPostId === item.autorCommentId
                      ? styles.commentRevercedField
                      : styles.commentField
                  }
                >
                  <View
                    style={
                      autorPostId === item.autorCommentId
                        ? { marginLeft: 16 }
                        : { marginRight: 16 }
                    }
                  >
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.authorAvatar}
                    />
                  </View>
                  <View
                    style={
                      autorPostId === item.autorCommentId
                        ? {
                            ...styles.commentWrapper,
                            borderTopRightRadius: 0,
                          }
                        : {
                            ...styles.commentWrapper,
                            borderTopLeftRadius: 0,
                          }
                    }
                  >
                    <Text
                      style={styles.commentText}
                      numberOfLines={3}
                      ellipsizeMode="tail"
                    >
                      {item.comment}
                    </Text>
                    <View>
                      <Text
                        style={
                          autorPostId === item.autorCommentId
                            ? { ...styles.date, marginRight: "auto" }
                            : { ...styles.date, marginLeft: "auto" }
                        }
                      >
                        {formattedDate}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
        style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}
      >
        <View style={{ marginBottom: 16 }}>
          <TextInput
            style={styles.commentInput}
            placeholder="Коментувати..."
            placeholderTextColor="#BDBDBD"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity style={styles.commentBtn} onPress={createComment}>
            <Feather name="arrow-up" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};


export default CommentsScreen;