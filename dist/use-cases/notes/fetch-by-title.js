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

// src/use-cases/notes/fetch-by-title.ts
var fetch_by_title_exports = {};
__export(fetch_by_title_exports, {
  FetchNotesByTitleUseCase: () => FetchNotesByTitleUseCase
});
module.exports = __toCommonJS(fetch_by_title_exports);
var FetchNotesByTitleUseCase = class {
  constructor(notesRepository) {
    this.notesRepository = notesRepository;
  }
  async execute({
    title
  }) {
    const notes = await this.notesRepository.findByTitle(title);
    return { notes };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FetchNotesByTitleUseCase
});
