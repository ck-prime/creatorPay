// gateway/src/routes/auth.routes.js

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { AUTH_SERVICE } = require("../config/services");

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: AUTH_SERVICE,
    changeOrigin: true,

    pathRewrite: (path) => "/auth" + path,

    onProxyReq: (proxyReq, req) => {
      console.log("🔥 Proxying:", req.method, "/auth" + req.url);
    }
  })
);

module.exports = router;