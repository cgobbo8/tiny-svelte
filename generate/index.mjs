import * as acorn from "acorn";
import * as estreewalker from "estree-walker";
import * as escodegen from "escodegen";

export const generate = (ast, analysis) => {
	const code = {
		variables: [],
		create: [],
		update: [],
		destroy: [],
	};

	let counter = 1;
	function traverse(node, parent) {
		switch (node.type) {
			case "Element": {
				const variableName = `${node.name}_${counter++}`;
				code.variables.push(variableName);
				code.create.push(
					`${variableName} = document.createElement("${node.name}");`
				);
				node.attributes.forEach((attr) => {
					traverse(attr, variableName);
				});
				node.children.forEach((child) => {
					traverse(child, variableName);
				});
				code.create.push(`${parent}.appendChild(${variableName});`);
				code.destroy.push(`${parent}.removeChild(${variableName});`);
				break;
			}
			case "Text": {
				const variableName = `${node.type}_${counter++}`;
				code.variables.push(variableName);
				code.create.push(
					`${variableName} = document.createTextNode(\`${node.value}\`);`
				);
				code.create.push(`${parent}.appendChild(${variableName});`);
				code.destroy.push(`${parent}.removeChild(${variableName});`);
				break;
			}
			case "Attribute": {
				if (node.name.startsWith("on:")) {
					const eventName = node.name.slice(3);
					const eventHandler = node.value.name;
					code.create.push(
						`${parent}.addEventListener("${eventName}", ${eventHandler});`
					);
					code.destroy.push(
						`${parent}.removeEventListener("${eventName}", ${eventHandler});`
					);
				} else {
					const variableName = `${node.name}_${counter++}`;
					code.variables.push(variableName);
					code.create.push(
						`${variableName} = document.createAttribute("${node.name}");`
					);
					code.create.push(`${variableName}.value = "${node.value}";`);
					code.create.push(`${parent}.setAttributeNode(${variableName});`);
					code.update.push(`${variableName}.value = "${node.value}";`);
					code.destroy.push(`${parent}.removeAttribute("${node.name}");`);
				}
				break;
			}
			case "Expression": {
				const variableName = `${node.type}_${counter++}`;
				const expression = node.expression.name;
				code.variables.push(variableName);
				code.create.push(
					`${variableName} = document.createTextNode(${expression});`
				);
				code.create.push(`${parent}.appendChild(${variableName});`);

				console.log(expression, analysis.willChange.has(expression));
				if (analysis.willChange.has(expression)) {
					code.update.push(`if (changed.includes(${expression})) {
                            ${variableName}.data = ${expression};
                        }`);
				}
				code.destroy.push(`${parent}.removeChild(${variableName});`);
				break;
			}
		}
	}

	ast.html.forEach((fragment) => traverse(fragment, "target"));

	const { rootScope, map } = analysis;
	let currentScope = rootScope;
	estreewalker.walk(ast.script, {
		enter(node) {
			if (map.has(node)) {
				currentScope = map.get(node);
			}
			if (
				node.type === "UpdateExpression" &&
				currentScope.find_owner(node.argument.name) === rootScope &&
				analysis.willUseInTemplate.has(node.argument.name)
			) {
				this.replace({
					type: "SequenceExpression",
					expressions: [
						node,
						acorn.parseExpressionAt(
							`lifecycles.update([${node.argument.name}])`,
							0,
							{ ecmaVersion: 2020 }
						),
					],
				});
				this.skip();
			}
			if (
				node.type === "AssignmentExpression" &&
				currentScope.find_owner(node.left.name) === rootScope &&
				analysis.willUseInTemplate.has(node.left.name)
			) {
				this.replace({
					type: "SequenceExpression",
					expressions: [
						node,
						acorn.parseExpressionAt(
							`lifecycles.update([${node.left.name}])`,
							0,
							{ ecmaVersion: 2020 }
						),
					],
				});
				this.skip();
			}
		},
		leave(node) {
			if (map.has(node)) {
				currentScope = currentScope.parent;
			}
		},
	});

	return `
        export default function() {
            ${code.variables.map((v) => `let ${v};`).join("\n")}
            ${escodegen.generate(ast.script)}
            const lifecycles = {
                create(target) {
                    ${code.create.join("\n")}
                },
                update(changed) {
                    ${code.update.join("\n")}
                },
                destroy() {
                    ${code.destroy.join("\n")}
                }
            }

            return lifecycles;
        }
    `;
};
