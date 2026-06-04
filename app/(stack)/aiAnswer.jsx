import { View, Text, StyleSheet,ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function AiAnswer() {
  const { answer } = useLocalSearchParams();

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>AI の回答</Text>

      <View style={styles.box}>
        <Text style={styles.answerText}>{answer}</Text>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  box: {
    backgroundColor: "#e8f4ff",
    padding: 15,
    borderRadius: 10,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
