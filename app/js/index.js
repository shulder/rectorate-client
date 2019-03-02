import axios from 'axios';
import TEST_JSON from './testData';
import {
	stateIcons,
	stateIndicators,
	cardElements,
	currentCard,
	currentState,
	previousState,
} from './structures';

import {
	HOSTNAME,
	START_YEAR,
	DEFAULT_INDICATOR_VALUE,
	LOW_INDICATOR_CHANGE_LIMIT,
} from './constants';

const setPreviousState = () => {
	for (const [key] of previousState) {
		previousState.set(key, currentState.get(key));
	}
};

const setDefaultState = () => {
	setPreviousState();
	for (const [key] of currentState) {
		if (key === 'year') currentState.set(key, START_YEAR);
		else currentState.set(key, DEFAULT_INDICATOR_VALUE);
	}
};

const setState = (indicatorsChange) => {
	setPreviousState();
	for (const [key] of currentState) {
		currentState.set(key, currentState.get(key) + indicatorsChange[key]);
	}
};

const setCard = (newCard) => {
	for (const [key] of currentCard) {
		currentCard.set(key, newCard[key]);
	}
};

const getIndicatorColor = (value) => {
	switch (true) {
	  case value < 25:
	    return 'is-indicator-bar-red';
	  case value >= 25 && value < 50:
	    return 'is-indicator-bar-orange';
	  case value >= 50 && value < 75:
	    return 'is-indicator-bar-yellow';
	  case value >= 75:
 			return 'is-indicator-bar-green';
 	}
};

const animateIndicatorChange = (indicatorKey, prevIndicatorValue, newIndicatorValue) => {
	if (prevIndicatorValue === newIndicatorValue || newIndicatorValue > 100) return;
	let currentBarWidth = prevIndicatorValue;
	const newBarWidth = newIndicatorValue;
	const indicator = stateIndicators.get(indicatorKey);
	indicator.classList.remove(getIndicatorColor(prevIndicatorValue));
	indicator.classList.add(getIndicatorColor(newIndicatorValue));
	const interval = setInterval(() => {
		if (currentBarWidth === newBarWidth) clearInterval(interval);
		else {
	  	newIndicatorValue > prevIndicatorValue ? currentBarWidth += 1 : currentBarWidth -= 1;
	    indicator.style.width = `${currentBarWidth}%`;
	  }
	}, 10);
};

const renderState = () => {
	for (const [key] of stateIndicators) {
		if (key === 'year') {
			stateIndicators.get(key).textContent = `${currentState.get(key)} год`;
		} else animateIndicatorChange(key, previousState.get(key), currentState.get(key));
	}
};

const renderCard = () => {
	for (const [key] of cardElements) {
		if (key === 'image') {
			cardElements.get(key).src = currentCard.get(key);
		} else if (key === 'left' || key === 'right') {
			cardElements.get(key).textContent = currentCard.get(key).text;
		} else if (key === 'text') {
			cardElements.get(key).textContent = currentCard.get(key);
		} else if (key !== 'group') {
			cardElements.get(key).textContent = currentCard.get(key);
		}
	}
};

const lowlightIndicators = () => {
	for (const [key] of stateIcons) {
		stateIcons.get(key).classList.remove('is-indicator-icon-orange');
		stateIcons.get(key).classList.remove('is-indicator-icon-red');
	}
};

const highlightIndicator = (indicator, isChangeLow) => {
	isChangeLow
		? indicator.classList.add('is-indicator-icon-orange')
	 	: indicator.classList.add('is-indicator-icon-red');
};

const manageIndicatorsHighlight = (isTurnLeft) => {
	const changes = isTurnLeft ? currentCard.get('left') : currentCard.get('right');
	for (const key of Object.keys(changes)) {
		if (key !== 'year' && Math.abs(changes[key]) > 0) {
			if (Math.abs(changes[key]) >= LOW_INDICATOR_CHANGE_LIMIT) {
				highlightIndicator(stateIcons.get(key), false);
			} else highlightIndicator(stateIcons.get(key), true);
		}
	}
};

const manageRequestURL = (isCardFirst, isTurnLeft) => {
	if (isCardFirst) return `${HOSTNAME}/cards/start.json`;
	return isTurnLeft ? `${HOSTNAME}/cards/left.json` : `${HOSTNAME}/cards/right.json`;
};

const requestNextCard = async (url) => {
	try {
		return await axios.get(url);
	} catch (error) {
		console.error(error);
	}
};

const managePlayerTurn = async (isTurnLeft) => {
	if (currentCard.get('group') === 'final') {
		isTurnLeft ? startGame() : window.close();
	} else {
		isTurnLeft ? setState(currentCard.get('left')) : setState(currentCard.get('right'));
		renderState();
		// const nextCard = await requestNextCard(manageRequestURL(false, isTurnLeft));
		const nextCard = TEST_JSON;
		setCard(nextCard);
		renderCard();
	}
};

const hideWelcomeScreen = () => {
	document.querySelector('.l-welcome-screen').classList.add('is-block-hidden');
	document.querySelector('.l-game-state').classList.remove('is-block-hidden');
	document.querySelector('.l-game-step').classList.remove('is-block-hidden');
};

const buttonHandler = callback => (event) => {
	if (event.target.id === 'button-start') callback();
	else if (event.target.id === 'button-left') callback(true);
	else if (event.target.id === 'button-right') callback(false);
	event.stopPropagation();
};

const addEventListeners = () => {
	const options = document.getElementById('options');
	const startButton = document.getElementById('button-start');
	startButton.addEventListener('click', buttonHandler(hideWelcomeScreen));
	options.addEventListener('click', buttonHandler(managePlayerTurn));
	options.addEventListener('mouseover', buttonHandler(manageIndicatorsHighlight));
	options.addEventListener('mouseout', buttonHandler(lowlightIndicators));
};

const startGame = async () => {
	setDefaultState();
	renderState();
	addEventListeners();
	try {
		// const nextCard = await requestNextCard(manageRequestURL(true));
		const nextCard = TEST_JSON;
		setCard(nextCard);
		renderCard();
	} catch (error) {
		console.error(error);
	}
};

startGame();
