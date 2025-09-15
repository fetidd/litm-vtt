import index from "../index.html";
import { Entity } from "../litm/entity";
import { Status } from "../litm/status";
import { Tag } from "../litm/tag";
import { handleMessage } from "./handler";

const entities = new Map<string, { entity: Entity, position: { x: number, y: number } }>();
const freezingTag = new Tag("Freezing cold");
freezingTag.isScratched = true;
const onFireTag = new Tag("On fire!");
const guyTag = new Tag("That guy you met at the tavern last week");
const drunkStatus = new Status("Drunk", 3);
entities.set(freezingTag.id, { entity: freezingTag, position: { x: 15, y: 15 } });
entities.set(onFireTag.id, { entity: onFireTag, position: { x: 30, y: 67 } });
entities.set(guyTag.id, { entity: guyTag, position: { x: 70, y: 100 } });
entities.set(drunkStatus.id, { entity: drunkStatus, position: {x: 90, y: 120}});

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
      handleMessage(ws, message, entities, server);
    },

    async open(ws) {
      console.debug(`WebSocket connection opened: ${ws.remoteAddress}`);
      ["game-table", "rolls"].forEach(x => ws.subscribe(x));
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
