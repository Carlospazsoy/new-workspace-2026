package com.carlospaz.calculadora

import java.math.BigDecimal

class CalculatorState {
    var currentInput: String = "0"
        private set

    var history: String = ""
        private set

    private var storedValue: Double? = null
    private var selectedOperator: Char? = null
    private var waitingForInput = false
    private var justCalculated = false

    val display: String
        get() = currentInput.replace('.', ',')

    fun inputDigit(digit: Char) {
        require(digit in '0'..'9')

        if (waitingForInput || justCalculated || currentInput == "Error") {
            currentInput = digit.toString()
            waitingForInput = false
            justCalculated = false
        } else if (currentInput == "0") {
            currentInput = digit.toString()
        } else if (currentInput == "-0") {
            currentInput = "-$digit"
        } else if (currentInput.count { it.isDigit() } < MAX_INPUT_DIGITS) {
            currentInput += digit
        }
    }

    fun inputDecimal() {
        if (waitingForInput || justCalculated || currentInput == "Error") {
            currentInput = "0."
            waitingForInput = false
            justCalculated = false
        } else if ('.' !in currentInput) {
            currentInput += "."
        }
    }

    fun chooseOperator(operator: Char) {
        require(operator in OPERATORS)

        if (currentInput == "Error") clear()

        val inputValue = currentInput.toDouble()
        if (selectedOperator != null && !waitingForInput) {
            val result = calculateOrNull(
                first = requireNotNull(storedValue),
                second = inputValue,
                operator = requireNotNull(selectedOperator)
            )
            if (result == null) {
                showDivisionError()
                return
            }
            currentInput = normalizedNumber(result)
            storedValue = currentInput.toDouble()
        } else {
            storedValue = inputValue
        }

        selectedOperator = operator
        waitingForInput = true
        justCalculated = false
        history = "${formatNumber(requireNotNull(storedValue))} ${operator.symbol()}"
    }

    fun showResult() {
        val operator = selectedOperator ?: return
        val first = storedValue ?: return
        if (waitingForInput || currentInput == "Error") return

        val second = currentInput.toDouble()
        val result = calculateOrNull(first, second, operator)
        if (result == null) {
            showDivisionError()
            return
        }

        history = "${formatNumber(first)} ${operator.symbol()} ${formatNumber(second)} ="
        currentInput = normalizedNumber(result)
        storedValue = null
        selectedOperator = null
        waitingForInput = false
        justCalculated = true
    }

    fun clear() {
        currentInput = "0"
        storedValue = null
        selectedOperator = null
        waitingForInput = false
        justCalculated = false
        history = ""
    }

    fun backspace() {
        if (waitingForInput || justCalculated || currentInput == "Error") return
        currentInput = currentInput.dropLast(1).ifEmpty { "0" }
        if (currentInput == "-") currentInput = "0"
    }

    fun toggleSign() {
        if (currentInput == "Error") return
        if (waitingForInput) waitingForInput = false
        currentInput = if (currentInput.startsWith("-")) {
            currentInput.drop(1)
        } else {
            "-$currentInput"
        }
    }

    private fun showDivisionError() {
        currentInput = "Error"
        storedValue = null
        selectedOperator = null
        waitingForInput = true
        justCalculated = false
        history = "No se puede dividir entre cero"
    }

    private fun calculateOrNull(first: Double, second: Double, operator: Char): Double? {
        if (operator == '/' && second == 0.0) return null
        val result = when (operator) {
            '+' -> first + second
            '-' -> first - second
            '*' -> first * second
            '/' -> first / second
            else -> error("Operador no válido: $operator")
        }
        return result.takeIf { it.isFinite() }
    }

    private fun normalizedNumber(value: Double): String =
        BigDecimal.valueOf(value).stripTrailingZeros().toPlainString()

    private fun formatNumber(value: Double): String =
        normalizedNumber(value).replace('.', ',')

    private fun Char.symbol(): String = when (this) {
        '*' -> "×"
        '/' -> "÷"
        '-' -> "−"
        else -> toString()
    }

    private companion object {
        const val MAX_INPUT_DIGITS = 14
        val OPERATORS = setOf('+', '-', '*', '/')
    }
}
