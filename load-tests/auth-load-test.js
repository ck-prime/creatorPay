// load-tests/auth-load-test.js
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 1000,
  duration: "60s"
};

const BASE_URL = "http://localhost:4001";

export default function () {

  // cycle through 10k users
  const userId = ((__VU - 1) * 100 + __ITER) % 10000 + 1;

  const email = `user_${userId}@test.com`;
  const password = "123456";

  // LOGIN
  let loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email, password }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );

  check(loginRes, {
    "login success": (r) => r.status === 200
  });

  if (loginRes.status !== 200) return;

  const body = JSON.parse(loginRes.body);

  const accessToken = body.token; // based on your API
  const refreshToken = body.refreshToken;

  // PROTECTED ROUTE
  let meRes = http.get(`${BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  check(meRes, {
    "protected route works": (r) => r.status === 200
  });

  // REFRESH
  let refreshRes = http.post(
    `${BASE_URL}/auth/refresh`,
    JSON.stringify({ refreshToken }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );

  check(refreshRes, {
    "refresh works": (r) => r.status === 200
  });

  // LOGOUT
  let logoutRes = http.post(
    `${BASE_URL}/auth/logout`,
    JSON.stringify({ refreshToken }),
    {
      headers: { "Content-Type": "application/json" }
    }
  );

  check(logoutRes, {
    "logout works": (r) => r.status === 200
  });

  sleep(1);
}