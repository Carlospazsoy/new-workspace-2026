const lessons = [
  {
    id: 'html-01', subject: 'HTML', unit: 'Fundamentos', title: 'Dale estructura a la web',
    summary: 'HTML describe el contenido de una página: títulos, párrafos, imágenes y enlaces. Piensa en él como el esqueleto que le da orden a todo lo demás.',
    key: 'Las etiquetas envuelven contenido y comunican qué papel cumple. La mayoría tiene apertura, contenido y cierre.',
    code: '<h1>Mi primera página</h1>\n<p>Estoy aprendiendo a crear para la web.</p>\n<a href="contacto.html">Conóceme</a>',
    challenge: 'Crea un título con tu nombre y un párrafo que cuente qué te gustaría construir.',
    question: '¿Qué etiqueta representa el título principal de una página?', options: ['<head>', '<h1>', '<title>'], answer: 1,
    explanation: '<h1> marca el encabezado principal visible. <title> nombra la pestaña del navegador.'
  },
  {
    id: 'html-02', subject: 'HTML', unit: 'Semántica', title: 'Elige etiquetas con sentido',
    summary: 'Las etiquetas semánticas explican la función de cada parte del contenido. Ayudan a que personas, navegadores y tecnologías de asistencia entiendan la página.',
    key: 'Usa <header>, <nav>, <main> y <footer> según la función de cada zona, no por cómo quieres que se vea.',
    code: '<header><h1>Cuaderno de viaje</h1></header>\n<main>\n  <article>\n    <h2>Mi primera ruta</h2>\n    <p>Una historia para compartir.</p>\n  </article>\n</main>',
    challenge: 'Convierte una página con varios <div> en una estructura con header, main y footer.',
    question: '¿Qué etiqueta debería contener el contenido único y principal?', options: ['<main>', '<aside>', '<small>'], answer: 0,
    explanation: '<main> identifica el contenido central y único de esa página.'
  },
  {
    id: 'html-03', subject: 'HTML', unit: 'Formularios', title: 'Pide información con cuidado',
    summary: 'Los formularios permiten que las personas escriban y envíen datos. Una etiqueta asociada a cada campo hace que el formulario sea más claro y accesible.',
    key: 'Conecta <label> e <input> usando el mismo valor en for e id.',
    code: '<form>\n  <label for="correo">Tu correo</label>\n  <input id="correo" name="correo" type="email" required>\n  <button type="submit">Suscribirme</button>\n</form>',
    challenge: 'Agrega un campo para el nombre y una etiqueta que quede asociada correctamente.',
    question: '¿Qué atributo conecta la etiqueta con su campo?', options: ['for e id', 'class e style', 'src e alt'], answer: 0,
    explanation: 'El valor de for en <label> debe coincidir con el id del campo.'
  },
  {
    id: 'css-01', subject: 'CSS', unit: 'Selectores', title: 'Dale estilo al contenido',
    summary: 'CSS controla la presentación visual. Una regla selecciona elementos y les asigna propiedades como color, tamaño, espacio o alineación.',
    key: 'Una regla CSS combina un selector con declaraciones entre llaves.',
    code: 'h1 {\n  color: #397d83;\n  font-size: 2rem;\n}\n\n.nota {\n  padding: 1rem;\n}',
    challenge: 'Cambia el color de un título y crea una clase .destacado para resaltar una frase.',
    question: '¿Cómo se escribe un selector de clase?', options: ['#destacado', '.destacado', 'destacado()'], answer: 1,
    explanation: 'En CSS, las clases comienzan con punto. El símbolo # selecciona un id.'
  },
  {
    id: 'css-02', subject: 'CSS', unit: 'Flexbox', title: 'Ordena elementos en una fila',
    summary: 'Flexbox es ideal para distribuir elementos en una dimensión: una fila o una columna. Actívalo en el contenedor y ajusta cómo reparte el espacio.',
    key: 'display: flex convierte a los hijos directos en elementos flexibles.',
    code: '.barra {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}',
    challenge: 'Alinea un logo y dos enlaces en una barra, con espacio entre los elementos.',
    question: '¿Qué propiedad alinea elementos en el eje transversal?', options: ['align-items', 'font-weight', 'border-style'], answer: 0,
    explanation: 'align-items controla la alineación transversal; su dirección depende de flex-direction.'
  },
  {
    id: 'css-03', subject: 'CSS', unit: 'Diseño', title: 'Construye una cuadrícula',
    summary: 'CSS Grid organiza elementos en filas y columnas. Es útil para diseños de página, galerías y cualquier composición con dos dimensiones.',
    key: 'Define las columnas en el contenedor; los elementos hijos ocuparán las celdas disponibles.',
    code: '.galeria {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}',
    challenge: 'Prueba repeat(2, 1fr) y observa cómo cambia una galería de tres columnas.',
    question: '¿Qué activa el sistema de cuadrícula?', options: ['position: grid', 'display: grid', 'grid: on'], answer: 1,
    explanation: 'display: grid activa CSS Grid para el contenedor.'
  },
  {
    id: 'js-01', subject: 'JavaScript', unit: 'Fundamentos', title: 'Guarda datos en variables',
    summary: 'JavaScript añade comportamiento a la página. Las variables permiten guardar datos para utilizarlos y transformarlos durante el programa.',
    key: 'Usa const si no reasignarás la variable y let si su valor cambiará.',
    code: 'const nombre = "Luz";\nlet visitas = 0;\n\nvisitas = visitas + 1;\nconsole.log(nombre, visitas);',
    challenge: 'Guarda tu ciudad en una constante y cuenta cuántas veces haces clic en un botón.',
    question: '¿Cuál palabra declara una variable que puede reasignarse?', options: ['const', 'let', 'static'], answer: 1,
    explanation: 'let permite reasignar su valor. const evita la reasignación de la variable.'
  },
  {
    id: 'js-02', subject: 'JavaScript', unit: 'DOM', title: 'Encuentra y cambia elementos',
    summary: 'El DOM representa la página como objetos que JavaScript puede consultar y modificar. Así conectas datos y acciones con lo que se ve en pantalla.',
    key: 'document.querySelector busca el primer elemento que coincide con un selector CSS.',
    code: 'const titulo = document.querySelector("h1");\ntitulo.textContent = "Hola, web";\n\nconst nota = document.querySelector(".nota");\nnota.classList.add("visible");',
    challenge: 'Selecciona un párrafo por su id y cambia su texto con textContent.',
    question: '¿Qué método selecciona usando un selector CSS?', options: ['document.querySelector()', 'document.writeStyle()', 'window.findClass()'], answer: 0,
    explanation: 'querySelector acepta selectores CSS como "h1", ".nota" o "#inicio".'
  },
  {
    id: 'js-03', subject: 'JavaScript', unit: 'Eventos', title: 'Responde a una acción',
    summary: 'Los eventos permiten reaccionar a acciones como clics, escritura o envío de formularios. addEventListener conecta el evento con una función.',
    key: 'Escucha eventos en el elemento que los recibe y mantén la acción en una función clara.',
    code: 'const boton = document.querySelector("button");\nconst mensaje = document.querySelector(".mensaje");\n\nboton.addEventListener("click", () => {\n  mensaje.textContent = "¡Lo lograste!";\n});',
    challenge: 'Haz que un botón cambie el texto de un mensaje cuando alguien lo pulse.',
    question: '¿Qué método registra una función para un evento?', options: ['addEventListener()', 'onPageReady()', 'listenToClick()'], answer: 0,
    explanation: 'addEventListener registra el evento y la función que debe ejecutarse.'
  }
];

