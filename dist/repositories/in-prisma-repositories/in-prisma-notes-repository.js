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

// src/repositories/in-prisma-repositories/in-prisma-notes-repository.ts
var in_prisma_notes_repository_exports = {};
__export(in_prisma_notes_repository_exports, {
  PrismaNotesRepository: () => PrismaNotesRepository
});
module.exports = __toCommonJS(in_prisma_notes_repository_exports);

// src/lib/index.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/repositories/in-prisma-repositories/in-prisma-notes-repository.ts
var PrismaNotesRepository = class {
  async create(data) {
    const note = await prisma.note.create({ data });
    return note;
  }
  async fetchAll(user_id) {
    const notes = await prisma.note.findMany({ where: { user_id } });
    return notes;
  }
  async findByTitle(title) {
    const notes = await prisma.note.findMany({
      where: { title: { contains: title } }
    });
    return notes;
  }
  async findById(id) {
    const note = await prisma.note.findUnique({ where: { id } });
    return note;
  }
  async delete(id) {
    await prisma.note.delete({ where: { id } });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PrismaNotesRepository
});
