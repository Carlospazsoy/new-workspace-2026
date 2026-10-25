const display = document.querySelector("#display");
const history = document.querySelector("#history");
const keypad = document.querySelector(".keypad");

let currentInput = "0";
let storedValue = null;
let selectedOperator = null;
let waitingForInput = false;

const operatorSymbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
};

function updateDisplay() {
    display.textContent = currentInput.replace(".", ",");
}

function formatResult(value) {
    const roundedValue = Number(value.toPrecision(12));
    return new Intl.NumberFormat("es-ES", {
        maximumFractionDigits: 10
    }).format(roundedValue);
}

function inputDigit(digit) {
    if (waitingForInput || currentInput === "Error") {
        currentInput = digit;
        waitingForInput = false;
    } else if (currentInput === "0") {
        currentInput = digit;
    } else if (currentInput.replace("-", "").length < 14) {
        currentInput += digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForInput || currentInput === "Error") {
        currentInput = "0.";
        waitingForInput = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }
    updateDisplay();
}

function calculate(first, second, operator) {
    switch (operator) {
        case "+":
            return first + second;
        case "-":
            return first - second;
        case "*":
            return first * second;
        case "/":
            if (second === 0) {
                return null;
            }
            return first / second;
        default:
            return second;
    }
}

function chooseOperator(operator) {
    if (currentInput === "Error") {
        clearCalculator();
    }

    const inputValue = Number(currentInput);
    if (selectedOperator && !waitingForInput) {
        const result = calculate(storedValue, inputValue, selectedOperator);
        if (result === null) {
            showDivisionError();
            return;
        }
        currentInput = String(Number(result.toPrecision(12)));
        storedValue = Number(currentInput);
        updateDisplay();
    } else {
        storedValue = inputValue;
    }

    selectedOperator = operator;
    waitingForInput = true;
    history.textContent = `${formatResult(storedValue)} ${operatorSymbols[operator]}`;
}

function showDivisionError() {
    currentInput = "Error";
    storedValue = null;
    selectedOperator = null;
    waitingForInput = true;
    history.textContent = "No se puede dividir entre cero";
    updateDisplay();
}

function showResult() {
    if (!selectedOperator || storedValue === null || waitingForInput) {
        return;
    }

    const secondValue = Number(currentInput);
    const result = calculate(storedValue, secondValue, selectedOperator);
    if (result === null) {
        showDivisionError();
        return;
    }

    history.textContent = `${formatResult(storedValue)} ${operatorSymbols[selectedOperator]} ${formatResult(secondValue)} =`;
    currentInput = String(Number(result.toPrecision(12)));
    storedValue = null;
    selectedOperator = null;
    waitingForInput = true;
    updateDisplay();
}

function clearCalculator() {
    currentInput = "0";
    storedValue = null;
    selectedOperator = null;
    waitingForInput = false;
    history.innerHTML = "&nbsp;";
    updateDisplay();
}

function deleteLastDigit() {
    if (waitingForInput || currentInput === "Error") {
        return;
    }
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
    if (currentInput === "-") {
        currentInput = "0";
    }
    updateDisplay();
}

keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
        return;
    }

    if (button.dataset.digit !== undefined) {
        inputDigit(button.dataset.digit);
    } else if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    } else if (button.dataset.action === "decimal") {
        inputDecimal();
    } else if (button.dataset.action === "equals") {
        showResult();
    } else if (button.dataset.action === "clear") {
        clearCalculator();
    } else if (button.dataset.action === "backspace") {
        deleteLastDigit();
    }
});

document.addEventListener("keydown", (event) => {
    if (/^\d$/.test(event.key)) {
        inputDigit(event.key);
    } else if (event.key === "." || event.key === ",") {
        inputDecimal();
    } else if (Object.hasOwn(operatorSymbols, event.key)) {
        chooseOperator(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        showResult();
    } else if (event.key === "Backspace") {
        deleteLastDigit();
    } else if (event.key === "Escape" || event.key === "Delete") {
        clearCalculator();
    }
});

updateDisplay();
