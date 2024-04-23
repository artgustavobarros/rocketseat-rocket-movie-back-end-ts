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

// src/use-cases/notes/find-by-id.ts
var find_by_id_exports = {};
__export(find_by_id_exports, {
  FindNotesById: () => FindNotesById
});
module.exports = __toCommonJS(find_by_id_exports);

// src/utils/errors/content-not-found.ts
var ContentNotFoundError = class extends Error {
  constructor() {
    super("Content not found");
  }
};

// src/use-cases/notes/find-by-id.ts
var FindNotesById = class {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }
  async execute({ id }) {
    const note = await this.notesRepository.findById(id);
    if (!note) {
      throw new ContentNotFoundError();
    }
    return { note };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FindNotesById
});
