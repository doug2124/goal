import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        animation: "slide_from_right",
        headerShown: true,
        headerBackVisible: true,
        headerTitleAlign: "center",
        headerBackButtonDisplayMode: "minimal",
        title:"",
      }}
    >
      <Stack.Screen name="goals" />
      <Stack.Screen name="tasks" />
      <Stack.Screen name="tasksDetails" />
    </Stack>
  );
}
