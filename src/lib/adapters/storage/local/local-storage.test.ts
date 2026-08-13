import { describe, expect, it } from "vitest";
import { LocalStorageProvider } from "./local-storage";

const provider = new LocalStorageProvider();

function fakeFile(type: string): File {
  return new File(["hello"], "resume.pdf", { type });
}

describe("LocalStorageProvider", () => {
  it("encodes a Buffer as a base64 data URL with the correct PDF mime", async () => {
    const buffer = Buffer.from("hello");
    const result = await provider.upload(buffer, "resume.pdf");
    expect(result.url).toBe(`data:application/pdf;base64,${buffer.toString("base64")}`);
    expect(result.size).toBe(5);
  });

  it("uses the provided file type when present", async () => {
    const result = await provider.upload(fakeFile("application/pdf"), "resume.pdf");
    expect(result.url.startsWith("data:application/pdf;base64,")).toBe(true);
  });

  it("falls back to extension when file type is empty", async () => {
    const file = new File(["hello"], "photo.png", { type: "" });
    const result = await provider.upload(file, "photo.png");
    expect(result.url.startsWith("data:image/png;base64,")).toBe(true);
  });

  it("detects text/plain for txt files", async () => {
    const buffer = Buffer.from("notes");
    const result = await provider.upload(buffer, "notes.txt");
    expect(result.url.startsWith("data:text/plain;base64,")).toBe(true);
  });

  it("defaults to octet-stream for unknown extensions", async () => {
    const buffer = Buffer.from("data");
    const result = await provider.upload(buffer, "file.xyz");
    expect(result.url.startsWith("data:application/octet-stream;base64,")).toBe(true);
  });

  it("reports the correct byte size", async () => {
    const buffer = Buffer.from("0123456789");
    const result = await provider.upload(buffer, "resume.pdf");
    expect(result.size).toBe(10);
  });

  it("delete resolves without error (no external storage)", async () => {
    await expect(provider.delete("data:application/pdf;base64,AAAA")).resolves.toBeUndefined();
  });
});
