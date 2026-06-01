import { useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function GeneratePage() {
  const [goal, setGoal] = useState("");
  const router = useRouter();
  
  const fetchTasks = async () => {
    try {
      const goalId = generateUUID();
      const response = await fetch(
        "https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/generateTasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ goal }),
        }
      );
  
      const text = await response.text();
      const data = JSON.parse(text);
  
      router.push({
        pathname: "/tasks",
        params: {
          tasks: JSON.stringify(data.tasks),
          goal: goal,
          goalId:goalId,
        },
      });
  
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={{backgroundColor:"white",borderRadius:10,padding:10,textAlign:"center"}}>
          <Text style={styles.title}>GOAL HELPER</Text>
          <Text style={styles.title}>AIがあなたの目的達成をサポートします。</Text>
          </View>
            <View style={styles.footerContainer}>
              <View style={styles.main}>
                <Text style={styles.title}>まずは目的を入力してください。</Text>

                <TextInput
                  style={styles.input}
                  placeholder="例：日本語を上手くなりたい"
                  value={goal}
                  onChangeText={setGoal}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={Keyboard.dismiss}
                />
                <TouchableOpacity style={styles.generateButton} onPress={fetchTasks}>
                <Text style={styles.generateButtonText}>タスク生成</Text>
              </TouchableOpacity>
              </View>
              </View>
          </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    backgroundColor:"#D3D3D3"
  },
  main: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    maxWidth: 960,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor:"white"
  },
  generateButton: {
    flex: 1,
    backgroundColor: "#FF9800",
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center"
  },
  generateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  footerContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
});
