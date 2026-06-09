# Goal Helper App (React Native + Expo + AWS)

「目的 → タスク → AI による改善提案」という流れで  
日々の目標達成をサポートする React Native アプリです。

AWS Lambda / API Gateway / DynamoDB を使って  
タスクの保存・更新・削除、AI フィードバック生成を行います。

---

## ✨ 主な機能

### 🎯 1. 目的（Goal）の作成・管理
- Goal を追加
- Goal ごとに Task を紐づけて管理
- Goal の詳細ページへ遷移

---

### 📝 2. タスク管理（Tasks）
- タスクの追加
- タスクの削除
- タスクの完了（Done）
- 進行中タスク / 完了タスク の自動分類
- 長押しで「選択モード」に入り、削除・完了・AI に聞く が表示される

---

### 🤖 3. AI に質問（AI Ask）
- 選択したタスクの内容をもとに AI に質問できる
- AWS Lambda → Bedrock → Lambda → アプリ の流れで回答生成
- 質問送信中はローディングアニメーションを表示
- 回答ページ（AiAnswer）へ自動遷移

---

### 💬 4. AI の回答表示（AI Answer）
- Lambda が返した `feedBack` を画面に表示
- Goal と Task に合わせた改善案やアドバイスを確認できる

---

## 🏗 技術スタック

### Frontend
- React Native (Expo)
- expo-router
- react-native-safe-area-context
- react-native-uuid

### Backend
- AWS Lambda
- AWS API Gateway
- AWS DynamoDB

### AI
- AWS Bedrock（モデル: nova-lite）

---

## 📂 ディレクトリ構成（主要ファイル）

app/
├─ (stack)/
│   ├─ goals.jsx
│   ├─ tasks.jsx
│   ├─ tasksDetails.jsx
│   ├─ aiAsk.jsx
│   └─ aiAnswer.jsx
├─ _layout.jsx
└─ index.jsx


---

## 🔗 API エンドポイント

| 機能 | メソッド | エンドポイント |
|------|----------|----------------|
| タスク取得 | GET | `/getTask?goalId=xxx` |
| タスク追加 | POST | `/insertTask` |
| タスク削除 | POST | `/deleteTask` |
| タスク更新 | POST | `/updateTasks` |
| AI フィードバック生成 | POST | `/generateFeedBack` |

---

## 🚀 使い方

### 1. 目的を追加
ホーム画面から Goal を作成。

### 2. タスクを追加
Goal 詳細ページでタスクを追加。

### 3. タスクを長押し
選択モードに入り、以下が表示される：
- AI に聞く
- 削除
- 完了

### 4. AI に聞く
タスク内容をもとに AI が改善案を生成。

### 5. 回答ページへ遷移
AI の返答を確認。

---

## ⚙️ 環境変数（例）

AWS_REGION=ap-northeast-1
DYNAMO_TABLE=GoalTasks


---

# 🌍 English Version

## 📘 Goal Helper App (React Native + Expo + AWS)

This app helps users achieve their goals through a simple flow:

**Goal → Tasks → AI Feedback**

It uses AWS Lambda, API Gateway, and DynamoDB to store, update, and delete tasks,  
and AWS Bedrock to generate AI-based improvement suggestions.

---

## ✨ Features

### 🎯 1. Goal Management
- Create new goals
- Manage tasks under each goal
- Navigate to goal detail pages

---

### 📝 2. Task Management
- Add tasks
- Delete tasks
- Mark tasks as completed
- Automatically separates “In Progress” and “Done”
- Long-press to enter **Selection Mode**, enabling:
  - Ask AI
  - Delete
  - Complete

---

### 🤖 3. Ask AI (AI Ask)
- Ask AI for advice based on the selected task
- Backend flow: **Lambda → Bedrock → Lambda → App**
- Shows loading animation while generating feedback
- Automatically navigates to the AI Answer page

---

### 💬 4. AI Answer Display
- Shows the `feedBack` returned from Lambda
- Provides actionable suggestions based on the goal and task

---

## 🏗 Tech Stack

### Frontend
- React Native (Expo)
- expo-router
- react-native-safe-area-context
- react-native-uuid

### Backend
- AWS Lambda
- AWS API Gateway
- AWS DynamoDB

### AI
- AWS Bedrock (nova-lite model)

---

## 📂 Directory Structure

app/
├─ (stack)/
│   ├─ goals.jsx
│   ├─ tasks.jsx
│   ├─ tasksDetails.jsx
│   ├─ aiAsk.jsx
│   └─ aiAnswer.jsx
├─ _layout.jsx
└─ index.jsx

---


---

## 🔗 API Endpoints

| Feature | Method | Endpoint |
|--------|--------|----------|
| Get tasks | GET | `/getTask?goalId=xxx` |
| Add task | POST | `/insertTask` |
| Delete task | POST | `/deleteTask` |
| Update task | POST | `/updateTasks` |
| Generate AI feedback | POST | `/generateFeedBack` |

---

## 🚀 How to Use

1. Create a goal  
2. Add tasks under the goal  
3. Long-press a task to enter selection mode  
4. Tap **Ask AI** to get suggestions  
5. View AI feedback on the answer page  

---

## ⚙️ Environment Variables

AWS_REGION=ap-northeast-1
DYNAMO_TABLE=GoalTasks


# Expo Router Example

Use [`expo-router`](https://docs.expo.dev/router/introduction/) to build native navigation using files in the `app/` directory.

## Launch your own

[![Launch with Expo](https://github.com/expo/examples/blob/master/.gh-assets/launch.svg?raw=true)](https://launch.expo.dev/?github=https://github.com/expo/examples/tree/master/with-router)

## 🚀 How to use

```sh
npx create-expo-app -e with-router
```

## Deploy

Deploy on all platforms with Expo Application Services (EAS).

- Deploy the website: `npx eas-cli deploy` — [Learn more](https://docs.expo.dev/eas/hosting/get-started/)
- Deploy on iOS and Android using: `npx eas-cli build` — [Learn more](https://expo.dev/eas)

## 📝 Notes

- [Expo Router: Docs](https://docs.expo.dev/router/introduction/)
