import { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const fade1 = useRef(new Animated.Value(0)).current;
  const fade2 = useRef(new Animated.Value(0)).current;
  const fade3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fade1, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fade2, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(fade3, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        <TouchableOpacity onPress={() => router.replace("/(stack)/generate")}>

          <Animated.Text style={[styles.title, { opacity: fade1 }]}>
            GOAL HELPER
          </Animated.Text>

          <Animated.Text style={[styles.buttonText, { opacity: fade2 }]}>
            AIがあなたの目的達成をサポートします。
          </Animated.Text>

          <Animated.Text style={[styles.subText, { opacity: fade3 }]}>
            タップして開始
          </Animated.Text>

        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
    title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    paddingBottom:40
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },
  subText: {
    fontSize: 20,
    color: "#555",
    textAlign: "center",
    marginTop: 400
  }
});
