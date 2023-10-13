import Koa from "koa";
import { koaBody } from "koa-body";
import Router from "koa-router";
import { ChatGPTUnofficialProxyAPI } from "chatgpt";
import dotenv from "dotenv";

dotenv.config(); // 加载环境变量

const app = new Koa();
const router = new Router();

const port = process.env.PORT || 3010;
const accessToken = process.env.ACCESS_TOKEN;
const DATA = JSON.parse(process.env.DATA);

const api = new ChatGPTUnofficialProxyAPI({
  accessToken: accessToken,
  apiReverseProxyUrl: "https://ai.fakeopen.com/api/conversation",
});

router.post("/", koaBody(), async (ctx) => {
  console.log(ctx, ctx.request.body);
  const { message, mode } = ctx.request.body;

  if (DATA.length === 0) {
    ctx.status = 500;
    ctx.body = { reply: "请先进行配置" };
    return;
  }
  const item = DATA.filter((item) => item.name === mode)[0];

  let conversationId = "";
  let parentMessageId = "";
  if (item === undefined) {
    conversationId = DATA[0].conversation_id;
    parentMessageId = DATA[0].parnt_message_id;
  } else {
    conversationId = item.conversation_id;
    parentMessageId = item.parnt_message_id;
  }
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

router.get("/list", koaBody(), async (ctx) => {
  ctx.body = DATA.map((item) => item.name);
});

app.use(router.routes());
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
