import test from "node:test";
import assert from "node:assert";

import {
  generateToken,
  setTokenCookie,
  clearTokenCookie,
} from "../utils/generateToken.js";

// ===================== Token Generation =====================

test("generateToken: returns a non-empty string", () => {
  const token = generateToken("abc123");
  assert.ok(typeof token === "string");
  assert.ok(token.length > 0);
});

test("generateToken: returns JWT format (3 dot-separated parts)", () => {
  const token = generateToken("user_id_here");
  const parts = token.split(".");
  assert.strictEqual(parts.length, 3, "JWT should have 3 parts");
});

test("generateToken: different IDs produce different tokens", () => {
  const token1 = generateToken("id_1");
  const token2 = generateToken("id_2");
  assert.notStrictEqual(token1, token2);
});

// ===================== Cookie Functions =====================

test("setTokenCookie: calls res.cookie", () => {
  let called = false;
  const mockRes = {
    cookie(name, value, options) {
      called = true;
      assert.ok(typeof name === "string");
      assert.ok(typeof value === "string");
      assert.strictEqual(options.httpOnly, true);
    },
  };

  setTokenCookie(mockRes, "some-token");
  assert.ok(called, "res.cookie should have been called");
});

test("clearTokenCookie: calls res.clearCookie", () => {
  let called = false;
  const mockRes = {
    clearCookie(name, options) {
      called = true;
      assert.ok(typeof name === "string");
      assert.strictEqual(options.httpOnly, true);
    },
  };

  clearTokenCookie(mockRes);
  assert.ok(called, "res.clearCookie should have been called");
});
