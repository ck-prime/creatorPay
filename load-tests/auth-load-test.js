// load-tests/auth-load-test.js
import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Rate } from "k6/metrics";

// 🔥 Custom metrics
const loginDuration = new Trend("login_duration");
const successRate = new Rate("success_rate");

export const options = {
  stages: [
    { duration: "20s", target: 100 },
    { duration: "40s", target: 300 },
    { duration: "60s", target: 500 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"],
    success_rate: ["rate>0.9"],
  },
};

const BASE_URL = "http://localhost:4001";

export default function () {
  const userId = ((__VU - 1) * 100 + __ITER) % 10000 + 1;

  const email = `user_${userId}@test.com`;
  const password = "123456";

  // 🔥 LOGIN
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email, password }),
    {
      headers: { "Content-Type": "application/json" },
      timeout: "5s",
    }
  );

  const loginOk = check(loginRes, {
    "login success": (r) => r.status === 200,
  });

  loginDuration.add(loginRes.timings.duration);
  successRate.add(loginOk);

  if (!loginOk) {
    console.error(`Login failed for ${email}: ${loginRes.status}`);
    return;
  }

  const body = JSON.parse(loginRes.body);
  const accessToken = body.accessToken;
  const refreshToken = body.refreshToken;

  // 🔥 PROTECTED ROUTE
  const meRes = http.get(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  check(meRes, {
    "protected route works": (r) => r.status === 200,
  });

  // 🔥 REFRESH
  const refreshRes = http.post(
    `${BASE_URL}/auth/refresh`,
    JSON.stringify({ refreshToken }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(refreshRes, {
    "refresh works": (r) => r.status === 200,
  });

  // 🔥 LOGOUT
  const logoutRes = http.post(
    `${BASE_URL}/auth/logout`,
    JSON.stringify({ refreshToken }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  check(logoutRes, {
    "logout works": (r) => r.status === 200,
  });

  sleep(1);
}

// 🔥 SUMMARY REPORT
export function handleSummary(data) {
  console.log("\n🔥 AUTH TEST SUMMARY 🔥");

  const metrics = data.metrics;

  // ✅ Safe extraction
  const totalRequests = metrics.http_reqs?.values?.count || 0;
  const failedRequests = metrics.http_req_failed?.values?.passes || 0;

  const avg = metrics.http_req_duration?.values?.avg || 0;
  const p95 = metrics.http_req_duration?.values?.["p(95)"] || 0;

  // ✅ Correct success rate
  const successRate =
    totalRequests > 0
      ? ((totalRequests - failedRequests) / totalRequests) * 100
      : 0;

  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Success Rate: ${successRate.toFixed(2)}%`);
  console.log(`Avg Latency: ${avg.toFixed(2)} ms`);
  console.log(`P95 Latency: ${p95.toFixed(2)} ms`);

  return {
    "auth-summary.json": JSON.stringify(data, null, 2),
  };
}