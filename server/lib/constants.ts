import * as HttpStatusPhares from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const notFoundSchema = createMessageObjectSchema(
  HttpStatusPhares.NOT_FOUND
);
