#!/usr/bin/env node
const { exec } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");

function correctVersion(major, minor, patch, updateType) {
  major = Number(major);
  minor = Number(minor);
  patch = Number(patch);
  return (
    updateType === "patch"
      ? [major, minor, patch + 1]
      : updateType === "minor"
        ? [major, minor + 1, 0]
        : updateType === "major"
          ? [major + 1, 0, 0]
          : []
  ).join(".");
}

let [, , vType] = process.argv;

if (!vType) {
  vType = "patch";
}

const configPath = "src/constants/config.ts";
const pkgPath = "package.json";
const pkgLockPath = "package-lock.json";
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const pkgLock = JSON.parse(readFileSync(pkgLockPath, "utf8"));
let configContent = readFileSync(configPath, "utf-8");
const [major, minor, patch] = pkg.version.split(".");
const newVersion = correctVersion(major, minor, patch, vType);
const appVersion = "v" + newVersion;

pkg.version = newVersion;
pkgLock.version = newVersion;

configContent = configContent.replace(
  /[^_]VERSION:.*,$/gm,
  ` VERSION: '${appVersion}',`,
);

writeFileSync(pkgPath, JSON.stringify(pkg, null, "  "), "utf-8");
writeFileSync(pkgLockPath, JSON.stringify(pkgLock, null, "  "), "utf-8");
writeFileSync(configPath, configContent, "utf-8");

exec("git add .", function (error) {
  if (error) console.log(error);
  exec(`git commit -m ${newVersion}`, function () {
    exec(`git tag -a ${appVersion} -m ${newVersion}`);
    console.log(`Version Created: ${appVersion}`);
  });
});
