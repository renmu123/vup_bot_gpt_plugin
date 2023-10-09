import Koa from "koa";
import bodyParser from "es-koa-body";
import { ChatGPTUnofficialProxyAPI } from "chatgpt";
import dotenv from "dotenv";

dotenv.config(); // 加载环境变量

const app = new Koa();
const port = process.env.PORT || 3010;

const accessToken = process.env.ACCESS_TOKEN;

app.use(bodyParser());

const api = new ChatGPTUnofficialProxyAPI({
  accessToken: accessToken,
  apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation",
});

app.use(async (ctx) => {
  const { message } = ctx.request.body;

  try {
    const response = await api.sendMessage(message, {
      conversationId: "af42aa0f-cd6b-4ba8-814e-c824318d2ed3",
      parentMessageId: "d001827f-f3a5-45ee-bed8-30441d1b640b",
    });

    const reply = response.text;
    ctx.body = { reply };
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
