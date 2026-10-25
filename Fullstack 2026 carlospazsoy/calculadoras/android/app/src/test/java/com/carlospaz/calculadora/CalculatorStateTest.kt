package com.carlospaz.calculadora

import org.junit.Assert.assertEquals
import org.junit.Test

class CalculatorStateTest {
    @Test
    fun addsTwoNumbers() {
        val calculator = CalculatorState()
        calculator.inputDigit('3')
        calculator.chooseOperator('+')
        calculator.inputDigit('2')
        calculator.showResult()

        assertEquals("5", calculator.display)
    }

    @Test
    fun calculatesDecimals() {
        val calculator = CalculatorState()
        calculator.inputDigit('1')
        calculator.inputDecimal()
        calculator.inputDigit('5')
        calculator.chooseOperator('+')
        calculator.inputDigit('2')
        calculator.inputDecimal()
        calculator.inputDigit('5')
        calculator.showResult()

        assertEquals("3,75", calculator.display)
    }

    @Test
    fun chainsOperationsFromLeftToRight() {
        val calculator = CalculatorState()
        calculator.inputDigit('2')
        calculator.chooseOperator('+')
        calculator.inputDigit('3')
        calculator.chooseOperator('*')
        calculator.inputDigit('4')
        calculator.showResult()

        assertEquals("20", calculator.display)
    }

    @Test
    fun divisionByZeroShowsAnError() {
        val calculator = CalculatorState()
        calculator.inputDigit('9')
        calculator.chooseOperator('/')
        calculator.inputDigit('0')
        calculator.showResult()

        assertEquals("Error", calculator.display)
        assertEquals("No se puede dividir entre cero", calculator.history)
    }

    @Test
    fun backspaceRemovesLastDigit() {
        val calculator = CalculatorState()
        calculator.inputDigit('4')
        calculator.inputDigit('2')
        calculator.backspace()

        assertEquals("4", calculator.display)
    }

    @Test
    fun canEnterNegativeSecondOperand() {
        val calculator = CalculatorState()
        calculator.inputDigit('5')
        calculator.chooseOperator('+')
        calculator.toggleSign()
        calculator.inputDigit('2')
        calculator.showResult()

        assertEquals("3", calculator.display)
    }
}
