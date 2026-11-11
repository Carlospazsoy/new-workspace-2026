const questions = [
  {
    category: "POMME · IDENTIFICATION",
    photo: "assets/pomme-royal-gala.jpg",
    photoAlt: "Photo d'une pomme rouge, variété non spécifiée",
    prompt: "Quelle est la variété de cette pomme\u00a0?",
    hint: "Choisissez une seule réponse.",
    options: ["Royal Gala", "Topaz", "Inobi", "Golden"],
    correct: [0],
    explanation: "La Royal Gala se reconnaît souvent à sa peau rouge striée sur fond jaune."
  },
  {
    category: "POMME · CARACTÉRISTIQUES",
    photo: "assets/pomme-topaz.jpg",
    photoAlt: "Photo d'une pomme rouge, variété non spécifiée",
    prompt: "Quelles caractéristiques associer à la Topaz\u00a0?",
    hint: "Plusieurs réponses possibles.",
    options: ["Une chair croquante", "Une saveur acidulée", "Une pomme très farineuse", "Une peau jaune et rouge", "Une forme aplatie"],
    correct: [0, 1, 3, 4],
    explanation: "La Topaz est appréciée pour sa chair croquante et son goût acidulé. Les caractéristiques exactes peuvent varier selon le fournisseur."
  },
  {
    category: "POMME · CARACTÉRISTIQUES",
    photo: "assets/pomme-inobi.jpg",
    photoAlt: "Photo d'une pomme rouge, variété non spécifiée",
    prompt: "Quels repères retenir pour l’Inobi\u00a0?",
    hint: "Plusieurs réponses possibles.",
    options: ["Une peau rouge soutenu", "Une chair croquante", "Une peau verte uniforme", "Une variété de pomme de terre", "Une longe tige"],
    correct: [0, 1, 4],
    explanation: "Dans cette fiche d’exemple, l’Inobi est présentée comme une pomme à peau rouge soutenu et à chair croquante. Vérifiez ces repères avec la fiche de votre magasin."
  },
  {
    category: "POMME DE TERRE · CARACTÉRISTIQUES",
    photo: "assets/potatoes.jpg",
    photoAlt: "Photo de pommes de terre, variété non spécifiée",
    prompt: "Que retenir de la pomme de terre Allians\u00a0?",
    hint: "Plusieurs réponses possibles.",
    options: ["Une chair ferme", "Elle tient bien à la cuisson", "Une variété adaptée aux salades", "Une chair très farineuse"],
    correct: [0, 1, 2],
    explanation: "Allians est une pomme de terre à chair ferme, qui garde bien sa tenue : elle convient notamment aux salades et aux cuissons vapeur."
  },
  {
    category: "POMME DE TERRE · VARIÉTÉS",
    photo: "assets/potatoes.jpg",
    photoAlt: "Photo de pommes de terre, variété non spécifiée",
    prompt: "Quelles associations sont justes pour Monalisa et Spunta\u00a0?",
    hint: "Plusieurs réponses possibles.",
    options: [
      "Monalisa est une variété polyvalente.",
      "Spunta a une forme plutôt allongée.",
      "Monalisa est une pomme à croquer.",
      "Spunta est souvent utilisée pour les frites."
    ],
    correct: [0, 1, 3],
    explanation: "Monalisa est une variété polyvalente. Spunta est allongée et souvent choisie pour les frites. Référez-vous aux consignes de votre magasin pour les usages précis."
  }
];

const introScreen = document.querySelector("#intro-screen");
const quizScreen = document.querySelector("#quiz-screen");
const resultScreen = document.querySelector("#result-screen");
const startForm = document.querySelector("#start-form");
const playerNameInput = document.querySelector("#player-name");
const answerForm = document.querySelector("#answer-form");
const answerList = document.querySelector("#answer-list");
const answerSubmit = document.querySelector("#answer-submit");
const nextButton = document.querySelector("#next-button");
const feedback = document.querySelector("#feedback");
const progressBar = document.querySelector("#progress-bar");
const progressTrack = document.querySelector(".progress-track");
const saveStatus = document.querySelector("#save-status");
const storageKey = "le-bon-produit-quiz-progress";

let playerName = "";
let questionIndex = 0;
let results = [];
let selectedAnswers = [];

startForm.addEventListener("submit", (event) => {
  event.preventDefault();
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    playerNameInput.focus();
    return;
  }

  document.querySelector("#player-greeting").textContent = playerName;
  introScreen.hidden = true;
  quizScreen.hidden = false;
  setSaveStatus("Votre progression est enregistrée automatiquement sur cet appareil.", false);
  renderQuestion();
  saveProgress();
  document.querySelector("#question-title").focus();
});

