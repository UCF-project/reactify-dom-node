import test from 'ava';
import ReactTestUtils from 'react-addons-test-utils';
import reactifyDOMNode from '../index';

// TODO: add DOM polyfill and actually create elements

test('Empty element', t => {
	const nodeElem = {
		attributes: [],
		tagName: 'noName'
	};
	const reactifiedElem = reactifyDOMNode(nodeElem);
	t.true(ReactTestUtils.isElement(reactifiedElem));
});

test('Text element', t => {
	const nodeElem = {
		attributes: [],
		tagName: 'noName',
		type: 'text'
	};
	const reactifiedElem = reactifyDOMNode(nodeElem);
	t.false(ReactTestUtils.isElement(reactifiedElem));
});

test('Comment element', t => {
	const nodeElem = {
		attributes: [],
		tagName: 'noName',
		type: 'comment'
	};
	const reactifiedElem = reactifyDOMNode(nodeElem);
	t.false(ReactTestUtils.isElement(reactifiedElem));
});

test('Element with children', t => {
	const nodeElem = {
		attributes: [
			{
				name: 'style',
				value: 'color: red; width: 100px'
			}
		],
		children: [
			{
				attributes: [],
				tagName: 'noName',
				type: 'comment',
				hasAttribute: () => false,
				setAttribute: () => false
			},
			{
				attributes: [],
				tagName: 'noName',
				type: 'comment',
				hasAttribute: () => true,
				setAttribute: () => false
			}
		],
		tagName: 'noName'
	};
	const reactifiedElem = reactifyDOMNode(nodeElem);
	t.true(ReactTestUtils.isElement(reactifiedElem));
});

test('Element with omitted close tag', t => {
	const nodeElem = {
		attributes: [],
		tagName: 'br'
	};
	const reactifiedElem = reactifyDOMNode(nodeElem);
	t.true(ReactTestUtils.isElement(reactifiedElem));
});

test('Element with attributes: class, for, data-x, style (empty)', t => {
	const nodeElem = {
		attributes: [
			{
				name: 'class',
				value: 'myClass'
			},
			{
				name: 'for',
				value: 'anotherElement'
			},
			{
				name: 'data-testing-other',
				value: 'justTesting'
			},
			{
				name: 'style',
				value: ''
			}
		],
		tagName: 'div'
	};
	const reactifiedElem = reactifyDOMNode(nodeElem);
	t.true(ReactTestUtils.isElement(reactifiedElem));
	t.is(reactifiedElem.type, 'div');
	t.is(Object.keys(reactifiedElem.props).length, 5);
	t.is(reactifiedElem.props.className, 'myClass');
	t.is(reactifiedElem.props.htmlFor, 'anotherElement');
	t.is(reactifiedElem.props.dataTestingOther, 'justTesting');
	t.deepEqual(reactifiedElem.props.style, {});
	t.is(reactifiedElem.props.children.length, 0);
});

test('Element with style', t => {
	const nodeElem = {
		attributes: [
			{
				name: 'style',
				value: 'color: red;; width: 100px; height:0;'
			}
		],
		tagName: 'noName'
	};
	const reactifiedElem = reactifyDOMNode(nodeElem);

	t.true(ReactTestUtils.isElement(reactifiedElem));
	t.deepEqual(reactifiedElem.props.style, {
		color: 'red',
		width: '100px',
		height: '0'
	});
});

test('Element with invalid style', t => {
	const nodeElem = {
		attributes: [
			{
				name: 'style',
				value: 'color: : red; width: 100px'
			}
		],
		tagName: 'noName'
	};

	t.throws(() => {
		reactifyDOMNode(nodeElem);
	});
});

test('Element with invalid style 2', t => {
	const nodeElem = {
		attributes: [
			{
				name: 'style',
				value: 'color:  '
			}
		],
		tagName: 'noName'
	};

	t.throws(() => {
		reactifyDOMNode(nodeElem);
	});
});
