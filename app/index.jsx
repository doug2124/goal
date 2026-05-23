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
} from "react-native";
import { useRouter } from "expo-router";

export default function Page() {
  const [goal, setGoal] = useState("");
  const router = useRouter();

  
  const handleGenerate = () => {
    if (!goal.trim()) return;
    router.push({
      pathname: "/tasks",
      params: { goal },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <Text style={styles.title}>GOAL HELPER</Text>
          <Text style={styles.title}>AIがあなたの目的達成をサポートします。</Text>

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

            <Button title="タスクを生成" onPress={handleGenerate} />
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
  },
});
