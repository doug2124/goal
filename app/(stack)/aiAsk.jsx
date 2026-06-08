import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";

// ── カラーパレット（アプリ共通） ──────────────────────────────
const ORANGE       = "#F97316";
const ORANGE_LIGHT = "#FFF7ED";
const DARK         = "#1C1917";
const MID          = "#57534E";
const LIGHT        = "#F5F5F4";
const WHITE        = "#FFFFFF";
const BLUE         = "#3B82F6";
const BLUE_LIGHT   = "#EFF6FF";
const BORDER       = "#E7E5E4";

export default function AiAsk() {
  const { goal, task } = useLocalSearchParams();
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchFeedBack() {
    try {
      setLoading(true);
      const response = await fetch(
        "https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/generateFeedBack",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goal, task, reflection }),
        }
      );
      const data = await response.json();
      console.log("AI response", data);
      router.push({ pathname: "/aiAnswer", params: { answer: data.feedBack } });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingEmoji}>🤖</Text>
          <ActivityIndicator size="large" color={BLUE} style={{ marginVertical: 16 }} />
          <Text style={styles.loadingTitle}>AI が考えています...</Text>
          <Text style={styles.loadingSubtitle}>少々お待ちください</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>AI ASSISTANT</Text>
          <Text style={styles.title}>AI に質問する</Text>
          <View style={styles.headerDivider} />
        </View>

        {/* Context cards */}
        <View style={styles.section}>
          <View style={styles.contextCard}>
            <View style={styles.contextRow}>
              <View style={[styles.contextBadge, { backgroundColor: ORANGE_LIGHT }]}>
                <Text style={[styles.contextBadgeText, { color: ORANGE }]}>目的</Text>
              </View>
              <Text style={styles.contextText}>{goal}</Text>
            </View>
          </View>

          <View style={styles.contextCard}>
            <View style={styles.contextRow}>
              <View style={[styles.contextBadge, { backgroundColor: BLUE_LIGHT }]}>
                <Text style={[styles.contextBadgeText, { color: BLUE }]}>タスク</Text>
              </View>
              <Text style={styles.contextText}>{task}</Text>
            </View>
          </View>
        </View>

        {/* Question input */}
        <View style={styles.section}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputLabel}>質問内容</Text>
            <Text style={styles.inputHint}>{reflection.length} 文字</Text>
          </View>
          <TextInput
            value={reflection}
            onChangeText={setReflection}
            style={styles.input}
            placeholder="AI に聞きたいことを入力してください..."
            placeholderTextColor={MID}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Submit button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.aiButton, reflection.trim().length === 0 && styles.aiButtonDisabled]}
            onPress={fetchFeedBack}
            activeOpacity={0.8}
            disabled={reflection.trim().length === 0}
          >
            <Text style={styles.aiButtonText}>🤖　AIに聞く</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  /* Loading */
  loadingScreen: { flex: 1, backgroundColor: LIGHT, justifyContent: "center", alignItems: "center", padding: 24 },
  loadingCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 36,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  loadingEmoji: { fontSize: 48 },
  loadingTitle: { fontSize: 20, fontWeight: "800", color: DARK, marginBottom: 6 },
  loadingSubtitle: { fontSize: 14, color: MID, fontWeight: "500" },

  /* Header */
  header: {
    backgroundColor: WHITE,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginBottom: 16,
  },
  headerLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 3, color: ORANGE, marginBottom: 6 },
  title: { fontSize: 26, fontWeight: "800", color: DARK, letterSpacing: -0.3 },
  headerDivider: { width: 40, height: 3, backgroundColor: ORANGE, borderRadius: 2, marginTop: 12 },

  /* Section */
  section: { marginHorizontal: 16, marginBottom: 14 },

  /* Context cards */
  contextCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  contextRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  contextBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    flexShrink: 0,
  },
  contextBadgeText: { fontSize: 12, fontWeight: "700" },
  contextText: { fontSize: 15, color: DARK, fontWeight: "500", flex: 1, lineHeight: 22, paddingTop: 2 },

  /* Input */
  inputHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  inputLabel: { fontSize: 14, fontWeight: "700", color: DARK, letterSpacing: 0.2 },
  inputHint: { fontSize: 12, color: MID },
  input: {
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    height: 140,
    fontSize: 16,
    color: DARK,
    lineHeight: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  /* Button */
  aiButton: {
    backgroundColor: BLUE,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  aiButtonDisabled: {
    backgroundColor: "#CBD5E1",
    shadowOpacity: 0,
    elevation: 0,
  },
  aiButtonText: { color: WHITE, fontSize: 17, fontWeight: "700", letterSpacing: 0.3 },
});
