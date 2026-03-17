// load-tests/signup-test.js
import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Rate } from "k6/metrics";

// 🔥 Custom metrics
const signupDuration = new Trend("signup_duration");
const signupSuccess = new Rate("signup_success");

export const options = {
  stages: [
    { duration: "20s", target: 50 },
    { duration: "40s", target: 100 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"],
    signup_success: ["rate>0.9"],
  },
};

const BASE_URL = "http://localhost:4001";

export default function () {
  const userId = (__VU - 1) * 100 + __ITER + 1;

  const payload = JSON.stringify({
    email: `user_${userId}@test.com`,
    password: "123456",
  });

  const res = http.post(
    `${BASE_URL}/auth/signup`,
    payload,
    {
      headers: { "Content-Type": "application/json" },
      timeout: "5s",
    }
  );

  const ok = check(res, {
    "signup success": (r) =>
      r.status === 201 || r.status === 400,
  });

  signupDuration.add(res.timings.duration);
  signupSuccess.add(ok);

  sleep(0.2);
}

// 🔥 SUMMARY REPORT
export function handleSummary(data) {
  console.log("\n🔥 SIGNUP TEST SUMMARY 🔥");

  const metrics = data.metrics;

  const totalRequests = metrics.http_reqs?.values?.count || 0;
  const totalChecks = metrics.checks?.values?.count || 1;
  const passedChecks = metrics.checks?.values?.passes || 0;

  const successRate = (passedChecks / totalChecks) * 100;

  const avg = metrics.http_req_duration?.values?.avg || 0;
  const p95 = metrics.http_req_duration?.values?.["p(95)"] || 0;

  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Success Rate: ${successRate.toFixed(2)}%`);
  console.log(`Avg Latency: ${avg.toFixed(2)} ms`);
  console.log(`P95 Latency: ${p95.toFixed(2)} ms`);

  return {
    "signup-summary.json": JSON.stringify(data, null, 2),
  };
}