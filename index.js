'use strict';

// Inspired from https://github.com/mikenikles/html-to-react

const React = require('react');
const camelCase = require('camelcase');
const debug = require('debug')('ReactifyDOMNode');

// omittedCloseTags from https://github.com/facebook/react/blob/0.14-stable/src/renderers/dom/shared/ReactDOMComponent.js#L432
const omittedCloseTags = {
	area: true,
	base: true,
	br: true,
	col: true,
	embed: true,
	hr: true,
	img: true,
	input: true,
	keygen: true,
	link: true,
	meta: true,
	param: true,
	source: true,
	track: true,
	wbr: true
	// NOTE: menuitem's close tag should be omitted, but that causes problems.
};

const convertStyle = cssString => {
	debug(`Converting style string: ${cssString}`);
	const result = {};

	if (typeof cssString === 'string' && cssString.trim()) {
		const cssList = cssString.split(';');
		debug('cssList:', cssList);
		cssList.forEach(css => {
			if (css && css.trim()) {
				const cssArr = css.split(':');
				if (cssArr.length === 2 && cssArr[0] && cssArr[1] && cssArr[0].trim() && cssArr[1].trim()) {
					const cssProperty = camelCase(cssArr[0].trim());
					const cssValue = cssArr[1].trim();
					result[cssProperty] = cssValue;
				} else {
					throw new Error(`Could not parse ${css}`);
				}
			}
		});
	}

	debug('Style converted:', cssString);
	return result;
};

const convertAttributes = nodeAttr => {
	debug('Converting attributes', nodeAttr);
	const attributes = {};
	Array.prototype.slice.call(nodeAttr).forEach(attr => {
		// Special cases 'class' and 'for'
		// https://facebook.github.io/react/docs/tags-and-attributes.html#supported-attributes
		if (attr.name === 'class') {
			attributes.className = attr.value;
		} else if (attr.name === 'for') {
			attributes.htmlFor = attr.value;
		} else if (attr.name === 'style') {
			attributes.style = convertStyle(attr.value);
		} else {
			attributes[camelCase(attr.name)] = attr.value;
		}
	});
	return attributes;
};

const setKey = (node, i) => {
	if (!node.hasAttribute('key')) {
		node.setAttribute('key', i);
	}
	return node;
};

const ReactifyDOMNode = node => {
	if (node.type === 'text' || node.type === 'comment') {
		return node;
	}

	const elementAttr = convertAttributes(node.attributes);

	let children = [];
	if (node.children) {
		children = Array.prototype.slice.call(node.children)
			.map(setKey)
			.map(ReactifyDOMNode);
	}

	if (omittedCloseTags[node.tagName.toLowerCase()]) {
		return React.createElement(node.tagName, elementAttr);
	}

	return React.createElement(node.tagName, elementAttr, children);
};

module.exports = ReactifyDOMNode;
