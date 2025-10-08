import index from "../index.html";
import LitmDatabase from "./database";
import { WebSocketServer } from "@/websocket/WebSocketManager";
import { handleUpdateGameTableEntityPosition } from "./handlers/updateGameTableEntityPosition";
import { handleCreateNewGameTableEntity } from "./handlers/createNewGameTableEntity";
import { handleRollRequest } from "./handlers/rollRequest";
import { handleUpdateGameTableEntityDetails } from "./handlers/updateGameTableEntityDetails";
import { handleDeleteGameTableEntity } from "./handlers/deleteGameTableEntity";
import { handleNewWebSocketConnection } from "./handlers/newWebSocketConnection";

const db = new LitmDatabase("test.db");
const wsServer = new WebSocketServer();

// Register message handlers
wsServer.onMessage("updateGameTableEntityPosition", (ws, message) => handleUpdateGameTableEntityPosition(message, db, server));
wsServer.onMessage("updateGameTableEntityDetails", (ws, message) => handleUpdateGameTableEntityDetails(message, db, server));
wsServer.onMessage("createNewGameTableEntity", (ws, message) => handleCreateNewGameTableEntity(message, db, server));
wsServer.onMessage("rollRequest", (ws, message) => handleRollRequest(message, server));
wsServer.onMessage("deleteGameTableEntity", (ws, message) => handleDeleteGameTableEntity(message, db, server));

const server = Bun.serve<{ authToken: string }, {}>({
  port: 3000,
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds
      console.debug(`Upgrading!`);
      return undefined;
    }

    // handle HTTP request normally
    return new Response("Hello world!");
  },
  websocket: {
    // this is called when a message is received
    async message(ws, message) {
      wsServer.handleMessage(ws, message, db, server);
    },

    async open(ws) {
      handleNewWebSocketConnection(ws, db);
    },

    async close(code, reason) {
      console.debug(`WebSocket closed: ${code} - ${reason}`);
    },

    async drain() {
      console.debug("WebSocket backpressure has drained");
    },
  },

  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req: any) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req: any) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req: any) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: false,
  },
});
console.log(`🚀 Server running at ${server.url}`);
console.log(`WS listening on ws://${server.hostname}:${server.port}`);
