import fs from "node:fs";
import path from "node:path";

export async function copyFileIfDifferent(inFilename, outFilename) {
  const inStats = await fs.promises.stat(inFilename);

  let outStats = null;
  try { outStats = await fs.promises.stat(outFilename); } catch (e) { }
  if (outStats === null || inStats.mtime.getTime() !== outStats.mtime.getTime()) {
    await fs.promises.cp(inFilename, outFilename, {recursive: true});
    await fs.promises.utimes(outFilename, inStats.atime, inStats.mtime);
    return true;
  }
  
  return false;
}

export function getFilenamesFromParams(params) {
  const result = [];

  if (!params)
    /* nope */;
  else if (Array.isArray(params))
    result.push(...params);
  else if (typeof params === "object")
    result.push(...Object.values(params));
  else if (typeof params === "string")
    result.push(params);
  else
    throw "Not support params type";

  return result;
}
