package com.carlospaz.calculadora

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val Background = Color(0xFF10131F)
private val Panel = Color(0xFF1B1F30)
private val DisplayBackground = Color(0xFF121522)
private val NumberKey = Color(0xFF292D40)
private val UtilityKey = Color(0xFF35334C)
private val OperatorKey = Color(0xFF302B4B)
private val Accent = Color(0xFF7965ED)
private val PrimaryText = Color(0xFFF5F6FB)
private val MutedText = Color(0xFF9297AE)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = android.graphics.Color.rgb(16, 19, 31)
        window.navigationBarColor = android.graphics.Color.rgb(16, 19, 31)
        setContent {
            MaterialTheme {
                CalculatorScreen()
            }
        }
    }
}

@androidx.compose.runtime.Composable
private fun CalculatorScreen() {
    val calculator = remember { CalculatorState() }
    var display by remember { mutableStateOf(calculator.display) }
    var history by remember { mutableStateOf(calculator.history) }

    fun refresh() {
        display = calculator.display
        history = calculator.history
    }

    fun digit(value: Char) {
        calculator.inputDigit(value)
        refresh()
    }

    fun selectOperator(value: Char) {
        calculator.chooseOperator(value)
        refresh()
    }

    fun action(value: String) {
        when (value) {
            "clear" -> calculator.clear()
            "backspace" -> calculator.backspace()
            "decimal" -> calculator.inputDecimal()
            "sign" -> calculator.toggleSign()
            "equals" -> calculator.showResult()
        }
        refresh()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.radialGradient(
                    colors = listOf(Color(0xFF29234F), Background),
                    radius = 1000f
                )
            )
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .widthIn(max = 420.dp)
                .fillMaxWidth()
                .verticalScroll(rememberScrollState())
                .shadow(28.dp, RoundedCornerShape(28.dp))
                .background(
                    Brush.linearGradient(
                        listOf(Color(0xFF202438), Panel, Color(0xFF171A28))
                    ),
                    RoundedCornerShape(28.dp)
                )
                .padding(22.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(46.dp)
                        .shadow(8.dp, RoundedCornerShape(15.dp))
                        .background(
                            Brush.linearGradient(listOf(Color(0xFF9888FF), Accent)),
                            RoundedCornerShape(15.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text("+", color = PrimaryText, fontSize = 29.sp, fontWeight = FontWeight.Medium)
                }
                Spacer(Modifier.width(12.dp))
                Column {
                    Text(
                        "HERRAMIENTA",
                        color = MutedText,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.6.sp
                    )
                    Text(
                        "Calculadora",
                        color = PrimaryText,
                        fontSize = 19.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
                Spacer(Modifier.weight(1f))
                Box(
                    Modifier
                        .size(9.dp)
                        .background(Color(0xFF6DD6A4), CircleShape)
                )
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DisplayBackground, RoundedCornerShape(19.dp))
                    .padding(horizontal = 17.dp, vertical = 18.dp),
                horizontalAlignment = Alignment.End
            ) {
                Text(
                    text = history.ifEmpty { " " },
                    modifier = Modifier.fillMaxWidth(),
                    color = MutedText,
                    fontSize = 14.sp,
                    textAlign = TextAlign.End,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    text = display,
                    modifier = Modifier.fillMaxWidth(),
                    color = PrimaryText,
                    fontSize = if (display.length > 11) 36.sp else 48.sp,
                    fontWeight = FontWeight.Medium,
                    textAlign = TextAlign.End,
                    maxLines = 1,
                    softWrap = false,
                    overflow = TextOverflow.Ellipsis
                )
            }

            Column(verticalArrangement = Arrangement.spacedBy(9.dp)) {
                KeyRow(
                    listOf(
                        KeySpec("AC", "clear", KeyStyle.Utility),
                        KeySpec("⌫", "backspace", KeyStyle.Utility, "Borrar último dígito"),
                        KeySpec("÷", "operator", KeyStyle.Operator, "Dividir", '/'),
                        KeySpec("×", "operator", KeyStyle.Operator, "Multiplicar", '*')
                    ),
                    ::digit,
                    ::selectOperator,
                    ::action
                )
                KeyRow(
                    listOf(
                        KeySpec("7", "digit", digit = '7'),
                        KeySpec("8", "digit", digit = '8'),
                        KeySpec("9", "digit", digit = '9'),
                        KeySpec("−", "operator", KeyStyle.Operator, "Restar", '-')
                    ),
                    ::digit,
                    ::selectOperator,
                    ::action
                )
                KeyRow(
                    listOf(
                        KeySpec("4", "digit", digit = '4'),
                        KeySpec("5", "digit", digit = '5'),
                        KeySpec("6", "digit", digit = '6'),
                        KeySpec("+", "operator", KeyStyle.Operator, "Sumar", '+')
                    ),
                    ::digit,
                    ::selectOperator,
                    ::action
                )
                KeyRow(
                    listOf(
                        KeySpec("1", "digit", digit = '1'),
                        KeySpec("2", "digit", digit = '2'),
                        KeySpec("3", "digit", digit = '3'),
                        KeySpec("=", "equals", KeyStyle.Equals, "Igual")
                    ),
                    ::digit,
                    ::selectOperator,
                    ::action
                )
                KeyRow(
                    listOf(
                        KeySpec("0", "digit", span = 2, digit = '0'),
                        KeySpec("±", "sign", labelDescription = "Cambiar signo"),
                        KeySpec(",", "decimal", labelDescription = "Coma decimal")
                    ),
                    ::digit,
                    ::selectOperator,
                    ::action
                )
            }

            Text(
                text = "Usa los botones para hacer tus operaciones",
                modifier = Modifier.fillMaxWidth(),
                color = Color(0xFF777C93),
                fontSize = 11.sp,
                textAlign = TextAlign.Center
            )
        }
    }
}

