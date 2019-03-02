export const stateIndicators = new Map([
	['year', document.getElementById('year')],
	['money', document.getElementById('money')],
	['social', document.getElementById('social')],
	['campus', document.getElementById('campus')],
	['reputation', document.getElementById('reputation')],
]);

export const stateIcons = new Map([
	['year', document.getElementById('year-icon')],
	['money', document.getElementById('money-icon')],
	['social', document.getElementById('social-icon')],
	['campus', document.getElementById('campus-icon')],
	['reputation', document.getElementById('reputation-icon')],
]);

export const cardElements = new Map([
	['name', document.getElementById('name')],
	['image', document.getElementById('image')],
	['text', document.getElementById('text')],
	['left', document.getElementById('button-left')],
	['right', document.getElementById('button-right')],
]);

export const currentCard = new Map([
	['name', ''],
	['image', ''],
	['text', ''],
	['left', {}],
	['right', {}],
	['group', ''],
]);

export const currentState = new Map([
	['year', 0],
	['money', 0],
	['social', 0],
	['campus', 0],
	['reputation', 0],
]);

export const previousState = new Map([
	['year', 0],
	['money', 0],
	['social', 0],
	['campus', 0],
	['reputation', 0],
]);
