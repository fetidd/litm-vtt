import { useState } from "react";
import type User from "@/user";

interface LoginScreenProps {
  onLogin: (user: User, session: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [sessionCode, setSessionCode] = useState('');

  const handleLogin = () => {
    if (username.trim() && sessionCode.trim().length === 5) {
      const newUser = { username: username.trim(), role: "player" } as User;
      onLogin(newUser, sessionCode.trim().toUpperCase());
    }
  };

  const handleCreateSession = () => {
    if (username.trim()) {
      const newSessionCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      const newUser = { username: username.trim(), role: "narrator" } as User;
      onLogin(newUser, newSessionCode);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ height: "40px", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", background: "#333", color: "white" }}>
        <span style={{ fontSize: "14px", color: "#888" }}>Not connected</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px" }}>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "8px", fontSize: "16px", minWidth: "200px" }}
        />
        <input
          type="text"
          placeholder="Session Code (5 chars)"
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value.toUpperCase().slice(0, 5))}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          style={{ padding: "8px", fontSize: "16px", minWidth: "200px" }}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            onClick={handleLogin} 
            disabled={!username.trim() || sessionCode.length !== 5}
            style={{ padding: "8px 16px", fontSize: "16px" }}
          >
            Join Session
          </button>
          <button 
            onClick={handleCreateSession}
            disabled={!username.trim()}
            style={{ padding: "8px 16px", fontSize: "16px" }}
          >
            Create New Session
          </button>
        </div>
      </div>
    </div>
  );
}