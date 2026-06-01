import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Button,TouchableOpacity,ActivityIndicator} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TasksDetails() {
  const router = useRouter();
  const { goalId, description } = useLocalSearchParams();

  const [tasks, setTasks] = useState([]);
  const [taskListState, setTaskListState] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [loading, setLoading] = useState(false);


  async function removeTask(index) {
    const task = taskListState[index];

    setTaskListState(prev => prev.filter((_, i) => i !== index));

    await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/deleteTask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      goalId,
      itemId: task.itemId
    })
  });
  }
  async function updateTask(itemId, newDescription, newStatus) {
    await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/updateTask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goalId,
        itemId,
        description: newDescription,
        status: newStatus
      })
    });
  }
  async function handleDone(task) {
    if (selectedTaskIndex === null) return;

    setTaskListState(prev => prev.filter((_, i) => i !== selectedTaskIndex));

    await updateTask(task.itemId, task.description, "done");

    await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/deleteTask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      goalId,
      itemId: task.itemId
    })
  });
  setSelectedTaskIndex(null);
  alert("目標とタスクを保存しました！");
}

  const fetchTasks = async () => {
    if (!goalId) return;
  
    try {
      setLoading(true);
      const response = await fetch(
        `https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/getTask?goalId=${goalId}`
      );
  
      const raw = await response.json();
      console.log("RAW:", raw);
  
      setTasks(raw.tasks || []);
      setTaskListState(raw.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }finally{
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchTasks();
  }, [goalId]);

  return (
    <SafeAreaView style={{ flex: 1,backgroundColor:"#D3D3D3" }}>
      
      {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={{ marginTop: 10 }}>読み込み中...</Text>
      </View>
    ) : (
      <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>目的: {description}</Text>
  
        {taskListState.map((task, index) => (
          <View key={index} style={styles.taskItem}>
            <Text style={styles.taskText}>• {task.description}</Text>
            <TouchableOpacity
                onPress={() => setSelectedTaskIndex(index)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
  
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
        </View>
  
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.doneButton} onPress={() => handleDone(tasks)}>
            <Text style={styles.doneButtonText}>完了にする</Text>
          </TouchableOpacity>
  
          <TouchableOpacity style={styles.homeButton} onPress={() => router.push("/")}>
            <Text style={styles.homeButtonText}>ホームに戻る</Text>
          </TouchableOpacity>
        </View>
      </View>
      </>
      )}
    </SafeAreaView>
  );}

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
    backgroundColor:"white",
    borderRadius: 5,
    padding:5,
    textAlign:"center"
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
    backgroundColor:"white",
    margin:5,
    padding:5,
    borderRadius:5
  },
  
  deleteButton: {
    fontSize: 16,
    color: "red",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 6,
    textAlign: "center",
    overflow: "hidden"
  },
  deleteButtonText: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold"
  },
  footerContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
  },
  
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 10
  },
  
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8
  },
  
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5
  },
  
  doneButton: {
    flex: 1,
    backgroundColor: "#FF9800",
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center"
  },
  
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  
  homeButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center"
  },
  
  homeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  }
});
