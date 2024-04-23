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

// src/use-cases/notes/update.ts
var update_exports = {};
__export(update_exports, {
  UpdateNotesUseCase: () => UpdateNotesUseCase
});
module.exports = __toCommonJS(update_exports);

// src/utils/errors/content-not-found.ts
var ContentNotFoundError = class extends Error {
  constructor() {
    super("Content not found");
  }
};

// src/use-cases/notes/update.ts
var UpdateNotesUseCase = class {
  constructor(noteRepository) {
    this.noteRepository = noteRepository;
  }
  async execute({
    id,
    title,
    description,
    rating,
    arr_tags
  }) {
    const note = await this.noteRepository.findById(id);
    if (!note) {
      throw new ContentNotFoundError();
    }
    note.title = title ?? note.title;
    note.description = description ?? note.description;
    note.rating = rating ?? note.rating;
    note.arr_tags = arr_tags ?? note.arr_tags;
    note.updated_at = /* @__PURE__ */ new Date();
    return { note };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateNotesUseCase
});
