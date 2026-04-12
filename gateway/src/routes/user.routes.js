// gateway/src/routes/user.routes.js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { USER_SERVICE } = require("../config/services");

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: USER_SERVICE,
    changeOrigin: true,

    // ✅ FIX path issue
    pathRewrite: (path) => "/user" + path,

    onProxyReq: (proxyReq, req) => {
      console.log("🔥 USER PROXY:", req.method, "/user" + req.url);

      // 🔥 inject userId from JWT
      if (req.user && req.user.userId) {
        // proxyReq.setHeader("x-user-id", String(req.user.userId));
        console.log("✅ Injected x-user-id:", req.user.userId);
      } else {
        console.log("❌ req.user missing");
      }
    }
  })
);

module.exports = router;