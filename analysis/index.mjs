import * as periscopic from "periscopic";
import * as estreewalker from "estree-walker";

export const analyze = (ast) => {
	const result = {
		variables: new Set(),
		willChange: new Set(),
		willUseInTemplate: new Set(),
	};

	const { scope: rootScope, map } = periscopic.analyze(ast.script);
	result.variables = new Set(rootScope.declarations.keys());
	result.rootScope = rootScope;
	result.map = map;

	let currentScope = rootScope;
	estreewalker.walk(ast.script, {
		enter(node) {
			if (map.has(node)) {
				currentScope = map.get(node);
			}
			if (
				node.type === "UpdateExpression" &&
				currentScope.find_owner(node.argument.name) === rootScope
			) {
				result.willChange.add(node.argument.name);
			}
			if (
				node.type === "AssignmentExpression" &&
				currentScope.find_owner(node.left.name) === rootScope
			) {
				console.log(node);
				result.willChange.add(node.left.name);
			}
		},
		leave(node) {
			if (map.has(node)) {
				currentScope = currentScope.parent;
			}
		},
	});

	function traverse(fragment) {
		switch (fragment.type) {
			case "Element":
				fragment.children.forEach(traverse);
				fragment.attributes.forEach(traverse);
				break;
			case "Attribute":
				result.willUseInTemplate.add(fragment.value.name);
				break;
			case "Expression":
				result.willUseInTemplate.add(fragment.expression.name);
				break;

			default:
				break;
		}
	}

	ast.html.forEach((fragment) => traverse(fragment));

	return result;
};
