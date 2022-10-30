#!/usr/bin/env node

import fs from "fs/promises";
import { capitalize } from "../src/utils.js";

async function createContent(name) {
  const nl = "\r\n";
  const t = `export default function ${name}() {` + nl;
  const m = `  return ();` + nl;
  const b = `}` + nl;
  return t + m + b;
}

async function createIndex(filename) {
  const nl = "\r\n";
  const t = `export { default as ${filename} } from "./${filename}";` + nl;
  return t;
}

async function createComponentsIndex(filename) {
  const nl = "\r\n";
  const t = `export { ${filename} } from "./${filename}";` + nl;
  return t;
}

function getType() {
  if(process.argv[2] === 'p' ){
    return 'pages'
  }
  if(process.argv[2] === 'c' ){
    return 'components'
  } 
}

async function generateStructure() {
  const type = getType()
  const filename = process.argv[3];
  const dir = `./src/${type}/${filename}`;
  const file = filename + ".tsx";
  const index = `./src/${type}/${filename}/index.ts`;
  const content = await createContent(filename);
  const indexContent = await createIndex(filename);
  const componentsIndex = `./src/${type}/index.ts`;
  const componentsIndexContent = await createComponentsIndex(filename);

  try {
    await fs.access(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
  }

  await fs.writeFile(dir + "/" + file, content);
  await fs.writeFile(index, indexContent);
  await fs.writeFile(componentsIndex, componentsIndexContent, { flag: "a+" });
}
generateStructure();
