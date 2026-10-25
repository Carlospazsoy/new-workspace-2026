import tkinter as tk


BACKGROUND = "#10131f"
PANEL = "#1b1f30"
DISPLAY_BACKGROUND = "#121522"
KEY_BACKGROUND = "#292d40"
KEY_HOVER = "#373c53"
OPERATOR_BACKGROUND = "#302b4b"
OPERATOR_HOVER = "#403a61"
ACCENT = "#7965ed"
TEXT = "#f5f6fb"
MUTED = "#9297ae"

OPERATORS = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷",
}


class CalculatorApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.current_input = "0"
        self.stored_value: float | None = None
        self.selected_operator: str | None = None
        self.waiting_for_input = False
        self.just_calculated = False

        root.title("Calculadora")
        root.configure(bg=BACKGROUND)
        root.resizable(False, False)
        root.minsize(360, 560)

        self.display_text = tk.StringVar(value="0")
        self.history_text = tk.StringVar(value=" ")
        self._build_interface()
        self._bind_keyboard()

    def _build_interface(self) -> None:
        panel = tk.Frame(self.root, bg=PANEL, padx=22, pady=22)
        panel.pack(fill="both", expand=True, padx=16, pady=16)

        header = tk.Frame(panel, bg=PANEL)
        header.pack(fill="x", pady=(0, 22))

        icon = tk.Label(
            header,
            text="+",
            bg=ACCENT,
            fg=TEXT,
            font=("Segoe UI", 23, "bold"),
            width=2,
            height=1,
            padx=3,
            pady=3,
        )
        icon.pack(side="left", padx=(0, 12))

        title_area = tk.Frame(header, bg=PANEL)
        title_area.pack(side="left", anchor="center")
        tk.Label(
            title_area,
            text="HERRAMIENTA",
            bg=PANEL,
            fg=MUTED,
            font=("Segoe UI", 8, "bold"),
        ).pack(anchor="w")
        tk.Label(
            title_area,
            text="Calculadora",
            bg=PANEL,
            fg=TEXT,
            font=("Segoe UI", 15, "bold"),
        ).pack(anchor="w")

        display = tk.Frame(
            panel,
            bg=DISPLAY_BACKGROUND,
            padx=16,
            pady=14,
            highlightthickness=1,
            highlightbackground="#292d3e",
        )
        display.pack(fill="x", pady=(0, 16))
        tk.Label(
            display,
            textvariable=self.history_text,
            bg=DISPLAY_BACKGROUND,
            fg=MUTED,
            font=("Segoe UI", 11),
            anchor="e",
        ).pack(fill="x", pady=(0, 7))
        tk.Label(
            display,
            textvariable=self.display_text,
            bg=DISPLAY_BACKGROUND,
            fg=TEXT,
            font=("Segoe UI", 32, "bold"),
            anchor="e",
        ).pack(fill="x")

        keypad = tk.Frame(panel, bg=PANEL)
        keypad.pack(fill="both", expand=True)
        for column in range(4):
            keypad.columnconfigure(column, weight=1, uniform="key")
        for row in range(5):
            keypad.rowconfigure(row, weight=1, uniform="key")

        keys = [
            ("AC", self.clear, "utility"),
            ("⌫", self.backspace, "utility"),
            ("÷", lambda: self.choose_operator("/"), "operator"),
            ("×", lambda: self.choose_operator("*"), "operator"),
            ("7", lambda: self.input_digit("7"), "number"),
            ("8", lambda: self.input_digit("8"), "number"),
            ("9", lambda: self.input_digit("9"), "number"),
            ("−", lambda: self.choose_operator("-"), "operator"),
            ("4", lambda: self.input_digit("4"), "number"),
            ("5", lambda: self.input_digit("5"), "number"),
            ("6", lambda: self.input_digit("6"), "number"),
            ("+", lambda: self.choose_operator("+"), "operator"),
            ("1", lambda: self.input_digit("1"), "number"),
            ("2", lambda: self.input_digit("2"), "number"),
            ("3", lambda: self.input_digit("3"), "number"),
            ("=", self.show_result, "equals"),
            ("0", lambda: self.input_digit("0"), "number"),
            (".", self.input_decimal, "number"),
            ("±", self.toggle_sign, "number"),
        ]

        for index, (label, command, kind) in enumerate(keys):
            row, column = divmod(index, 4)
            if label == "=":
                row_span = 2
            else:
                row_span = 1
            self._add_button(
                keypad,
                label,
                command,
                kind,
                row=row,
                column=column,
                rowspan=row_span,
            )

        tk.Label(
            panel,
            text="Usa el teclado o haz clic en los botones",
            bg=PANEL,
            fg="#777c93",
            font=("Segoe UI", 9),
        ).pack(pady=(15, 0))

    def _add_button(
        self,
        parent: tk.Frame,
        label: str,
        command,
        kind: str,
        *,
        row: int,
        column: int,
        rowspan: int = 1,
    ) -> None:
        backgrounds = {
            "number": (KEY_BACKGROUND, KEY_HOVER, TEXT),
            "utility": ("#35334c", OPERATOR_HOVER, "#c0b7ff"),
            "operator": (OPERATOR_BACKGROUND, OPERATOR_HOVER, "#b8aaff"),
            "equals": (ACCENT, "#8b78ff", TEXT),
        }
        background, hover, foreground = backgrounds[kind]
        button = tk.Button(
            parent,
            text=label,
            command=command,
            bg=background,
            fg=foreground,
            activebackground=hover,
            activeforeground=TEXT,
            relief="flat",
            bd=0,
            cursor="hand2",
            font=("Segoe UI", 17 if kind == "utility" else 20, "bold"),
            takefocus=True,
        )
        button.grid(
            row=row,
            column=column,
            rowspan=rowspan,
            sticky="nsew",
            padx=5,
            pady=5,
        )
        button.bind("<Enter>", lambda _event: button.configure(bg=hover))
        button.bind("<Leave>", lambda _event: button.configure(bg=background))

    def _bind_keyboard(self) -> None:
        for digit in "0123456789":
            self.root.bind(digit, lambda _event, value=digit: self.input_digit(value))
        for operator in OPERATORS:
            self.root.bind(operator, lambda _event, value=operator: self.choose_operator(value))
        self.root.bind(".", lambda _event: self.input_decimal())
        self.root.bind(",", lambda _event: self.input_decimal())
        self.root.bind("<Return>", lambda _event: self.show_result())
        self.root.bind("=", lambda _event: self.show_result())
        self.root.bind("<BackSpace>", lambda _event: self.backspace())
        self.root.bind("<Escape>", lambda _event: self.clear())

    def _update_display(self) -> None:
        shown_value = self.current_input.replace(".", ",")
        self.display_text.set(shown_value)

    @staticmethod
    def _format_number(value: float) -> str:
        rounded = float(f"{value:.12g}")
        return f"{rounded:g}".replace(".", ",")

    def input_digit(self, digit: str) -> None:
        if self.waiting_for_input or self.just_calculated or self.current_input == "Error":
            self.current_input = digit
            self.waiting_for_input = False
            self.just_calculated = False
        elif self.current_input == "0":
            self.current_input = digit
        elif len(self.current_input.replace("-", "").replace(".", "")) < 14:
            self.current_input += digit
        self._update_display()

    def input_decimal(self) -> None:
        if self.waiting_for_input or self.just_calculated or self.current_input == "Error":
            self.current_input = "0."
            self.waiting_for_input = False
            self.just_calculated = False
        elif "." not in self.current_input:
            self.current_input += "."
        self._update_display()

    @staticmethod
    def _calculate(first: float, second: float, operator: str) -> float:
        if operator == "+":
            return first + second
        if operator == "-":
            return first - second
        if operator == "*":
            return first * second
        if operator == "/":
            return first / second
        raise ValueError("Operador no válido.")

    def choose_operator(self, operator: str) -> None:
        if self.current_input == "Error":
            self.clear()

        input_value = float(self.current_input)
        if self.selected_operator and not self.waiting_for_input:
            if self.selected_operator == "/" and input_value == 0:
                self._show_division_error()
                return
            result = self._calculate(self.stored_value, input_value, self.selected_operator)
            self.current_input = f"{result:.12g}"
            self.stored_value = float(self.current_input)
            self._update_display()
        else:
            self.stored_value = input_value

        self.selected_operator = operator
        self.waiting_for_input = True
        self.just_calculated = False
        self.history_text.set(
            f"{self._format_number(self.stored_value)} {OPERATORS[operator]}"
        )

    def _show_division_error(self) -> None:
        self.current_input = "Error"
        self.stored_value = None
        self.selected_operator = None
        self.waiting_for_input = True
        self.just_calculated = False
        self.history_text.set("No se puede dividir entre cero")
        self._update_display()

    def show_result(self) -> None:
        if (
            self.selected_operator is None
            or self.stored_value is None
            or self.waiting_for_input
            or self.current_input == "Error"
        ):
            return

        second_value = float(self.current_input)
        if self.selected_operator == "/" and second_value == 0:
            self._show_division_error()
            return

        result = self._calculate(self.stored_value, second_value, self.selected_operator)
        self.history_text.set(
            f"{self._format_number(self.stored_value)} "
            f"{OPERATORS[self.selected_operator]} "
            f"{self._format_number(second_value)} ="
        )
        self.current_input = f"{result:.12g}"
        self.stored_value = None
        self.selected_operator = None
        self.waiting_for_input = False
        self.just_calculated = True
        self._update_display()

    def clear(self) -> None:
        self.current_input = "0"
        self.stored_value = None
        self.selected_operator = None
        self.waiting_for_input = False
        self.just_calculated = False
        self.history_text.set(" ")
        self._update_display()

    def toggle_sign(self) -> None:
        if self.current_input == "Error":
            return
        if self.current_input.startswith("-"):
            self.current_input = self.current_input[1:]
        else:
            self.current_input = f"-{self.current_input}"
        self._update_display()

    def backspace(self) -> None:
        if self.waiting_for_input or self.just_calculated or self.current_input == "Error":
            return
        self.current_input = (
            self.current_input[:-1] if len(self.current_input) > 1 else "0"
        )
        if self.current_input in {"", "-"}:
            self.current_input = "0"
        self._update_display()


def main() -> None:
    root = tk.Tk()
    CalculatorApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
