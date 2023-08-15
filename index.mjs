import fs from "fs";
import { parse } from "./parser/index.mjs";
import { analyze } from "./analysis/index.mjs";
import * as acorn from "acorn";
import * as escodegen from "escodegen";
import * as estreewalker from "estree-walker";
import { generate } from "./generate/index.mjs";

const content = fs.readFileSync("./app.svelte", "utf-8");
const ast = parse(content);
const analysis = analyze(ast);
const js = generate(ast, analysis);

fs.writeFileSync("./app.js", js, "utf-8");
