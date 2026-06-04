import { useEffect, useState,useRef } from "react";
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator,TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteGoal(goalId) {
    const response = await fetch("https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/deleteGoals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goalId })
    });
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
      <SafeAreaView style={{ flex: 1 ,backgroundColor:"white"}}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF9800"/>
            <Text style={{fontSize:25, marginTop: 10 ,fontWeight:"bold"}}>読み込み中...</Text>
          </View>
        ) : (
          <ScrollView style={styles.container}>
            <Text style={styles.title}>進行中の目的</Text>
            {goals.map(goal => (
              <View key={goal.goalId} style={styles.goalItem}>
                <Text style={styles.goalText}>• {goal.description}</Text>
            <TouchableOpacity style={styles.detailsButton} onPress={() => router.push({
              pathname:"/tasksDetails",
              params:{
                goalId:goal.goalId,
                description:goal.description,
              },
            })}>
                <Text style={styles.detailsButtonText}>詳細</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                
                onPress={()=>{deleteGoal(goal.goalId)
                }}
                >
                <Text style={styles.deleteButtonText}>削除</Text>
              </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign:"center",
    borderRadius:5,
    padding:10,
  },
  goalItem: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fafafa",
  },
  goalText: {
    fontSize: 20,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  detailsButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf:"center",
    width:"40%",
  },
  
  detailsButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign:"center",
  },
  deleteButton:{
    marginTop:5,
    fontSize: 16,
    color: "red",
    padding:5,
    borderWidth: 1,
    backgroundColor: "red",
    borderColor:"red",
    borderRadius: 6,
    textAlign: "center",
    overflow: "hidden",
    alignSelf:"center",
    width:"40%"
  },
  deleteButtonText: {
    fontSize: 20,
    color: "white",
    alignSelf:"center",
    fontWeight:"bold",
  },
});
