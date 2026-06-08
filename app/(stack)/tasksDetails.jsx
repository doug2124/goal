import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableWithoutFeedback } from "react-native";
import uuid from "react-native-uuid";

// ── カラーパレット（goals.jsx と統一） ──────────────────────
const ORANGE      = "#F97316";
const ORANGE_LIGHT = "#FFF7ED";
const DARK        = "#1C1917";
const MID         = "#57534E";
const LIGHT       = "#F5F5F4";
const WHITE       = "#FFFFFF";
const RED         = "#EF4444";
const RED_LIGHT   = "#FEF2F2";
const GREEN       = "#22C55E";
const GREEN_LIGHT = "#F0FDF4";
const BLUE        = "#3B82F6";
const BLUE_LIGHT  = "#EFF6FF";
const BORDER      = "#E7E5E4";

function TaskItem({ task, index, isSelected, onLongPress, done }) {
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
      <TouchableOpacity
        onLongPress={onLongPress}
        activeOpacity={done ? 1 : 0.7}
        style={[styles.taskItem, isSelected && styles.taskItemSelected, done && styles.taskItemDone]}
      >
        <View style={[styles.taskBullet, done && styles.taskBulletDone]}>
          <Text style={[styles.taskBulletText, done && styles.taskBulletTextDone]}>
            {done ? "✓" : "→"}
          </Text>
        </View>
        <Text style={[styles.taskText, done && styles.taskTextDone]}>{task.description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function TasksDetails() {
  const router = useRouter();
  const { goalId, description } = useLocalSearchParams();

  const [tasks, setTasks] = useState([]);
  const [taskListState, setTaskListState] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const inProgressTasks = taskListState.filter(t => t.status !== "done");
  const doneTasks = taskListState.filter(t => t.status === "done");

  async function insertTask(newItem) {
    const response = await fetch(
      "https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/insertTask",
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newItem) }
    );
    console.log("INSERT STATUS:", response.status);
    console.log(await response.text());
  }

  async function removeTask(index) {
    const task = taskListState[index];
    setTaskListState(prev => prev.filter((_, i) => i !== index));
    await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/deleteTask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId, itemId: task.itemId }),
    });
    setIsSelectionMode(false);
  }

  async function updateTask(itemId, newDescription, newStatus) {
    const response = await fetch(
      "https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/updateTasks",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalId, itemId, description: newDescription, status: newStatus }),
      }
    );
    console.log("UPDATED STATUS:", response.status);
    console.log(await response.text());
    alert("タスク更新");
  }

  async function handleDone(task) {
    if (!task) return;
    await updateTask(task.itemId, task.description, "done");
    setTaskListState(prev =>
      prev.map(t => (t.itemId === task.itemId ? { ...t, status: "done" } : t))
    );
    setSelectedTaskIndex(null);
    setIsSelectionMode(false);
    alert("タスク完了！");
  }

  const fetchTasks = async () => {
    if (!goalId) return;
    try {
      setLoading(true);
      const response = await fetch(
        `https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/getTask?goalId=${goalId}`
      );
      const raw = await response.json();
      setTasks(raw.tasks || []);
      setTaskListState(raw.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [goalId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => {
            if (isSelectionMode) {
              setIsSelectionMode(false);
              setSelectedTaskIndex(null);
            }
          }}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={{ paddingBottom: isSelectionMode ? 180 : 160 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerLabel}>TASK LIST</Text>
                <Text style={styles.title} numberOfLines={2}>{description}</Text>
                <View style={styles.headerDivider} />
                <View style={styles.statsRow}>
                  <View style={styles.statChip}>
                    <Text style={styles.statNum}>{inProgressTasks.length}</Text>
                    <Text style={styles.statLabel}>進行中</Text>
                  </View>
                  <View style={[styles.statChip, styles.statChipDone]}>
                    <Text style={[styles.statNum, { color: GREEN }]}>{doneTasks.length}</Text>
                    <Text style={styles.statLabel}>完了</Text>
                  </View>
                </View>
              </View>

              {/* In-progress tasks */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionDot, { backgroundColor: ORANGE }]} />
                  <Text style={styles.sectionTitle}>進行中のタスク</Text>
                  <Text style={styles.sectionHint}>長押しで選択</Text>
                </View>
                {inProgressTasks.length === 0 ? (
                  <View style={styles.emptySection}>
                    <Text style={styles.emptyText}>タスクがありません</Text>
                  </View>
                ) : (
                  inProgressTasks.map((task, index) => (
                    <TaskItem
                      key={task.itemId}
                      task={task}
                      index={index}
                      isSelected={isSelectionMode && selectedTaskIndex === index}
                      onLongPress={() => {
                        setIsSelectionMode(true);
                        setSelectedTaskIndex(index);
                      }}
                      done={false}
                    />
                  ))
                )}
              </View>

              {/* Done tasks */}
              {doneTasks.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionDot, { backgroundColor: GREEN }]} />
                    <Text style={styles.sectionTitle}>完了したタスク</Text>
                  </View>
                  {doneTasks.map((task, index) => (
                    <TaskItem key={task.itemId} task={task} index={index} done={true} />
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Selection mode action bar */}
            {isSelectionMode && (
              <View style={styles.selectionBar}>
                <TouchableOpacity
                  style={styles.aiButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    const task = inProgressTasks[selectedTaskIndex];
                    router.push({ pathname: "/aiAsk", params: { goal: description, task: task.description } });
                  }}
                >
                  <Text style={styles.aiButtonText}>🤖　AIに聞く</Text>
                </TouchableOpacity>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    activeOpacity={0.8}
                    onPress={() => removeTask(selectedTaskIndex)}
                  >
                    <Text style={styles.deleteButtonText}>✕　削除</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.completeButton}
                    activeOpacity={0.8}
                    onPress={() => handleDone(inProgressTasks[selectedTaskIndex])}
                  >
                    <Text style={styles.completeButtonText}>✓　完了</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Add task footer */}
            {!isSelectionMode && (
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
                    onPress={async () => {
                      if (newTask.trim().length === 0) return;
                      const newItem = { goalId, itemId: uuid.v4(), itemText: newTask };
                      await insertTask(newItem);
                      await fetchTasks();
                      setNewTask("");
                    }}
                  >
                    <Text style={styles.addButtonText}>追加</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveButton}
                    activeOpacity={0.8}
                    onPress={() => updateTask()}
                  >
                    <Text style={styles.saveButtonText}>保存</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT },
  scroll: { flex: 1 },

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
  headerDivider: { width: 40, height: 3, backgroundColor: ORANGE, borderRadius: 2, marginTop: 12, marginBottom: 14 },
  statsRow: { flexDirection: "row", gap: 10 },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: ORANGE_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statChipDone: { backgroundColor: GREEN_LIGHT },
  statNum: { fontSize: 16, fontWeight: "800", color: ORANGE },
  statLabel: { fontSize: 12, fontWeight: "600", color: MID },

  /* Section */
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 8 },
  sectionDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: DARK, letterSpacing: 0.3, flex: 1 },
  sectionHint: { fontSize: 11, color: MID },

  emptySection: { backgroundColor: WHITE, borderRadius: 12, padding: 20, alignItems: "center" },
  emptyText: { fontSize: 14, color: MID },

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
  taskItemSelected: { backgroundColor: BLUE_LIGHT, borderWidth: 1.5, borderColor: BLUE },
  taskItemDone: { opacity: 0.55 },
  taskBullet: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: ORANGE_LIGHT,
    justifyContent: "center", alignItems: "center", flexShrink: 0,
  },
  taskBulletDone: { backgroundColor: GREEN_LIGHT },
  taskBulletText: { fontSize: 13, fontWeight: "700", color: ORANGE },
  taskBulletTextDone: { color: GREEN },
  taskText: { fontSize: 16, fontWeight: "500", color: DARK, flex: 1, lineHeight: 22 },
  taskTextDone: { textDecorationLine: "line-through", color: MID },

  /* Selection bar */
  selectionBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  actionRow: { flexDirection: "row", gap: 10 },
  aiButton: {
    backgroundColor: BLUE_LIGHT,
    borderWidth: 1.5,
    borderColor: BLUE,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: "center",
  },
  aiButtonText: { color: BLUE, fontSize: 16, fontWeight: "700" },
  deleteButton: {
    flex: 1, backgroundColor: RED_LIGHT,
    borderWidth: 1, borderColor: "#FECACA",
    paddingVertical: 11, borderRadius: 10, alignItems: "center",
  },
  deleteButtonText: { color: RED, fontSize: 16, fontWeight: "700" },
  completeButton: {
    flex: 1, backgroundColor: GREEN_LIGHT,
    borderWidth: 1, borderColor: "#BBF7D0",
    paddingVertical: 11, borderRadius: 10, alignItems: "center",
  },
  completeButtonText: { color: GREEN, fontSize: 16, fontWeight: "700" },

  /* Footer */
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: WHITE,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
    gap: 10,
  },
  footerTitle: { fontSize: 14, fontWeight: "700", color: DARK, letterSpacing: 0.2 },
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  saveButtonText: { color: WHITE, fontSize: 15, fontWeight: "700" },
});
