// load-tests/signup-test.js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  scenarios: {
    signup_test: {
      executor: "per-vu-iterations",
      vus: 1000,
      iterations: 10, // total = 10k users
      maxDuration: "2m"
    }
  }
};

const BASE_URL = "http://localhost:4001";

export default function () {

  // deterministic ID
  const userId = (__VU - 1) * 10 + __ITER + 1;

  const payload = JSON.stringify({
    email: `user_${userId}@test.com`,
    password: "123456"
  });

  const res = http.post(
    `${BASE_URL}/auth/signup`,
    payload,
    {
      headers: { "Content-Type": "application/json" }
    }
  );

  check(res, {
    "signup success": (r) =>
      r.status === 201 || r.status === 400 // allow "already exists"
  });

  sleep(0.1);
}