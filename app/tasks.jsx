import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList,Button } from "react-native";
import {useRouter} from "expo-router";

export default function TasksPage() {
  const { tasks,goal } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
 
  const taskList=JSON.parse(tasks);
  useEffect(() => {
    setLoading(false);
  }, []);

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
        data={taskList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>
              • {item.description}
            </Text>
          </View>
        )}
      />
  
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
  taskItem: {
    paddingVertical: 10,
  },
  taskText: {
    fontSize: 18,
  },
});
