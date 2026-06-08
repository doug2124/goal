import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet, Text, View, TextInput,
  KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, Keyboard,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const ORANGE = "#F97316";
const DARK   = "#1C1917";
const MID    = "#78716C";
const LIGHT  = "#FAFAF9";
const WHITE  = "#FFFFFF";
const BORDER = "#E7E5E4";

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const options = { headerShown: false };

export default function GeneratePage() {
  const [goal, setGoal] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const fetchTasks = async () => {
    if (goal.trim().length === 0) return;
    try {
      const goalId = generateUUID();
      const response = await fetch(
        "https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/generateTasks",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal }),
        }
      );
      const text = await response.text();
      const data = JSON.parse(text);
      router.push({
        pathname: "/tasks",
        params: { tasks: JSON.stringify(data.tasks), goal, goalId },
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const ready = goal.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.eyebrow}>GOAL PLANNER</Text>
              <Text style={styles.title}>目的を入力</Text>
            </View>

            {/* Input */}
            <View style={styles.inputWrap}>
              <TextInput
                style={[styles.input, isFocused && styles.inputFocused]}
                placeholder="例：日本語を上手くなりたい"
                placeholderTextColor={MID}
                value={goal}
                onChangeText={setGoal}
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={Keyboard.dismiss}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.primaryBtn, !ready && styles.primaryBtnDisabled]}
                onPress={fetchTasks}
                activeOpacity={0.8}
                disabled={!ready}
              >
                <Text style={[styles.primaryBtnText, !ready && styles.primaryBtnTextDisabled]}>
                  タスクを生成する
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/goals")}
                activeOpacity={0.6}
              >
                <Text style={styles.secondaryBtn}>保存済みの目的を見る</Text>
              </TouchableOpacity>
            </View>

          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: WHITE },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
    gap: 40,
  },

  /* Header */
  header: { gap: 6 },
  eyebrow: { fontSize: 11, fontWeight: "700", letterSpacing: 3, color: ORANGE },
  title: { fontSize: 32, fontWeight: "800", color: DARK, letterSpacing: -0.8 },

  /* Input */
  inputWrap: {},
  input: {
    marginTop:400,
    borderBottomWidth: 1.5,
    borderColor: BORDER,
    paddingVertical: 14,
    fontSize: 17,
    color: DARK,
  },
  inputFocused: { borderColor: ORANGE },

  /* Actions */
  actions: { gap: 20 },
  primaryBtn: {
    backgroundColor: ORANGE,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnDisabled: { backgroundColor: BORDER },
  primaryBtnText: { color: WHITE, fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
  primaryBtnTextDisabled: { color: MID },

  secondaryBtn: {
    textAlign: "center",
    fontSize: 14,
    color: MID,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
