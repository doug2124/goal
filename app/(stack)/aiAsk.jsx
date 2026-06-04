import { View, Text, TextInput, StyleSheet,TouchableOpacity,ActivityIndicator } from "react-native";
import { useLocalSearchParams,router } from "expo-router";
import { useState } from "react"

export default function AiAsk() {
  const { goal, task } = useLocalSearchParams();
  const [reflection,setReflection]=useState("");
  const [loading,setLoading]=useState(false);

    async function fetchFeedBack(){
        try{
        setLoading(true);
        const response = await fetch(
            "https://pf44g8uhx8.execute-api.ap-northeast-1.amazonaws.com/prod/generateFeedBack",
        {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            goal,
            task,
            reflection
        })
        }
    );
        const data = await response.json();
        console.log("AI response",data);
        router.push({
            pathname:"/aiAnswer",
            params:{
                answer:data.feedBack
            }
        });
    }finally{
        setLoading(false);
    }
}
if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={{fontSize:25, marginTop: 10 ,fontWeight:"bold"}}>AI が考えています...</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI に質問する</Text>

      <Text style={styles.label}>目的:</Text>
      <Text style={styles.box}>{goal}</Text>

      <Text style={styles.label}>選択されたタスク:</Text>
      <Text style={styles.box}>{task}</Text>

      <Text style={styles.label}>質問内容:</Text>
      <TextInput
        value={reflection}
        onChangeText={setReflection}
        style={styles.input}
        placeholder="AI に聞きたいことを入力..."
        multiline
      />
      <TouchableOpacity style={styles.aiButton} onPress={fetchFeedBack}>
        <Text style={styles.aiButtonText} >AIに聞く</Text>
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20,backgroundColor:"white",},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
},
  label: { fontSize: 20, marginTop: 10 },
  box: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
    fontSize: 20,
    borderColor:"#ccc",
    borderWidth:2,
  },
  input: {
    marginBottom:10,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    height: 120,
    fontSize: 20,
    backgroundColor:"#F2F2F7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  aiButton: {
    minWidth: "40%",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#007BFF",
    backgroundColor:"#007BFF",
    borderWidth: 1,
    padding: 5,
  },
  aiButtonText: {
    color: "white",
    fontSize: 20,
    alignSelf: "center",
  },
});
