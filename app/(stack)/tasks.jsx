import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ActivityIndicator,
  FlatList, TextInput, TouchableOpacity, Animated,
} from "react-native";
import { useRouter } from "expo-router";
import uuid from "react-native-uuid";

// ── カラーパレット（アプリ共通） ──────────────────────────────
const ORANGE       = "#F97316";
const ORANGE_LIGHT = "#FFF7ED";
const DARK         = "#1C1917";
const MID          = "#57534E";
const LIGHT        = "#F5F5F4";
const WHITE        = "#FFFFFF";
const RED          = "#EF4444";
const RED_LIGHT    = "#FEF2F2";
const GREEN        = "#22C55E";
const GREEN_LIGHT  = "#F0FDF4";
const BORDER       = "#E7E5E4";

export const options = {
  headerShown: true,
  headerBackVisible: true,
};

function TaskItem({ item, index, onRemove }) {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, delay: index * 60, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <View style={styles.taskItem}>
        <View style={styles.taskBullet}>
          <Text style={styles.taskBulletText}>{String(index + 1).padStart(2, "0")}</Text>
        </View>
        <Text style={styles.taskText}>{item.description}</Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => onRemove(index)} activeOpacity={0.7}>
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function TasksPage() {
  const { tasks, goal, goalId } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const taskList = tasks ? JSON.parse(tasks) : [];
  const [taskListState, setTaskListState] = useState(taskList);

  useEffect(() => { setLoading(false); }, []);

  function removeTask(index) {
    setTaskListState(taskListState.filter((_, i) => i !== index));
  }

  async function saveGoalAndTasks() {
    await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/insertGoal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId, goalText: goal }),
    });

    for (const item of taskListState) {
      const response = await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/insertTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId, itemText: item.description, itemId: uuid.v4() }),
      });
      console.log("STATUS:", response.status);
      console.log(await response.text());
    }

    alert("目標とタスクを保存しました！");
    router.push("/generate");
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ORANGE} />
        <Text style={styles.loadingText}>タスクを生成中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLabel}>TASK PLAN</Text>
        <Text style={styles.title} numberOfLines={2}>{goal}</Text>
        <View style={styles.headerDivider} />
        <Text style={styles.taskCount}>{taskListState.length}件のタスク</Text>
      </View>

      {/* Task list */}
      <FlatList
        data={taskListState}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TaskItem item={item} index={index} onRemove={removeTask} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>タスクがありません</Text>
          </View>
        }
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>新しいタスクを追加</Text>
        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="タスクを入力..."
            placeholderTextColor={MID}
            value={newTask}
            onChangeText={setNewTask}
          />
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => {
              if (newTask.trim().length === 0) return;
              setTaskListState([...taskListState, { description: newTask }]);
              setNewTask("");
            }}
          >
            <Text style={styles.addButtonText}>追加</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={saveGoalAndTasks} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>✓　目的を保存する</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT },

  /* Loading */
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 14 },
  loadingText: { fontSize: 17, fontWeight: "600", color: MID },

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
  title: { fontSize: 22, fontWeight: "800", color: DARK, letterSpacing: -0.3, lineHeight: 30 },
  headerDivider: { width: 40, height: 3, backgroundColor: ORANGE, borderRadius: 2, marginTop: 12, marginBottom: 10 },
  taskCount: { fontSize: 13, color: MID, fontWeight: "500" },

  /* List */
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },

  /* Task item */
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  taskBullet: {
    width: 34, height: 34, borderRadius: 8,
    backgroundColor: ORANGE_LIGHT,
    justifyContent: "center", alignItems: "center", flexShrink: 0,
  },
  taskBulletText: { fontSize: 11, fontWeight: "700", color: ORANGE },
  taskText: { fontSize: 15, fontWeight: "500", color: DARK, flex: 1, lineHeight: 22 },
  deleteBtn: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: RED_LIGHT,
    justifyContent: "center", alignItems: "center",
  },
  deleteBtnText: { fontSize: 13, color: RED, fontWeight: "700" },

  /* Empty */
  emptyState: { alignItems: "center", marginTop: 60, gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 15, color: MID, fontWeight: "500" },

  /* Footer */
  footer: {
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  footerTitle: { fontSize: 14, fontWeight: "700", color: DARK },
  addRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 15,
    color: DARK,
  },
  addButton: {
    backgroundColor: ORANGE,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  addButtonText: { color: WHITE, fontSize: 15, fontWeight: "700" },
  saveButton: {
    backgroundColor: GREEN,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: { color: WHITE, fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
});
