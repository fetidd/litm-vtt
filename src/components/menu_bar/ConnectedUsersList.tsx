import type User from "@/user";

interface ConnectedUsersListProps {
  users: User[];
}

export default function ConnectedUsersList({ users }: ConnectedUsersListProps) {
  if (users.length === 0) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ fontSize: "12px" }}>Users:</span>
      {users.map((user, i) => (
        <span
          key={i}
          style={{
            fontSize: "12px",
            color: user.role === "narrator" ? "#FFD700" : "#FFF",
          }}
        >
          {user.username}
          {user.role === "narrator" ? " (N)" : ""}
          {i < users.length - 1 ? "," : ""}
        </span>
      ))}
    </div>
  );
}