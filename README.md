# Reactify DOM Node

Duplicates DOM node (attributes and children) into a React Component instance.

## Installation

```bash
npm install reactify-dom-node 
```

## Usage

```javascript
import reactifyDOMNode from 'reactify-dom-node';

const nodeElement = document.createElement('div');
const reactifyElement = reactifyDOMNode(nodeElement);
```