answerList.addEventListener("change", () => {
  if (results.length > questionIndex) return;
  feedback.hidden = true;
  feedback.classList.remove("is-wrong");
  selectedAnswers = [...answerList.querySelectorAll("input:checked")]
    .map((input) => Number(input.value))
    .sort((a, b) => a - b);
  saveProgress();
});

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (answerSubmit.hidden) return;

  const selected = [...answerList.querySelectorAll("input:checked")]
    .map((input) => Number(input.value))
    .sort((a, b) => a - b);
  if (selected.length === 0) {
    feedback.hidden = false;
    feedback.classList.add("is-wrong");
    feedback.querySelector(".feedback-status").textContent = "Réponse requise";
    feedback.querySelector(".feedback-explanation").textContent =
      "Sélectionnez au moins une réponse avant de valider.";
    return;
  }

  const question = questions[questionIndex];
  const correct = selected.length === question.correct.length
    && selected.every((answer, index) => answer === question.correct[index]);
  results.push({ correct, selected });
  selectedAnswers = selected;
  saveProgress();
  progressBar.style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(questionIndex + 1));
  answerList.querySelectorAll(".answer-option").forEach((option, index) => {
    option.classList.toggle("is-correct", question.correct.includes(index));
    option.classList.toggle("is-wrong", selected.includes(index) && !question.correct.includes(index));
    option.querySelector("input").disabled = true;
  });

  feedback.hidden = false;
  feedback.classList.toggle("is-wrong", !correct);
  feedback.querySelector(".feedback-status").textContent = correct ? "Bonne réponse !" : "Pas tout à fait.";
  feedback.querySelector(".feedback-explanation").textContent = question.explanation;
  answerSubmit.hidden = true;
  nextButton.hidden = false;
  nextButton.focus();
});

nextButton.addEventListener("click", () => {
  questionIndex += 1;
  selectedAnswers = [];
  saveProgress();
  if (questionIndex === questions.length) {
    showResults();
    return;
  }
  renderQuestion();
  document.querySelector("#question-title").focus();
});

document.querySelector("#restart-button").addEventListener("click", restartQuiz);
document.querySelector("#reset-quiz-button").addEventListener("click", restartQuiz);

function restartQuiz() {
  if (!window.confirm("Voulez-vous vraiment réinitialiser le quiz ? Votre progression sera effacée.")) return;

  try {
    localStorage.removeItem(storageKey);
    setSaveStatus("Le quiz a été réinitialisé. Vous pouvez recommencer.", false);
  } catch (error) {
    console.error("Impossible d’effacer la progression enregistrée.", error);
    setSaveStatus("La progression de cette session a été réinitialisée, mais le navigateur n’a pas pu effacer la sauvegarde.", true);
  }

  playerName = "";
  questionIndex = 0;
  results = [];
  selectedAnswers = [];
  resultScreen.hidden = true;
  quizScreen.hidden = true;
  introScreen.hidden = false;
  playerNameInput.value = "";
  playerNameInput.focus();
}

function renderQuestion() {
  const question = questions[questionIndex];
  document.querySelector("#question-number").textContent = String(questionIndex + 1).padStart(2, "0");
  document.querySelector("#product-category").textContent = question.category;
  document.querySelector("#question-title").textContent = question.prompt;
  document.querySelector("#question-hint").textContent = question.hint;
  document.querySelector("#product-visual").innerHTML =
    `<img class="product-photo" src="${question.photo}" alt="${question.photoAlt}">`;
  progressBar.style.width = `${(questionIndex / questions.length) * 100}%`;
  progressTrack.setAttribute("aria-valuenow", String(questionIndex));
  answerList.innerHTML = question.options.map((option, index) => `
    <div class="answer-option${question.correct.includes(index) && results.length > questionIndex ? " is-correct" : ""}${selectedAnswers.includes(index) && results.length > questionIndex && !question.correct.includes(index) ? " is-wrong" : ""}">
      <input id="answer-${index}" type="checkbox" name="answer" value="${index}"${selectedAnswers.includes(index) ? " checked" : ""}${results.length > questionIndex ? " disabled" : ""}>
      <label for="answer-${index}">${option}</label>
    </div>
  `).join("");

  const isAnswered = results.length > questionIndex;
  feedback.hidden = !isAnswered;
  feedback.classList.toggle("is-wrong", isAnswered && !results[questionIndex].correct);
  feedback.querySelector(".feedback-status").textContent = isAnswered
    ? results[questionIndex].correct ? "Bonne réponse !" : "Pas tout à fait."
    : "";
  feedback.querySelector(".feedback-explanation").textContent = isAnswered ? question.explanation : "";
  answerSubmit.hidden = isAnswered;
  nextButton.hidden = !isAnswered;
  if (isAnswered) {
    progressBar.style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
    progressTrack.setAttribute("aria-valuenow", String(questionIndex + 1));
  }
}

