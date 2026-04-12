// gateway/src/routes/social.routes.js

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { GRAPH_SERVICE } = require("../config/services");

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: GRAPH_SERVICE,
    changeOrigin: true,

    pathRewrite: (path) => "/social" + path,

    onProxyReq: (proxyReq, req) => {
      console.log("🔥 SOCIAL PROXY:", req.method, "/social" + req.url);

      if (req.user && req.user.userId) {
        proxyReq.setHeader("x-user-id", String(req.user.userId));
        console.log("✅ Injected x-user-id:", req.user.userId);
      } else {
        console.log("❌ req.user missing");
      }
    },
  })
);

module.exports = router;