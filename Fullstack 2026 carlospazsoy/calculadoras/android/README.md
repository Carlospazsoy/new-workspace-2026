# Calculadora para Android

Aplicación Android nativa en Kotlin con Jetpack Compose. Incluye suma, resta,
multiplicación, división, decimales, cambio de signo, borrar y operaciones
encadenadas.

## Abrir en Android Studio

1. Instala Android Studio y deja que instale el Android SDK 35 si lo solicita.
2. En Android Studio, elige **Open**.
3. Selecciona la carpeta `calculadoras/android` (la que contiene `settings.gradle.kts`).
4. Espera a que Gradle termine la sincronización. Acepta instalar los componentes
   que Android Studio solicite.
5. Selecciona un emulador Android o conecta un teléfono con depuración USB.
6. Pulsa **Run ▶** para instalar y abrir la calculadora.

La primera sincronización necesita conexión a Internet para descargar Gradle y
las dependencias de Android.

## Pruebas

En Android Studio, ejecuta `CalculatorStateTest` desde
`app/src/test/java/com/carlospaz/calculadora/CalculatorStateTest.kt`, o ejecuta
la tarea `testDebugUnitTest` desde la ventana Gradle.