function showResults() {
  quizScreen.hidden = true;
  resultScreen.hidden = false;
  const score = results.filter((result) => result.correct).length;
  document.querySelector("#result-name").textContent = playerName;
  document.querySelector("#score-value").textContent = String(score);
  document.querySelector("#result-message").textContent = score === questions.length
    ? "Un sans-faute : vous avez l’œil pour les variétés !"
    : score >= 3
      ? "Un bon résultat. Continuez à vous entraîner pour gagner en précision."
      : "Chaque variété s’apprend : relisez les repères et retentez votre chance.";
  document.querySelector("#result-details").innerHTML = questions.map((question, index) => `
    <div class="result-row ${results[index].correct ? "" : "is-wrong"}">
      <span class="result-row-mark" aria-hidden="true">${results[index].correct ? "✓" : "×"}</span>
      <div><strong>Question ${index + 1} · ${results[index].correct ? "Correct" : "À revoir"}</strong>${question.explanation}</div>
    </div>
  `).join("");
  saveProgress();
  document.querySelector("#restart-button").focus();
}

function saveProgress() {
  const progress = {
    version: 1,
    playerName,
    questionIndex,
    results,
    selectedAnswers
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
    if (saveStatus.classList.contains("is-error")) {
      setSaveStatus("La sauvegarde automatique est de nouveau active.", false);
    }
  } catch (error) {
    console.error("Impossible d’enregistrer la progression du quiz.", error);
    setSaveStatus("La sauvegarde automatique est indisponible dans ce navigateur. Votre progression risque d’être perdue si vous actualisez la page.", true);
  }
}

function loadProgress() {
  let savedProgress;
  try {
    savedProgress = localStorage.getItem(storageKey);
  } catch (error) {
    console.error("Impossible de lire la progression enregistrée.", error);
    setSaveStatus("La sauvegarde automatique est indisponible dans ce navigateur.", true);
    return null;
  }
  if (!savedProgress) return null;

  try {
    const progress = JSON.parse(savedProgress);
    if (isValidProgress(progress)) return progress;
  } catch (error) {
    console.error("La progression enregistrée n’a pas pu être lue.", error);
  }

  setSaveStatus("La sauvegarde précédente est invalide. Un nouveau quiz va commencer.", true);
  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error("Impossible d’effacer une progression invalide.", error);
  }
  return null;
}

function isValidProgress(progress) {
  if (!progress || progress.version !== 1
      || typeof progress.playerName !== "string"
      || !progress.playerName.trim()
      || progress.playerName.length > 24
      || !Number.isInteger(progress.questionIndex)
      || progress.questionIndex < 0
      || progress.questionIndex > questions.length
      || !Array.isArray(progress.results)
      || !Array.isArray(progress.selectedAnswers)) return false;

  const isComplete = progress.questionIndex === questions.length;
  if (isComplete && progress.results.length !== questions.length) return false;
  if (!isComplete && (progress.results.length < progress.questionIndex
      || progress.results.length > progress.questionIndex + 1)) return false;

  const isValidSelection = (selection, question) =>
    Array.isArray(selection)
    && selection.every((answer, index) =>
      Number.isInteger(answer)
      && answer >= 0
      && answer < question.options.length
      && (index === 0 || selection[index - 1] < answer));

  for (let index = 0; index < progress.results.length; index += 1) {
    const result = progress.results[index];
    if (!result || !isValidSelection(result.selected, questions[index]) || result.selected.length === 0) return false;
    const isCorrect = result.selected.length === questions[index].correct.length
      && result.selected.every((answer, answerIndex) => answer === questions[index].correct[answerIndex]);
    if (result.correct !== isCorrect) return false;
  }

  if (isComplete) return progress.selectedAnswers.length === 0;
  const currentQuestion = questions[progress.questionIndex];
  if (!isValidSelection(progress.selectedAnswers, currentQuestion)) return false;
  return progress.results.length !== progress.questionIndex + 1
    || progress.selectedAnswers.length === progress.results[progress.questionIndex].selected.length
      && progress.selectedAnswers.every((answer, index) => answer === progress.results[progress.questionIndex].selected[index]);
}

function setSaveStatus(message, isError) {
  saveStatus.textContent = message;
  saveStatus.classList.toggle("is-error", isError);
  saveStatus.hidden = !message;
}

function restoreProgress() {
  const progress = loadProgress();
  if (!progress) return;

  playerName = progress.playerName;
  questionIndex = progress.questionIndex;
  results = progress.results;
  selectedAnswers = progress.selectedAnswers;
  setSaveStatus("Votre progression a été restaurée sur cet appareil.", false);

  if (questionIndex === questions.length) {
    showResults();
    return;
  }

  introScreen.hidden = true;
  quizScreen.hidden = false;
  document.querySelector("#player-greeting").textContent = playerName;
  renderQuestion();
}

restoreProgress();
