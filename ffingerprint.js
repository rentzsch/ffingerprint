#!/usr/bin/env node
"use strict";

const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
  printUsageAndExit();
}

const subcmd = process.argv[2];
switch (subcmd) {
  case "commit":
    commitCmd();
    break;
  case "status":
    statusCmd();
    break;
  default:
    printUsageAndExit();
    break;
}

function printUsageAndExit() {
  console.log("ffingerprint v1.0");
  console.log("usage: ffingerprint (commit|status)");
  process.exit(0);
}

function commitCmd() {
  const hashAndPath = hashDir(".");
  fs.writeFileSync("ffingerprint.json", JSON.stringify(hashAndPath, null, 2));
}

function statusCmd() {
  const committedHashAndPath = JSON.parse(fs.readFileSync("ffingerprint.json"));
  const currentHashAndPath = hashDir(".");
  // console.log(currentHashAndPath);
  const unprocessedCurrentHashAndPath = Object.assign(
    Object.create(null),
    currentHashAndPath
  );

  for (const [committedHash, committedPath] of Object.entries(
    committedHashAndPath
  )) {
    if (currentHashAndPath[committedHash] !== undefined) {
      // Hash found.
      if (currentHashAndPath[committedHash] === committedPath) {
        // Current hash AND path match the commmitted record, nothing to do.
      } else {
        // Hash found, but a different path.
        console.log(
          `MOV ${committedPath} => ${currentHashAndPath[committedHash]}`
        );
      }
    } else {
      // Hash not found, it's a new file or a modified file.
      if (fs.existsSync(committedPath)) {
        console.log(`MOD ${committedPath}`);
        const currentHash = findKeyForValue(
          unprocessedCurrentHashAndPath,
          committedPath
        );
        delete unprocessedCurrentHashAndPath[currentHash];
      } else {
        console.log(`DEL ${committedPath}`);
      }
    }
    delete unprocessedCurrentHashAndPath[committedHash];
  }

  for (const [unprocessedCurrentHash, unprocessedCurrentPath] of Object.entries(
    unprocessedCurrentHashAndPath
  )) {
    console.log(`ADD ${unprocessedCurrentPath}`);
  }
}

function hashDir(dirPath) {
  const hashAndPath = Object.create(null);
  processDir(dirPath);
  return hashAndPath;

  function processDir(dirPath) {
    const fsItems = fs
      .readdirSync(dirPath)
      .filter(
        (fsItem) => fsItem !== ".DS_Store" && fsItem !== "ffingerprint.json"
      );
    for (const fsItem of fsItems) {
      const fsPath = path.join(dirPath, fsItem);
      if (fs.statSync(fsPath).isDirectory()) {
        processDir(fsPath);
      } else {
        const hash = crypto.createHash("sha1");
        hash.update(fs.readFileSync(fsPath));
        hashAndPath[hash.digest("hex")] = fsPath;
      }
    }
  }
}

function findKeyForValue(object, value) {
  const result = Object.entries(object).find((entry) => entry[1] === value);
  if (result !== undefined) return result[0];

  throw new Error(
    `couldn't find value "${value}" in ${JSON.stringify(object, null, 2)}`
  );
}
