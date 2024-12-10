import { apiReference } from "@scalar/hono-api-reference";
import packageJSON from "../../package.json";

import type { AppType } from "../types/app.schema";

export default function configureOpenApi(app: AppType) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "MiroTron API",
    },
  });
  app.get(
    "/reference",
    apiReference({
      layout: "classic",
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
      spec: {
        url: "/doc",
      },
    })
  );
}
