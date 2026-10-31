require("dotenv").config();
const settings = require("../../helpers/constants");
const { pickNoteMetadata } = require("../../helpers/bases-engine/noteMetadata");
const pluginLoader = require("../../helpers/pluginLoader");

// Core note settings plus any per-note flags declared by enabled plugins
// (manifest "noteSettings"). Same resolution for both: per-note frontmatter
// wins, the env var of the same name is the global default.
const allSettings = [
  ...settings.ALL_NOTE_SETTINGS,
  ...pluginLoader.getNoteSettingKeys(),
];

// Frontmatter keys read by the sheet layouts in _includes/layouts/docs/.
// The Digital Garden plugin publishes custom note properties nested under
// "dg-note-properties", while repo-authored notes (Style Demo) set them
// top-level; like the bases engine, the nested form wins over the legacy
// flat form.
const SHEET_KEYS = [
  "kind",
  "paper",
  "tilt",
  "letterhead",
  "letter_date",
  "to",
  "from",
  "footer",
  "memo_title",
  "memo_fields",
  "stamp",
  "report_title",
  "report_fields",
  "incident",
  "stamp_conf",
  "coffee",
  "paperclip",
  "art_running",
  "masthead",
  "headline",
  "byline",
];

function sheetProps(data) {
  const nested = data["dg-note-properties"];
  const props = {};
  for (const key of SHEET_KEYS) {
    if (nested && nested[key] !== undefined) props[key] = nested[key];
    else if (data[key] !== undefined) props[key] = data[key];
  }
  return props;
}

module.exports = {
  eleventyComputed: {
    // Sheet documents: a note's `kind` picks a paper layout; anything
    // without a kind keeps the standard note layout.
    sheet: (data) => sheetProps(data),
    layout: (data) => {
      if (data.tags.indexOf("gardenEntry") != -1) {
        return "layouts/index.njk";
      }
      const sheetLayouts = {
        letter: "layouts/docs/letter.njk",
        memo: "layouts/docs/memo.njk",
        report: "layouts/docs/report.njk",
        note: "layouts/docs/note.njk",
        article: "layouts/docs/article.njk",
        board: "layouts/docs/board.njk",
      };
      return sheetLayouts[data.sheet.kind] || "layouts/note.njk";
    },
    permalink: (data) => {
      if (data.tags.indexOf("gardenEntry") != -1) {
        return "/";
      }
      return data.permalink || undefined;
    },
    basesNotes: (data) => {
      if (!data.collections || !data.collections.note) return [];
      return data.collections.note.map((item) => ({
        path: item.filePathStem.replace("/notes/", ""),
        url: item.url,
        metadata: pickNoteMetadata(item.data),
        fileSlug: item.fileSlug,
      }));
    },
    settings: (data) => {
      const noteSettings = {};
      allSettings.forEach((setting) => {
        let noteSetting = data[setting];
        let globalSetting = process.env[setting];

        let settingValue =
          noteSetting || (globalSetting === "true" && noteSetting !== false);
        noteSettings[setting] = settingValue;
      });
      return noteSettings;
    },
  },
};
