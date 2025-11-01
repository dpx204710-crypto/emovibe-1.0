<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EmoVibe - 专业情感陪聊</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Roboto', sans-serif; background-color: #f5faff; color: #333; }
        header { background-color: #007bff; color: white; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
        header .logo { font-size: 28px; font-weight: 700; letter-spacing: 1px; }
        nav a { color: white; margin-left: 20px; text-decoration: none; font-weight: 500; }
        nav a:hover { text-decoration: underline; }
        .hero { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; text-align: center; background: linear-gradient(135deg, #e0f0ff, #cce5ff); }
        .hero h1 { font-size: 48px; margin-bottom: 20px; color: #007bff; }
        .hero p { font-size: 20px; margin-bottom: 30px; max-width: 600px; }
        .hero .btn { padding: 15px 30px; font-size: 18px; margin: 5px; border: none; border-radius: 6px; cursor: pointer; transition: 0.3s; }
        .btn-primary { background-color: #007bff; color: white; }
        .btn-primary:hover { background-color: #0056b3; }
        .btn-secondary { background-color: #00c8ff; color: white; }
        .btn-secondary:hover { background-color: #009ecf; }
        .features { display: flex; justify-content: center; gap: 40px; padding: 60px 20px; flex-wrap: wrap; }
        .feature { background-color: white; padding: 30px; border-radius: 12px; width: 250px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center; }
        .feature h3 { margin-bottom: 15px; color: #007bff; }
        footer { text-align: center; padding: 20px; background-color: #e0f0ff; margin-top: 40px; }
    </style>
</head>
<body>
    <header>
        <div class="logo">EmoVibe</div>
        <nav>
            <a href="#chat">聊天室</a>
            <a href="#ai">AI自定义角色</a>
            <a href="#subscribe">充值会员</a>
            <a href="#contact">联系我们</a>
        </nav>
    </header>

    <section class="hero">
        <h1>专业情感陪聊平台</h1>
        <p>与真人或AI陪聊，分享你的心情，结识温暖的人。立即加入会员，享受专属陪聊体验。</p>
        <div>
            <button class="btn btn-primary" onclick="window.location.href='#subscribe'">开通会员 $99/周</button>
            <button class="btn btn-secondary" onclick="window.location.href='#ai'">AI自定义角色</button>
        </div>
    </section>

    <section class="features">
        <div class="feature">
            <h3>真人陪聊</h3>
            <p>专业陪聊师倾听你的心声，给予温暖和建议。</p>
        </div>
        <div class="feature">
            <h3>AI角色陪聊</h3>
            <p>自定义AI陪聊角色，随时随地获得个性化陪伴。</p>
        </div>
        <div class="feature">
            <h3>社交分享</h3>
            <p>可选择分享你的社交账号，轻松建立连接与朋友。</p>
        </div>
    </section>

    <footer>
        &copy; 2025 EmoVibe. All Rights Reserved.
    </footer>
</body>
</html>