private enum class KeyStyle {
    Number,
    Utility,
    Operator,
    Equals
}

private data class KeySpec(
    val label: String,
    val action: String,
    val style: KeyStyle = KeyStyle.Number,
    val labelDescription: String = label,
    val operator: Char? = null,
    val span: Int = 1,
    val digit: Char? = null
)

@androidx.compose.runtime.Composable
private fun KeyRow(
    keys: List<KeySpec>,
    onDigit: (Char) -> Unit,
    onOperator: (Char) -> Unit,
    onAction: (String) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(9.dp)
    ) {
        keys.forEach { key ->
            CalculatorKey(
                key = key,
                modifier = Modifier
                    .weight(key.span.toFloat())
                    .aspectRatio(1.05f),
                onClick = {
                    when {
                        key.digit != null -> onDigit(key.digit)
                        key.operator != null -> onOperator(key.operator)
                        else -> onAction(key.action)
                    }
                }
            )
        }
    }
}

@androidx.compose.runtime.Composable
private fun CalculatorKey(
    key: KeySpec,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    val color = when (key.style) {
        KeyStyle.Number -> NumberKey
        KeyStyle.Utility -> UtilityKey
        KeyStyle.Operator -> OperatorKey
        KeyStyle.Equals -> Accent
    }
    val textColor = when (key.style) {
        KeyStyle.Utility -> Color(0xFFC0B7FF)
        KeyStyle.Operator -> Color(0xFFB8AAFF)
        else -> PrimaryText
    }

    Surface(
        onClick = onClick,
        modifier = modifier.semantics {
            contentDescription = key.labelDescription
        },
        shape = RoundedCornerShape(17.dp),
        color = color
    ) {
        Box(contentAlignment = Alignment.Center) {
            Text(
                text = key.label,
                color = textColor,
                fontSize = if (key.style == KeyStyle.Operator) 25.sp else 20.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