const list = document.querySelector('#lesson-list');
const view = document.querySelector('#lesson-view');
const progressLabel = document.querySelector('#progress-label');
const progressBar = document.querySelector('#progress-bar');
const progressTrack = document.querySelector('.progress-track');
const filters = document.querySelector('.filters');
const completed = new Set(JSON.parse(localStorage.getItem('estudio-web-completadas') || '[]'));
let currentId = lessons[0].id;
let activeFilter = 'Todo';
let selectedAnswer = null;

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function renderList() {
  const visibleLessons = lessons.filter((lesson) => activeFilter === 'Todo' || lesson.subject === activeFilter);
  list.innerHTML = visibleLessons.map((lesson) => {
    const index = lessons.indexOf(lesson) + 1;
    const isComplete = completed.has(lesson.id);
    return `<li><button class="lesson-link${lesson.id === currentId ? ' is-active' : ''}" type="button" data-lesson="${lesson.id}" aria-current="${lesson.id === currentId ? 'page' : 'false'}">
      <span class="lesson-number">${String(index).padStart(2, '0')}</span><span class="lesson-name">${lesson.title}</span><span class="lesson-check" aria-label="${isComplete ? 'Completada' : ''}">${isComplete ? '✓' : ''}</span>
    </button></li>`;
  }).join('');
}

function renderProgress() {
  const total = lessons.length;
  const count = completed.size;
  progressLabel.textContent = `${count} de ${total}`;
  progressBar.style.width = `${(count / total) * 100}%`;
  progressTrack.setAttribute('aria-valuenow', String(count));
}

