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

// src/repositories/in-memory-repositories/in-memory-notes-repository.ts
var in_memory_notes_repository_exports = {};
__export(in_memory_notes_repository_exports, {
  InMemoryNotesRepository: () => InMemoryNotesRepository
});
module.exports = __toCommonJS(in_memory_notes_repository_exports);
var import_crypto = require("crypto");
var InMemoryNotesRepository = class {
  constructor() {
    this.items = [];
  }
  async create(data) {
    const arrTags = Array.isArray(data.arr_tags) ? data.arr_tags : [];
    const note = {
      id: data.id ?? (0, import_crypto.randomUUID)(),
      title: data.title,
      description: data.description ?? null,
      rating: data.rating,
      arr_tags: arrTags,
      user_id: data.user_id,
      created_at: /* @__PURE__ */ new Date(),
      updated_at: /* @__PURE__ */ new Date()
    };
    this.items.push(note);
    return note;
  }
  async fetchAll(user_id) {
    const notes = this.items.filter((note) => note.user_id === user_id);
    if (!notes) {
      return null;
    }
    return notes;
  }
  async findByTitle(title) {
    return this.items.filter((item) => item.title.includes(title));
  }
  async findById(id) {
    const note = this.items.find((item) => item.id === id);
    if (!note) {
      return null;
    }
    return note;
  }
  async delete(id) {
    const index = this.items.findIndex((item) => item.id === id);
    this.items.splice(index, 1);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryNotesRepository
});
