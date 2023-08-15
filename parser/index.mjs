import * as acorn from "acorn";

export const parse = (content) => {
	let i = 0;
	const ast = {};
	ast.html = parseFragments(() => i < content.length);

	return ast;

	function parseFragments(condition) {
		let fragments = [];
		while (condition()) {
			const fragment = parseFragment();
			if (fragment) {
				fragments = [...fragments, fragment];
			}
		}

		return fragments;
	}
	function parseFragment() {
		return parseScript() ?? parseElement() ?? parseExpression() ?? parseText();
	}
	function parseScript() {
		if (match("<script>")) {
			eat("<script>");
			const startIndex = i;
			const endIndex = content.indexOf("</script>", startIndex);
			const code = content.slice(startIndex, endIndex);
			ast.script = acorn.parse(code, { ecmaVersion: 2022 });
			i = endIndex;
			eat("</script>");
		}
	}
	function parseElement() {
		if (match("<")) {
			eat("<");
			const tagName = readWhileMatching(/[a-zA-Z0-9]/);
			const attributes = parseAttributeList();
			eat(">");
			const endTag = `</${tagName}>`;

			const element = {
				type: "Element",
				name: tagName,
				attributes,
				children: parseFragments(() => !match(endTag)),
			};

			eat(endTag);
			return element;
		}
	}
	function parseAttributeList() {
		const attributes = [];
		skipWhitespaces();
		while (!match(">")) {
			const attribute = parseAttribute();
			attributes.push(attribute);
			skipWhitespaces();
		}
		return attributes;
	}
	function parseAttribute() {
		const name = readWhileMatching(/[^=]/);
		eat("={");
		const value = parseJavascript();
		eat("}");
		return { type: "Attribute", name, value };
	}
	function parseExpression() {
		if (match("{")) {
			eat("{");
			const expression = parseJavascript();
			eat("}");
			return { type: "Expression", expression };
		}
	}
	function parseText() {
		const text = readWhileMatching(/[^<{]/);
		if (text.trim() !== "") {
			return { type: "Text", value: text };
		}
	}
	function parseJavascript() {
		const js = acorn.parseExpressionAt(content, i, { ecmaVersion: 2022 });
		i = js.end;
		return js;
	}

	function match(str) {
		return content.slice(i, i + str.length) === str;
	}

	function eat(str) {
		if (match(str)) {
			i += str.length;
		} else {
			throw new Error(`Parse error: Expected ${str} at ${i}`);
		}
	}

	function readWhileMatching(regex) {
		let startIndex = i;
		while (i < content.length && regex.test(content[i])) {
			i++;
		}
		return content.slice(startIndex, i);
	}

	function skipWhitespaces() {
		readWhileMatching(/[\s\n]/);
	}
};
