import LitmDatabase from "./database";
import { handleMessage } from "./handler";
import { handleNewWebSocketConnection } from "./handlers/newWebSocketConnection";

const db = new LitmDatabase(":memory:");
import index from "../index.html";

const server = Bun.serve<{ authToken: string }, {}>({
  port: 3000,
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds
        console.debug(`Upgrading!`)
      return undefined;
    }

    // handle HTTP request normally
    return new Response("Hello world!");
  },
  websocket: {
    // this is called when a message is received
    async message(ws, message) {
      handleMessage(ws, message, db, server);
    },

    async open(ws) {
      handleNewWebSocketConnection(ws, db);
    },

    async close(code, reason) {
      console.debug(`WebSocket closed: ${code} - ${reason}`);
    },

    async drain() {
      console.debug("WebSocket backpressure has drained");
    }
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
