"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function useAuthCheck() {
  const [authStatus, setAuthStatus] = useState("checking"); // "checking" | "valid" | "expired"

  useEffect(() => {
    // Prevent SSR / hydration mismatches
    if (typeof window === "undefined") return;

    console.log("🔍 Running useAuthCheck...");
    let token;

    try {
      token = localStorage.getItem("token");
    } catch (err) {
      console.warn("⚠️ Could not access localStorage:", err);
      setAuthStatus("expired");
      return;
    }

    if (!token || token === "undefined" || token === "null") {
      console.log("❌ No token found → expired");
      setAuthStatus("expired");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("✅ Decoded token:", decoded);

      if (!decoded.exp) {
        console.log("⚠️ No exp field — treating as valid");
        setAuthStatus("valid");
        return;
      }

      const expTime = decoded.exp * 1000;
      const now = Date.now();

      if (expTime < now) {
        console.log("⏰ Token expired → clearing + expired");
        localStorage.removeItem("token");
        setAuthStatus("expired");
      } else {
        console.log("🟢 Token valid until", new Date(expTime).toLocaleString());
        setAuthStatus("valid");
      }
    } catch (err) {
      console.error("💥 Invalid token specified:", err.message);
      localStorage.removeItem("token");
      setAuthStatus("expired");
    }
  }, []);

  return authStatus;
}
