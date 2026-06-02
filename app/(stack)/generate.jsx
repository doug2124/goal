import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export const options = {
  headerShown:false,
};


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
    <SafeAreaView style={{ flex: 1 ,backgroundColor:"white" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 24 }}
            keyboardShouldPersistTaps="handled"
            style={{ backgroundColor: "white" }}
          >
            <View style={styles.main}>
              <Text style={styles.title}>{"   まずは目的を\n   入力してください"}</Text>
  
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
              <TouchableOpacity style={styles.generateButton} onPress={() => router.push("/goals")}>
                <Text style={styles.generateButtonText}>保存済みの目的</Text>
              </TouchableOpacity>
            </View>
  
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24
  },
  main: {
    marginTop:20,
    width: "100%",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 100,
    marginTop:40
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
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal:20,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
    alignSelf:"center",
    marginTop:10
  },
  generateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
});
