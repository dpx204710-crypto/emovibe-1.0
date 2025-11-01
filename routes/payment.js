import express from 'express';
const router = express.Router();

// 占位接口
router.post('/paypal', (req, res) => res.json({ success: true, message: 'PayPal API not implemented' }));
router.post('/wechat', (req, res) => res.json({ success: true, message: 'WeChat Pay API not implemented' }));

export default router;
