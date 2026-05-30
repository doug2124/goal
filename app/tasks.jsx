import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button,TextInput } from "react-native";
import { useRouter } from "expo-router";

export default function TasksPage() {
  const { tasks, goal, goalId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const taskList = tasks ? JSON.parse(tasks) : [];
  console.log("TASKLIST PARSED:", taskList);
  useEffect(() => {
    setLoading(false);
  }, []);

  const [newTask, setNewTask] = useState("");
  const [taskListState, setTaskListState] = useState(taskList);

  function removeTask(index) {
    setTaskListState(taskListState.filter((_, i) => i !== index));
  }

  async function saveGoalAndTasks() {
    await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/insertGoal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goalId: goalId,
        goalText: goal
      })
    });

    for (const item of taskListState) {
      console.log("Saving task:", item.description);
      console.log(goalId);
      await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/insertTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalId: goalId,
          itemText: item.description
        })
      });
    }
  
    alert("目標とタスクを保存しました！");
    router.push("/");
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
        
            <Text
              style={styles.deleteButton}
              onPress={() => removeTask(index)}
            >
              ✕
            </Text>
          </View>
        )}
        
      />
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>新しいタスクを追加</Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          marginTop: 10
        }}
        placeholder="タスクを入力..."
        value={newTask}
        onChangeText={setNewTask}
      />

      <Button
        title="追加"
        onPress={() => {
          if (newTask.trim().length === 0) return;

          setTaskListState([
            ...taskListState,
            { description: newTask }
          ]);

          setNewTask("");
        }}
      />
            <Button title="タスクを保存" onPress={saveGoalAndTasks} />
      <Button title="ホームに戻る" onPress={() => router.push("/")} />
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
    flex:1,
    flexWrap:"wrap",
    marginRight:10
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
  
});
