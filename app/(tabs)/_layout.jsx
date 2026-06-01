import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="generate"
        options={{
          title: "生成",
        }}
      />

      <Tabs.Screen
        name="goals"
        options={{
          title: "保存済み",
        }}
      />
    </Tabs>
  );
}
