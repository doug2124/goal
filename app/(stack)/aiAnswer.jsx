import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

// ── カラーパレット（アプリ共通） ──────────────────────────────
const ORANGE       = "#F97316";
const DARK         = "#1C1917";
const MID          = "#57534E";
const LIGHT        = "#F5F5F4";
const WHITE        = "#FFFFFF";
const BLUE         = "#3B82F6";
const BLUE_LIGHT   = "#EFF6FF";
const BORDER       = "#E7E5E4";

export default function AiAnswer() {
  const { answer } = useLocalSearchParams();

  return (
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLabel}>AI ASSISTANT</Text>
          <Text style={styles.title}>AI の回答</Text>
          <View style={styles.headerDivider} />
        </View>

        {/* Answer card */}
        <View style={styles.section}>
          <View style={styles.answerCard}>
            <View style={styles.answerCardHeader}>
              <Text style={styles.answerEmoji}>🤖</Text>
              <Text style={styles.answerCardLabel}>AIからの回答</Text>
            </View>
            <View style={styles.answerDivider} />
            <Text style={styles.answerText}>{answer}</Text>
          </View>
        </View>

        {/* Back button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>← タスクに戻る</Text>
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

  /* Answer card */
  answerCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: BLUE,
  },
  answerCardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  answerEmoji: { fontSize: 22 },
  answerCardLabel: { fontSize: 13, fontWeight: "700", color: BLUE, letterSpacing: 0.5 },
  answerDivider: { height: 1, backgroundColor: BLUE_LIGHT, marginBottom: 16 },
  answerText: { fontSize: 16, color: DARK, lineHeight: 28, fontWeight: "400" },

  /* Back button */
  backButton: {
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: BORDER,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  backButtonText: { color: MID, fontSize: 15, fontWeight: "700" },
});
