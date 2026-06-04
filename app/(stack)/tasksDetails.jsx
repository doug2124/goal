import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Button,TouchableOpacity,ActivityIndicator} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableWithoutFeedback } from "react-native";
import uuid from "react-native-uuid";

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
  
  async function insertTask(newItem){

     const response = await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/insertTask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });
    console.log("INSERT STATUS:", response.status);
    console.log(await response.text());
  }
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
  setIsSelectionMode(false);
  }
  async function updateTask(itemId, newDescription, newStatus) {
    const response =await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/updateTasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goalId,
        itemId,
        description: newDescription,
        status: newStatus
      })
    });
    console.log("UPDATED STATUS: ",response.status);
    console.log(await response.text());
    alert("タスク更新");
  }
  async function handleDone(task) {
    if (!task) return;

    await updateTask(task.itemId, task.description, "done");
    setTaskListState(prev =>
      prev.map(t =>
        t.itemId === task.itemId ? { ...t, status: "done" } : t
      )
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
    <SafeAreaView style={{ flex: 1 }}>
    {loading ? (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={{ marginTop: 10 ,fontWeight:"bold",fontSize:25}}>読み込み中...</Text>
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
        <ScrollView style={styles.container}>
            <Text style={styles.title}>目的: {description}</Text>

            <Text style={styles.undoneTask}>進行中のタスク:</Text>
            {inProgressTasks.map((task, index) => (
              <TouchableOpacity
                key={task.itemId}
                onLongPress={() => {
                  setIsSelectionMode(true);
                  setSelectedTaskIndex(index);
                }}
                style={[
                  styles.taskItem,
                  isSelectionMode &&
                    selectedTaskIndex === index &&
                    styles.taskItemSelected,
                ]}
              >
                <Text style={styles.taskText}>• {task.description}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.doneTask}>完了したタスク:</Text>
            {doneTasks.map(task => (
              <View
                key={task.itemId}
                style={[styles.taskItem, { opacity: 0.5 }]}
              >
                <Text style={styles.taskText}>✓ {task.description}</Text>
              </View>
            ))}
          </ScrollView>
              {isSelectionMode && (
              <View>
                <TouchableOpacity
                  style={styles.aiButton}
                  onPress={() => {
                    const task = inProgressTasks[selectedTaskIndex];
                    router.push({
                      pathname: "/aiAsk",
                      params: {
                        goal: description,
                        task: task.description
                      }
                    });
                  }}
                >
                  <Text style={styles.aiButtonText}>🤖 AIに聞く</Text>
                </TouchableOpacity>

                <View style={styles.actionBar}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeTask(selectedTaskIndex)}
                  >
                    <Text style={styles.deleteButtonText}>✕ 削除</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleDone(inProgressTasks[selectedTaskIndex])}
                  >
                    <Text style={styles.completeButtonText}>✓ 完了</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          {!isSelectionMode && (
            <View style={styles.footerContainer}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                新しいタスクを追加
              </Text>
  
              <View style={styles.addRow}>
                <TextInput
                  style={styles.input}
                  placeholder="タスクを入力..."
                  value={newTask}
                  onChangeText={setNewTask}
                />
                <TouchableOpacity
                style={styles.addButton}
                onPress={async () => {
                  if (newTask.trim().length === 0) return;
                
                  const newItem = {
                    goalId,
                    itemId: uuid.v4(),
                    itemText: newTask,
                  };
                
                  await insertTask(newItem);
                  await fetchTasks();
                  setNewTask("");
                }}
              >
                <Text style={styles.addButtonText}>追加</Text>
              </TouchableOpacity>
                <TouchableOpacity style={styles.doneButton}
                 onPress={() => updateTask()}>
                  <Text style={styles.doneButtonText}>保存</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
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
    marginBottom: 10,
    backgroundColor:"white",
    borderRadius: 5,
    padding:10,
    textAlign:"center",
    alignSelf:"center",
  },
  undoneTask:{
    fontSize:20,
    backgroundColor:"white",
    padding:5,
    borderRadius:8,
    margin:5,
  },
  doneTask:{
    fontSize:20,
    backgroundColor:"white",
    padding:5,
    borderRadius:8,
    margin:5,
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
    borderRadius:5,
    padding:10
  },
  taskItemSelected:{
    backgroundColor:"#d0e8ff"
  },
  deleteButton: {
    minWidth:"40%",
    fontSize: 16,
    color: "red",
    padding:5,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 6,
    textAlign: "center",
    overflow: "hidden"
  },
  deleteButtonText: {
    fontSize: 20,
    color: "red",
    alignSelf:"center",
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
    backgroundColor:"#32cd32",
    paddingVertical: 8,
    borderRadius: 8,
    margin: 2,
    alignItems: "center",
    borderColor:"#00ff00",
    borderWidth:1,
  },
  completeButton:{
    minWidth:"40%",
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
    borderColor:"#00ff00",
    borderWidth:1,
    textAlign:"center",
    padding:5,
  },
  completeButtonText:{
    color:"#32cd32",
    fontSize:20,
    alignSelf:"center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  aiButton: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderColor: "#007BFF",
    borderWidth: 1,
    backgroundColor: "white",
  },  
  aiButtonText: {
    color: "#007BFF",
    fontSize: 20,
    alignSelf: "center",
  },

});
