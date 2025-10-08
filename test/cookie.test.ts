import { describe, it, expect, beforeEach } from "bun:test";
import { setCookie, getCookie, deleteCookie } from "@/cookie";

// Mock document.cookie
const mockCookie = {
  value: "",
  get cookie() {
    return this.value;
  },
  set cookie(val: string) {
    this.value = val;
  }
};

Object.defineProperty(global, "document", {
  value: mockCookie,
  writable: true
});

describe("cookie utilities", () => {
  beforeEach(() => {
    mockCookie.value = "";
  });

  describe("setCookie", () => {
    it("should set cookie with default expiration", () => {
      setCookie("testName", "testValue");
      
      expect(document.cookie).toContain("testName=testValue");
      expect(document.cookie).toContain("path=/");
      expect(document.cookie).toContain("expires=");
    });

    it("should set cookie with custom expiration days", () => {
      setCookie("testName", "testValue", 7);
      
      expect(document.cookie).toContain("testName=testValue");
      expect(document.cookie).toContain("path=/");
    });

    it("should encode cookie value", () => {
      setCookie("testName", "test value with spaces");
      
      expect(document.cookie).toContain("testName=test%20value%20with%20spaces");
    });
  });

  describe("getCookie", () => {
    it("should return null for non-existent cookie", () => {
      const result = getCookie("nonExistent");
      
      expect(result).toBeNull();
    });

    it("should return cookie value", () => {
      mockCookie.value = "testName=testValue; path=/";
      
      const result = getCookie("testName");
      
      expect(result).toBe("testValue");
    });

    it("should decode cookie value", () => {
      mockCookie.value = "testName=test%20value; path=/";
      
      const result = getCookie("testName");
      
      expect(result).toBe("test value");
    });

    it("should handle multiple cookies", () => {
      mockCookie.value = "cookie1=value1; cookie2=value2; cookie3=value3";
      
      expect(getCookie("cookie1")).toBe("value1");
      expect(getCookie("cookie2")).toBe("value2");
      expect(getCookie("cookie3")).toBe("value3");
      expect(getCookie("nonExistent")).toBeNull();
    });
  });

  describe("deleteCookie", () => {
    it("should delete cookie by setting negative expiration", () => {
      deleteCookie("testName");
      
      expect(document.cookie).toContain("testName=");
      expect(document.cookie).toContain("expires=");
    });
  });
});