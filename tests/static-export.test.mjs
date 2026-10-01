import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const output = fileURLToPath(new URL("../out/", import.meta.url));
const read = (name) => readFile(path.join(output, name), "utf8");

test("resume chapters precede the selected work", async () => {
  const html = await read("index.html");
  const chapters = ["home", "about", "skills", "experience", "work", "contact"];
  let previous = -1;
  for (const chapter of chapters) {
    const current = html.indexOf(`id="${chapter}"`);
    assert.ok(current > previous, `${chapter} exists in the intended order`);
    previous = current;
  }
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /PRODUCT DESIGNER/);
  assert.match(html, /<html[^>]*lang="en"[^>]*dir="ltr"/);
});

test("all three project overview routes are exported and linked", async () => {
  const home = await read("index.html");
  const slugs = ["shandana", "nourchi", "this-website"];
  for (const slug of slugs) {
    assert.ok(home.includes(`href="/work/${slug}/"`));
    const project = await read(`work/${slug}/index.html`);
    assert.match(project, /Detailed case study in preparation/);
    assert.match(project, /href="\/"/);
  }
  assert.equal((home.match(/href="\/work\//g) || []).length, 3);
});

test("the PDF and optimized character ship without the old hero poster", async () => {
  const pdf = await readFile(
    path.join(output, "resume/Iman-Hajiali-Resume.pdf"),
  );
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.ok(pdf.length > 1000);
  const character = await readFile(
    path.join(output, "models/iman-scroll-character-optimized.glb"),
  );
  assert.equal(character.subarray(0, 4).toString(), "glTF");
  assert.ok(
    character.length < 13_689_044,
    "optimized model is smaller than the source",
  );
  await access(path.join(output, "icon.svg"));
  await assert.rejects(access(path.join(output, "images/hero-studio.webp")));
  await assert.rejects(access(path.join(output, "images/hero-studio.png")));
  const home = await read("index.html");
  assert.doesNotMatch(home, /srcSet="\/images\/hero-studio.webp"/);
  assert.match(home, /Preparing the studio/);
  assert.match(home, /href="\/resume\/Iman-Hajiali-Resume.pdf"[^>]*download/);
});

test("essential resume text is present in HTML before JavaScript", async () => {
  const home = await read("index.html");
  for (const text of [
    "Nourchi",
    "Brandi24",
    "Shandana",
    "Mignet",
    "Computer Engineering",
    "Persian",
    "English",
    "Information architecture",
    "imaanhajiali@gmail.com",
  ]) {
    assert.ok(home.includes(text), `${text} is available without WebGL`);
  }
});
