<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EmoVibe 聊天室</title>
    <style>
        body { font-family: 'Roboto', sans-serif; background: #f5faff; margin:0; }
        header { background: #007bff; color: white; padding: 15px 30px; text-align:center; }
        #chat-container { max-width: 800px; margin: 30px auto; background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);}
        #messages { height: 400px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; border-radius: 8px; margin-bottom: 15px; background:#e6f0ff;}
        .message { margin-bottom: 10px; }
        #input-container { display: flex; gap: 10px; }
        #input-container input { flex:1; padding:10px; border-radius:8px; border:1px solid #ccc; }
        #input-container button { padding:10px 20px; border:none; border-radius:8px; background:#007bff; color:white; cursor:pointer; }
    </style>
</head>
<body>
    <header>
        <h1>EmoVibe 聊天室</h1>
    </header>

    <div id="chat-container">
        <div id="messages"></div>
        <div id="input-container">
            <input type="text" id="message-input" placeholder="输入消息...">
            <button onclick="sendMessage()">发送</button>
        </div>
    </div>

    <script type="module">
        import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

        // 用你的 Supabase 信息替换下面
        const supabaseUrl = 'YOUR_SUPABASE_URL'
        const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
        const supabase = createClient(supabaseUrl, supabaseKey)

        const messagesDiv = document.getElementById('messages')

        // 订阅消息
        supabase
            .channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
                const msg = payload.new
                const div = document.createElement('div')
                div.className = 'message'
                div.textContent = `${msg.user}: ${msg.content}`
                messagesDiv.appendChild(div)
                messagesDiv.scrollTop = messagesDiv.scrollHeight
            })
            .subscribe()

        async function sendMessage() {
            const input = document.getElementById('message-input')
            const content = input.value
            if (!content) return

            // 假设用户名字是 Guest（可以根据登录修改）
            await supabase.from('messages').insert([{ user: 'Guest', content }])
            input.value = ''
        }
    </script>
</body>
</html>