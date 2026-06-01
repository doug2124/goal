import { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF9800" />
          <Text style={{ marginTop: 10 }}>読み込み中...</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <Text style={styles.title}>進行中の目的</Text>

          {goals.map(goal => (
            <View key={goal.goalId} style={styles.goalItem}>
              <Text style={styles.goalText}>• {goal.description}</Text>

              <Button
                title="詳細"
                onPress={() =>
                  router.push({
                    pathname: "/tasksDetails",
                    params: {
                      goalId: goal.goalId,
                      description: goal.description,
                    },
                  })
                }
              />
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
    backgroundColor:"#D3D3D3"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
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
  }
});
