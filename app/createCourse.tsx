// createCourse.tsx

import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  ScrollView,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { auth, storage } from "@/firebaseConfig";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, Button } from 'react-native-paper';

// Import Firestore functions
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { LogBox } from "react-native";
LogBox.ignoreLogs(['Asyncstorage: ...']);
LogBox.ignoreAllLogs();

const CreateCourse = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const [PFPUrl, setPFPUrl] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  // State for form inputs
  const [title, setTitle] = useState("");
  const [blurb, setBlurb] = useState("");
  const [tag, setTag] = useState("");
  const [time, setTime] = useState("");
  const [price, setPrice] = useState("");
  const [courseContents, setCourseContents] = useState(""); // Added state for course contents
  const [author, setAuthor] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const checkUserInAsyncStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        router.push({ pathname: "./signIn" });
      }
    } catch (error) {
      console.error("Error retrieving user from AsyncStorage", error);
    }
    setLoading(false);
  };

  const getAuthorFromAsyncStorage = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString);
        setAuthor(`${userData.firstName} ${userData.lastName}`);
        setUserID(`${userData.uid}`);
      }
    } catch (error) {
      console.error("Error fetching author data from AsyncStorage", error);
    }
  };

  // Function to fetch image URL from Firebase Storage
  const fetchImageFromFirebase = async (
      path: string
  ): Promise<string | null> => {
    try {
      const storage = getStorage();
      const imageRef = ref(storage, path);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error fetching image from Firebase Storage", error);
      return null;
    }
  };

  useEffect(() => {
    getAuthorFromAsyncStorage();
  }, []);

  // Function to fetch and set image URL
  const fetchImageUrl = async (user: User) => {
    try {
      const url = await fetchImageFromFirebase(`pfp/${user.uid}`);
      if (url) {
        setPFPUrl(url);
      }
    } catch (error) {
      console.error("Error fetching image URL:", error);
    } finally {
      setLoadingImage(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem("user");
      await auth.signOut();
      Alert.alert("Success", "You have been signed out.");
      router.replace({ pathname: "./signIn" });
    } catch (error) {
      Alert.alert("Error", "An error occurred while signing out.");
      console.error("Error signing out: ", error);
    }
  };

  // Handle course creation
  const handleCreateCourse = async () => {
    try {
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      if (!title || !blurb || !tag || !time || !price || !courseContents) { // Added courseContents to validation
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      let imageUrl = "";
      if (image) {
        // Upload image to Firebase Storage
        const response = await fetch(image);
        const blob = await response.blob();
        const imageRef = ref(storage, `courseImages/${Date.now()}`);
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      const newCourse = {
        title,
        blurb,
        tag,
        time,
        price: parseFloat(price),
        userId: userID,
        userPFP: PFPUrl || "",
        name: author || "Anonymous",
        imageUrl,
        courseContents, // Added courseContents to the Firestore document
      };

      await addDoc(collection(db, "courses"), newCourse);
      Alert.alert("Success", "Course created successfully");
      router.back();
    } catch (error) {
      console.error("Error creating course:", error);
      Alert.alert("Error", "Failed to create course");
    }
  };

  // Retrieve user UID from AsyncStorage and fetch image URL
  useEffect(() => {
    checkUserInAsyncStorage();

    const fetchUserUid = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          setUser(user);
          await fetchImageUrl(user);
        } else {
          console.log("No user found");
          setLoadingImage(false);
        }
      } catch (error) {
        console.error("Error retrieving user from AsyncStorage", error);
        setLoadingImage(false);
      }
    };

    fetchUserUid();
  }, []);

  return (
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View style={styles.banner}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={35} color="black" />
            </Pressable>
            <TouchableOpacity style={styles.profilePic} onPress={handleSignOut}>
              {loadingImage ? (
                  <ActivityIndicator size="small" color="#02D6B6" />
              ) : PFPUrl ? (
                  <Image source={{ uri: PFPUrl }} style={styles.profileImage} />
              ) : (
                  <MaterialIcons name="face" size={40} color="black" />
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
              contentContainerStyle={{ padding: 16 }}
              keyboardShouldPersistTaps="handled"
          >
            {/* Form */}
            <View style={styles.form}>
              <TextInput
                  style={styles.input}
                  label="Course Title"
                  placeholderTextColor="#7D7D7D"
                  value={title}
                  mode="outlined"
                  onChangeText={setTitle}
                  activeOutlineColor="#FF6231"
                  outlineColor="#ccc"
              />
              <TextInput
                  style={styles.input}
                  label="Blurb"
                  placeholderTextColor="#7D7D7D"
                  value={blurb}
                  mode="outlined"
                  onChangeText={setBlurb}
                  activeOutlineColor="#FF6231"
                  outlineColor="#ccc"
              />
              <TextInput
                  style={styles.input}
                  label="Tag"
                  placeholderTextColor="#7D7D7D"
                  value={tag}
                  mode="outlined"
                  onChangeText={setTag}
                  activeOutlineColor="#FF6231"
                  outlineColor="#ccc"
              />
              <TextInput
                  style={styles.input}
                  label="Time (minutes)"
                  placeholderTextColor="#7D7D7D"
                  value={time}
                  mode="outlined"
                  onChangeText={setTime}
                  keyboardType="numeric"
                  maxLength={3}
                  activeOutlineColor="#FF6231"
                  outlineColor="#ccc"
              />
              <TextInput
                  style={styles.input}
                  label="Price"
                  placeholderTextColor="#7D7D7D"
                  value={price}
                  mode="outlined"
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  activeOutlineColor="#FF6231"
                  outlineColor="#ccc"
              />
              <ScrollView automaticallyAdjustKeyboardInsets={true}>
                <TextInput
                    style={[styles.inputContents, { textAlignVertical: 'top' }]}
                    label="Course Contents"
                    placeholderTextColor="#7D7D7D"
                    value={courseContents} // Added value prop
                    onChangeText={setCourseContents} // Added onChangeText prop
                    returnKeyType="send"
                    blurOnSubmit={false}
                    multiline
                    mode="outlined"
                    activeOutlineColor="#FF6231"
                    outlineColor="#ccc"
                />
                {image && (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                )}
                <Button
                    mode="contained"
                    onPress={pickImage}
                    buttonColor="#00d4b5"
                    textColor="#fff"
                    style={{ marginVertical: 10 }}
                >
                  Pick Image
                </Button>
                <Button
                    mode="contained"
                    onPress={handleCreateCourse}
                    buttonColor="#FF6231"
                    textColor="#FFFFFF"
                    style={{ marginVertical: 5 }}
                >
                  Create Course
                </Button>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </Pressable>
  );
};

export default CreateCourse;

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 10,
  },
  profilePic: {
    flexDirection: "row",
    marginRight: 15,
    borderWidth: 2,
    height: 55,
    width: 55,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#02D6B6",
    borderRadius: 27.5,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  form: {
    paddingTop: -20,
    padding: 20,
  },
  input: {
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  inputContents: {
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    height: 200,
    textAlign: "left",
  },
  previewImage: {
    width: "100%",
    height: 200,
    marginBottom: 15,
  },
});
