import Koa from "koa";
import bodyParser from "es-koa-body";
import { ChatGPTUnofficialProxyAPI } from "chatgpt";
import dotenv from "dotenv";

dotenv.config(); // 加载环境变量

const app = new Koa();
const port = process.env.PORT || 3010;

const accessToken = process.env.ACCESS_TOKEN;
const conversationId = process.env.CONVERSATION_ID;
const parentMessageId = process.env.PARENT_MESSAGE_ID;

app.use(bodyParser());

const api = new ChatGPTUnofficialProxyAPI({
  accessToken: accessToken,
  apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation",
});

app.use(async (ctx) => {
  const { message } = ctx.request.body;
  console.log(message);
  try {
    const response = await api.sendMessage(message, {
      conversationId: conversationId,
      parentMessageId: parentMessageId,
    });

    const reply = response.text;
    ctx.body = { reply };
    console.log(reply);
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
