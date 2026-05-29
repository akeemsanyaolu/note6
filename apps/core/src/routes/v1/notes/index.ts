import { OpenAPIHonoWithAuth } from "@/helpers/app";

import { mount as mountList } from "./get.js";
import { mount as mountCreate } from "./post.js";
import { mount as mountGetOne } from "./[id]/get.js";
import { mount as mountUpdate } from "./[id]/patch.js";
import { mount as mountDelete } from "./[id]/delete.js";

const notesRouter = new OpenAPIHonoWithAuth();

mountList(notesRouter);
mountCreate(notesRouter);
mountGetOne(notesRouter);
mountUpdate(notesRouter);
mountDelete(notesRouter);

export default notesRouter;
