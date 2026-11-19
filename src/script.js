const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = document.querySelector('.calculator__display');

const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);
  if (operator === 'add') return firstNum + secondNum;
  if (operator === 'subtract') return firstNum - secondNum;
  if (operator === 'multiply') return firstNum * secondNum;
  if (operator === 'divide') return firstNum / secondNum;
};

const getKeyType = key => {
  const { action } = key.dataset;
  if (!action) return 'number';
  if (
    action === 'add' ||
    action === 'subtract' ||
    action === 'multiply' ||
    action === 'divide'
  ) return 'operator';
  // decimal, clear, calculate
  return action;
};

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent;
  const { action } = key.dataset;
  const { firstValue, operator, modValue, previousKeyType } = state;

  if (!action) {
    return displayedNum === '0' ||
      previousKeyType === 'operator' ||
      previousKeyType === 'calculate'
      ? keyContent
      : displayedNum + keyContent;
  }

  if (action === 'decimal') {
    if (!displayedNum.includes('.')) return displayedNum + '.';
    if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.';
    return displayedNum;
  }

  if (
    action === 'add' ||
    action === 'subtract' ||
    action === 'multiply' ||
    action === 'divide'
  ) {
    return firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }

  if (action === 'clear') return '0';

  if (action === 'calculate') {
    return firstValue
      ? previousKeyType === 'calculate'
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum;
  }

  return displayedNum;
};

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key);
  const { firstValue, operator, previousKeyType, modValue } = calculator.dataset;

  calculator.dataset.previousKeyType = keyType;

  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action;
    calculator.dataset.firstValue =
      firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
        ? calculatedValue
        : displayedNum;
  }

  if (keyType === 'calculate') {
    calculator.dataset.modValue =
      firstValue && previousKeyType === 'calculate'
        ? modValue
        : displayedNum;
  }

  if (keyType === 'clear' && key.textContent === 'AC') {
    calculator.dataset.firstValue = '';
    calculator.dataset.modValue = '';
    calculator.dataset.operator = '';
    calculator.dataset.previousKeyType = '';
  }
};

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key);

  Array.from(key.parentNode.children).forEach(k =>
    k.classList.remove('is-depressed')
  );

  if (keyType === 'operator') key.classList.add('is-depressed');

  if (keyType === 'clear' && key.textContent !== 'AC') {
    key.textContent = 'AC';
  }

  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]');
    clearButton.textContent = 'CE';
  }
};

keys.addEventListener('click', e => {
  if (!e.target.matches('button')) return;

  const key = e.target;
  const displayedNum = display.textContent;

  // Pure function: compute the new display string
  const resultString = createResultString(key, displayedNum, calculator.dataset);

  // Update states
  display.textContent = resultString;
  updateCalculatorState(key, calculator, resultString, displayedNum);
  updateVisualState(key, calculator);
});
