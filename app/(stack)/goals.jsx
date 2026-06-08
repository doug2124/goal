import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

function GoalCard({ goal, onDelete, onDetail, index }) {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.goalCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.goalHeader}>
        <View style={styles.goalIndex}>
          <Text style={styles.goalIndexText}>{String(index + 1).padStart(2, "0")}</Text>
        </View>
        <Text style={styles.goalText}>{goal.description}</Text>
      </View>
      <View style={styles.goalActions}>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={onDetail}
          activeOpacity={0.8}
        >
          <Text style={styles.detailsButtonText}>詳細を見る</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDelete}
          activeOpacity={0.8}
        >
          <Text style={styles.deleteButtonText}>削除</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function deleteGoal(goalId) {
    const response = await fetch(
      "https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/deleteGoals",
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId }),
      }
    );
    console.log("Status:", response.status);
    const data = await response.text();
    console.log(data);
    fetchGoals();
    alert("目的を削除しました");
  }

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/getGoals"
      );
      const data = await response.json();
      console.log("DATA:", data);
      setGoals(data.goals || []);
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F97316" />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerLabel}>MY GOALS</Text>
            <Text style={styles.title}>進行中の目的</Text>
            <View style={styles.headerDivider} />
            <Text style={styles.goalCount}>{goals.length}件のゴール</Text>
          </View>

          {/* Goals */}
          {goals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyText}>目的がまだありません</Text>
            </View>
          ) : (
            goals.map((goal, index) => (
              <GoalCard
                key={goal.goalId}
                goal={goal}
                index={index}
                onDelete={() => deleteGoal(goal.goalId)}
                onDetail={() =>
                  router.push({
                    pathname: "/tasksDetails",
                    params: {
                      goalId: goal.goalId,
                      description: goal.description,
                    },
                  })
                }
              />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FFF7ED";
const DARK = "#1C1917";
const MID = "#57534E";
const LIGHT = "#F5F5F4";
const WHITE = "#FFFFFF";
const RED = "#EF4444";
const RED_LIGHT = "#FEF2F2";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LIGHT,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  /* Header */
  header: {
    backgroundColor: WHITE,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#E7E5E4",
    marginBottom: 20,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 3,
    color: ORANGE,
    marginBottom: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: DARK,
    letterSpacing: -0.5,
  },
  headerDivider: {
    width: 40,
    height: 3,
    backgroundColor: ORANGE,
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 10,
  },
  goalCount: {
    fontSize: 13,
    color: MID,
    fontWeight: "500",
  },

  /* Goal Card */
  goalCard: {
    backgroundColor: WHITE,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 12,
  },
  goalIndex: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: ORANGE_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  goalIndexText: {
    fontSize: 12,
    fontWeight: "700",
    color: ORANGE,
  },
  goalText: {
    fontSize: 17,
    fontWeight: "600",
    color: DARK,
    lineHeight: 24,
    flex: 1,
    paddingTop: 5,
  },

  /* Actions */
  goalActions: {
    flexDirection: "row",
    gap: 10,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: ORANGE,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },
  detailsButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  deleteButton: {
    flex: 0.5,
    backgroundColor: RED_LIGHT,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  deleteButtonText: {
    color: RED,
    fontSize: 15,
    fontWeight: "700",
  },

  /* Loading */
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  loadingText: {
    fontSize: 17,
    fontWeight: "600",
    color: MID,
  },

  /* Empty */
  emptyState: {
    alignItems: "center",
    marginTop: 80,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    color: MID,
    fontWeight: "500",
  },
});
