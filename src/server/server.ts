import index from "../index.html";
import Entity from "../litm/entity";
import Tag from "../litm/tag";
import { handleMessage } from "./handler";

const entities = new Map<string, { entity: Entity, position: { x: number, y: number } }>();
const freezingTag = new Tag("Freezing cold");
const onFireTag = new Tag("On fire!");
entities.set(freezingTag.id, { entity: freezingTag, position: { x: 15, y: 15 } });
entities.set(onFireTag.id, { entity: onFireTag, position: { x: 30, y: 67 } });

const server = Bun.serve<{ authToken: string }, {}>({
  port: 3000,
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds
      return undefined;
    }

    // handle HTTP request normally
    return new Response("Hello world!");
  },
  websocket: {
    // this is called when a message is received
    async message(ws, message) {
      // console.debug(`WebSocket message received: ${message}`);
      handleMessage(ws, message, entities, server);
    },

    async open(ws) {
      console.debug(`WebSocket connection opened: ${ws.remoteAddress}`);
      ws.subscribe("game-table");
      const syncMessage = {
        type: 'gameTableEntitySync',
        entities: Array.from(entities.values())
      };
      ws.send(JSON.stringify(syncMessage));
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
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
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
    console: true,
  },
});
console.log(`🚀 Server running at ${server.url}`);
console.log(`WS listening on ws://${server.hostname}:${server.port}`);
