import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export default async function handler(req, res) {
  const { goal } = JSON.parse(req.body);

  const client = new BedrockRuntimeClient({
    region: "ap-northeast-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });

  const prompt = `
あなたはプロのコーチです。
ユーザーの目的を達成するためのタスクリストを作成してください。
出力は JSON のみ。

目的: ${goal}

出力例:
{
  "tasks": [
    "ステップ1",
    "ステップ2",
    "ステップ3"
  ]
}
`;

  const command = new InvokeModelCommand({
    modelId: "amazon.nova-lite-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inputText: prompt,
    }),
  });

  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));

  res.status(200).json(JSON.parse(result.outputText));
}
