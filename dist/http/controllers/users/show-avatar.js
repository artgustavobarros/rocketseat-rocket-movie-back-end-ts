"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/http/controllers/users/show-avatar.ts
var show_avatar_exports = {};
__export(show_avatar_exports, {
  showAvatar: () => showAvatar
});
module.exports = __toCommonJS(show_avatar_exports);
var import_zod = require("zod");
async function showAvatar(request, reply) {
  const requestParamsSchema = import_zod.z.object({
    filename: import_zod.z.string()
  });
  const { filename } = requestParamsSchema.parse(request.params);
  try {
    return reply.sendFile(filename);
  } catch (err) {
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  showAvatar
});
