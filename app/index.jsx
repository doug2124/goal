import { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const ORANGE       = "#F97316";
const ORANGE_LIGHT = "#FFF7ED";
const DARK         = "#1C1917";
const MID          = "#57534E";
const LIGHT        = "#F5F5F4";
const WHITE        = "#FFFFFF";

export default function HomeScreen() {
  const router = useRouter();

  const fade1 = useRef(new Animated.Value(0)).current;
  const fade2 = useRef(new Animated.Value(0)).current;
  const fade3 = useRef(new Animated.Value(0)).current;
  const fade4 = useRef(new Animated.Value(0)).current;
  const slide1 = useRef(new Animated.Value(30)).current;
  const slide2 = useRef(new Animated.Value(30)).current;
  const slide3 = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(180, [
      Animated.parallel([
        Animated.timing(fade1, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slide1, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fade2, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slide2, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fade3, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slide3, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(fade4, { toValue: 1, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => router.replace("/(stack)/generate")}
        activeOpacity={0.95}
      >
        {/* Top label */}
        <Animated.View style={[styles.labelRow, { opacity: fade1, transform: [{ translateY: slide1 }] }]}>
          <View style={styles.labelBadge}>
            <Text style={styles.labelText}>AI POWERED</Text>
          </View>
        </Animated.View>

        {/* Main title */}
        <Animated.View style={{ opacity: fade2, transform: [{ translateY: slide2 }] }}>
          <Text style={styles.title}>GOAL{"\n"}HELPER</Text>
          <View style={styles.titleDivider} />
        </Animated.View>

        {/* Description */}
        <Animated.Text style={[styles.desc, { opacity: fade3, transform: [{ translateY: slide3 }] }]}>
          AIがあなたの目的達成を{"\n"}サポートします
        </Animated.Text>

        {/* Tap hint */}
        <Animated.View style={[styles.tapHint, { opacity: fade4 }]}>
          <Text style={styles.tapText}>タップして開始</Text>
          <Text style={styles.tapArrow}>→</Text>
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  /* Label */
  labelRow: { marginBottom: 28 },
  labelBadge: {
    alignSelf: "flex-start",
    backgroundColor: ORANGE_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  labelText: { fontSize: 11, fontWeight: "700", letterSpacing: 2.5, color: ORANGE },

  /* Title */
  title: {
    fontSize: 64,
    fontWeight: "800",
    color: DARK,
    letterSpacing: -2,
    lineHeight: 68,
  },
  titleDivider: {
    width: 56,
    height: 5,
    backgroundColor: ORANGE,
    borderRadius: 3,
    marginTop: 20,
    marginBottom: 24,
  },

  /* Description */
  desc: {
    fontSize: 18,
    color: MID,
    lineHeight: 30,
    fontWeight: "500",
    marginBottom: 64,
  },

  /* Tap hint */
  tapHint: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: ORANGE,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  tapText: { color: WHITE, fontSize: 16, fontWeight: "700" },
  tapArrow: { color: WHITE, fontSize: 18, fontWeight: "700" },
});