function renderLesson() {
  const lesson = lessons.find((item) => item.id === currentId) || lessons[0];
  const index = lessons.indexOf(lesson);
  const subjectClass = lesson.subject.toLowerCase();
  const isComplete = completed.has(lesson.id);
  selectedAnswer = null;
  document.querySelector('#lesson-breadcrumb').textContent = `${lesson.subject} / ${lesson.unit.toUpperCase()}`;
  document.querySelector('#lesson-count').textContent = `LECCIÓN ${String(index + 1).padStart(2, '0')} / ${String(lessons.length).padStart(2, '0')}`;
  view.setAttribute('aria-busy', 'true');
  view.innerHTML = `
    <div class="lesson-kicker ${subjectClass}"><i aria-hidden="true"></i>${lesson.subject} <span>/</span> ${lesson.unit}</div>
    <h2 class="lesson-title">${lesson.title}</h2>
    <p class="lesson-summary">${lesson.summary}</p>
    <div class="concept-note"><strong>La idea clave</strong><p>${lesson.key}</p></div>
    <h3 class="section-heading">Mira cómo funciona</h3>
    <div class="code-panel">
      <div class="code-toolbar"><span>EJEMPLO.${lesson.subject === 'HTML' ? 'HTML' : lesson.subject === 'CSS' ? 'CSS' : 'JS'}</span><button class="copy-button" type="button" data-action="copy">Copiar código</button></div>
      <pre><code>${escapeHtml(lesson.code)}</code></pre>
    </div>
    <div class="challenge"><span class="challenge-mark" aria-hidden="true">↗</span><p><strong>Ahora tú</strong>${lesson.challenge}</p></div>
    <section class="quiz" aria-labelledby="quiz-title">
      <h3 class="quiz-title" id="quiz-title">Comprueba tu idea: ${lesson.question}</h3>
      <div class="quiz-options">${lesson.options.map((option, optionIndex) => `<button class="quiz-option" type="button" data-answer="${optionIndex}"><span class="option-key">${String.fromCharCode(65 + optionIndex)}</span><span>${escapeHtml(option)}</span></button>`).join('')}</div>
      <p class="quiz-feedback" role="status" aria-live="polite"></p>
    </section>
    <div class="lesson-actions">
      <button class="action-button" type="button" data-action="previous" ${index === 0 ? 'disabled' : ''}>← Anterior</button>
      <button class="action-button primary" type="button" data-action="complete" ${isComplete ? 'disabled' : ''}>${isComplete ? 'Lección completada ✓' : 'Marcar como completada'}</button>
      <button class="action-button" type="button" data-action="next" ${index === lessons.length - 1 ? 'disabled' : ''}>Siguiente →</button>
    </div>`;
  view.setAttribute('aria-busy', 'false');
  renderList();
}

function chooseLesson(id) {
  currentId = id;
  renderLesson();
}

list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-lesson]');
  if (button) chooseLesson(button.dataset.lesson);
});

filters.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = button.dataset.filter;
  filters.querySelectorAll('[data-filter]').forEach((filter) => {
    const isActive = filter === button;
    filter.classList.toggle('is-active', isActive);
    filter.setAttribute('aria-pressed', String(isActive));
  });
  renderList();
});

view.addEventListener('click', async (event) => {
  const answerButton = event.target.closest('[data-answer]');
  if (answerButton && selectedAnswer === null) {
    const lesson = lessons.find((item) => item.id === currentId);
    selectedAnswer = Number(answerButton.dataset.answer);
    const isCorrect = selectedAnswer === lesson.answer;
    view.querySelectorAll('[data-answer]').forEach((option, index) => {
      option.disabled = true;
      if (index === lesson.answer) option.classList.add('is-correct');
      else if (index === selectedAnswer) option.classList.add('is-wrong');
    });
    const feedback = view.querySelector('.quiz-feedback');
    feedback.textContent = `${isCorrect ? '¡Exacto!' : 'Casi.'} ${lesson.explanation}`;
    return;
  }

  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const action = actionButton.dataset.action;
  const lessonIndex = lessons.findIndex((lesson) => lesson.id === currentId);

  if (action === 'complete') {
    completed.add(currentId);
    localStorage.setItem('estudio-web-completadas', JSON.stringify([...completed]));
    renderProgress();
    renderLesson();
  } else if (action === 'previous' && lessonIndex > 0) {
    chooseLesson(lessons[lessonIndex - 1].id);
  } else if (action === 'next' && lessonIndex < lessons.length - 1) {
    chooseLesson(lessons[lessonIndex + 1].id);
  } else if (action === 'copy') {
    try {
      await navigator.clipboard.writeText(lessons[lessonIndex].code);
    } catch {
      const temporary = document.createElement('textarea');
      temporary.value = lessons[lessonIndex].code;
      temporary.setAttribute('readonly', '');
      temporary.style.position = 'fixed';
      temporary.style.opacity = '0';
      document.body.append(temporary);
      temporary.select();
      document.execCommand('copy');
      temporary.remove();
    }
    actionButton.textContent = 'Copiado';
    window.setTimeout(() => { actionButton.textContent = 'Copiar código'; }, 1400);
  }
});

renderProgress();
renderLesson();
