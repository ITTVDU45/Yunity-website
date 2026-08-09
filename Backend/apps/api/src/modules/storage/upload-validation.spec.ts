import {
  MAX_UPLOAD_BYTES,
  extractExtension,
  magicBytesMatchMime,
  validateUpload,
} from "./upload-validation";

describe("validateUpload", () => {
  test("akzeptiert erlaubten Typ mit passender Endung", () => {
    expect(
      validateUpload({ filename: "foto.jpg", mimeType: "image/jpeg", size: 1000 }),
    ).toBeNull();
  });

  test("lehnt nicht erlaubten MIME-Typ ab", () => {
    const error = validateUpload({
      filename: "x.exe",
      mimeType: "application/x-msdownload",
      size: 1000,
    });
    expect(error?.field).toBe("mimeType");
  });

  test("lehnt zu grosse Dateien ab", () => {
    const error = validateUpload({
      filename: "foto.jpg",
      mimeType: "image/jpeg",
      size: MAX_UPLOAD_BYTES + 1,
    });
    expect(error?.field).toBe("size");
  });

  test("lehnt Endung ab, die nicht zum MIME-Typ passt", () => {
    const error = validateUpload({
      filename: "foto.png",
      mimeType: "image/jpeg",
      size: 1000,
    });
    expect(error?.field).toBe("filename");
  });

  test("lehnt ueberlange und steuerzeichenhaltige Dateinamen ab", () => {
    expect(
      validateUpload({
        filename: `${"a".repeat(256)}.png`,
        mimeType: "image/png",
        size: 1000,
      })?.field,
    ).toBe("filename");
    expect(
      validateUpload({
        filename: "bild\r\n.png",
        mimeType: "image/png",
        size: 1000,
      })?.field,
    ).toBe("filename");
  });
});

describe("extractExtension", () => {
  test("liefert die Kleinbuchstaben-Endung", () => {
    expect(extractExtension("Bild.PNG")).toBe("png");
    expect(extractExtension("ohne-endung")).toBe("");
  });
});

describe("magicBytesMatchMime", () => {
  test("erkennt JPEG-Signatur", () => {
    expect(
      magicBytesMatchMime(Buffer.from([0xff, 0xd8, 0xff, 0x00]), "image/jpeg"),
    ).toBe(true);
  });

  test("erkennt PNG-Signatur", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(magicBytesMatchMime(png, "image/png")).toBe(true);
  });

  test("lehnt als PNG deklariertes JPEG ab", () => {
    expect(
      magicBytesMatchMime(Buffer.from([0xff, 0xd8, 0xff, 0x00]), "image/png"),
    ).toBe(false);
  });

  test("erkennt PDF und SVG", () => {
    expect(
      magicBytesMatchMime(Buffer.from("%PDF-1.7"), "application/pdf"),
    ).toBe(true);
    expect(
      magicBytesMatchMime(Buffer.from("<svg xmlns"), "image/svg+xml"),
    ).toBe(true);
  });
});
