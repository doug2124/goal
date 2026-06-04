import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TextInput, TouchableOpacity, Button } from "react-native";
import { useRouter } from "expo-router";
import uuid from "react-native-uuid";

export const options = {
  headerShown: true,
  headerBackVisible: true,
};

export default function TasksPage() {
  const { tasks, goal, goalId } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");

  const taskList = tasks ? JSON.parse(tasks) : [];
  const [taskListState, setTaskListState] = useState(taskList);

  useEffect(() => {
    setLoading(false);
  }, []);

  function removeTask(index) {
    setTaskListState(taskListState.filter((_, i) => i !== index));
  }

  async function saveGoalAndTasks() {
    await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/insertGoal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goalId: goalId,
        goalText: goal,
      }),
    });

    for (const item of taskListState) {
      const response =await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/insertTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId: goalId,
          itemText: item.description,
          itemId:uuid.v4()
        }),
        
      });
      console.log("STATUS:", response.status);
      console.log(await response.text());
    }

    alert("目標とタスクを保存しました！");
    router.push("/generate");
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>タスクを生成中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>目的: {goal}</Text>

      <FlatList
        data={taskListState}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>• {item.description}</Text>

            <Text style={styles.deleteButton} onPress={() => removeTask(index)}>
              ✕
            </Text>
          </View>
        )}
      />

      {/* 追加バー */}
      <View style={styles.footerContainer}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>新しいタスクを追加</Text>

        <View style={styles.addRow}>
          <TextInput
            style={styles.input}
            placeholder="タスクを入力..."
            value={newTask}
            onChangeText={setNewTask}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              if (newTask.trim().length === 0) return;
              setTaskListState([...taskListState, { description: newTask }]);
              setNewTask("");
            }}
          >
            <Text style={styles.addButtonText}>追加</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.doneButton}
          onPress={saveGoalAndTasks}>
            <Text style={styles.doneButtonText}>目的を保存</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  taskText: {
    fontSize: 18,
    flex: 1,
    flexWrap: "wrap",
    marginRight: 10,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  deleteButton: {
    fontSize: 20,
    color: "red",
    paddingHorizontal: 10,
  },
  footerContainer: {
    marginTop: 10,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius:8,
  },
  addButtonText:{
    color:"white",
    fontWeight:"bold",
    fontSize:16,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  doneButton: {
    flex: 1,
    backgroundColor:"#32cd32",
    paddingVertical: 8,
    borderRadius: 8,
    margin: 2,
    alignItems: "center",
    borderColor:"#00ff00",
    borderWidth:1,
  },
});