.env 中配置以下参数

```curl
curl --location 'http://127.0.0.1:3010' \
--header 'Content-Type: application/json' \
--data '{
"message":"你好",
"mode":"普通模式"
}'
```

```
ACCESS_TOKEN=""

DATA='[
{"name":"普通模式","conversation_id":"xxxx","parnt_message_id":"xxx"}
]'
```
