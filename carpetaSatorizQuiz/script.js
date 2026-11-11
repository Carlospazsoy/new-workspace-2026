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
const lobbyScreen = document.querySelector("#lobby-screen");
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
const roomStatus = document.querySelector("#room-status");
const createRoomButton = document.querySelector("#create-room-button");
const joinRoomButton = document.querySelector("#join-room-button");
const roomCodeInput = document.querySelector("#room-code-input");
const storageKey = "le-bon-produit-quiz-progress";

let playerName = "";
let questionIndex = 0;
let results = [];
let selectedAnswers = [];
let multiplayerClient = null;
let multiplayerMode = false;
let multiplayerStarted = false;
let currentRoomCode = "";

startForm.addEventListener("submit", (event) => {
  event.preventDefault();
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    playerNameInput.focus();
    return;
  }

  multiplayerMode = false;
  multiplayerStarted = false;
  currentRoomCode = "";
  document.querySelector("#scoreboard").hidden = true;
  document.querySelector("#result-scoreboard").hidden = true;
  document.querySelector("#reset-quiz-button").textContent = "Réinitialiser";
  document.querySelector("#restart-button").textContent = "Recommencer ↻";
  document.querySelector("#player-greeting").textContent = playerName;
  introScreen.hidden = true;
  quizScreen.hidden = false;
  setSaveStatus("Votre progression est enregistrée automatiquement sur cet appareil.", false);
  renderQuestion();
  saveProgress();
  document.querySelector("#question-title").focus();
});

createRoomButton.addEventListener("click", async () => {
  const name = getPlayerName();
  if (!name) return;
  createRoomButton.disabled = true;
  try {
    await multiplayerClient.createRoom(name);
  } catch (error) {
    setRoomStatus(error.message, true);
  } finally {
    createRoomButton.disabled = false;
  }
});

joinRoomButton.addEventListener("click", async () => {
  const name = getPlayerName();
  if (!name) return;
  joinRoomButton.disabled = true;
  try {
    await multiplayerClient.joinRoom(roomCodeInput.value, name);
  } catch (error) {
    setRoomStatus(error.message, true);
  } finally {
    joinRoomButton.disabled = false;
  }
});

roomCodeInput.addEventListener("input", () => {
  roomCodeInput.value = roomCodeInput.value.toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 6);
});

document.querySelector("#start-room-button").addEventListener("click", async () => {
  try {
    await multiplayerClient.startRoom();
  } catch (error) {
    document.querySelector("#lobby-status").textContent = error.message;
  }
});

document.querySelector("#copy-room-code-button").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(currentRoomCode);
    document.querySelector("#lobby-status").textContent = "Code copié. Partagez-le avec les autres joueurs.";
  } catch (error) {
    console.error("Le code de salle n’a pas pu être copié.", error);
    document.querySelector("#lobby-status").textContent = `Partagez ce code : ${currentRoomCode}`;
  }
});

document.querySelector("#leave-room-button").addEventListener("click", leaveCurrentRoom);
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
  if (multiplayerMode) {
    if (window.confirm("Voulez-vous quitter cette salle ? Votre joueur et son score seront retirés du classement.")) {
      leaveCurrentRoom(false);
    }
    return;
  }
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
  document.querySelector("#scoreboard").hidden = !multiplayerMode;
  document.querySelector("#reset-quiz-button").textContent = multiplayerMode ? "Quitter la salle" : "Réinitialiser";
  document.querySelector("#restart-button").textContent = multiplayerMode ? "Quitter la salle" : "Recommencer ↻";
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
  document.querySelector("#scoreboard").hidden = true;
  document.querySelector("#result-scoreboard").hidden = !multiplayerMode;
  document.querySelector("#result-room-code").textContent = currentRoomCode;
  document.querySelector("#restart-button").textContent = multiplayerMode ? "Quitter la salle" : "Recommencer ↻";
  saveProgress();
  document.querySelector("#restart-button").focus();
}

function saveProgress() {
  if (multiplayerMode && multiplayerClient) {
    multiplayerClient.updatePlayer({
      score: results.filter((result) => result.correct).length,
      questionIndex,
      results,
      selectedAnswers,
      finished: questionIndex === questions.length
    }).catch((error) => {
      console.error("La progression multijoueur n’a pas été enregistrée.", error);
    });
    return;
  }

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

function getPlayerName() {
  const name = playerNameInput.value.trim();
  if (!name) {
    playerNameInput.focus();
    setRoomStatus("Saisissez votre prénom ou identifiant avant de continuer.", true);
    return "";
  }
  playerName = name;
  return name;
}

function setRoomStatus(message, isError = false) {
  roomStatus.textContent = message;
  roomStatus.classList.toggle("is-error", isError);
}

function handleRoomData(event) {
  if (event.kind === "closed" || event.kind === "missing" || event.kind === "left") {
    multiplayerMode = false;
    multiplayerStarted = false;
    currentRoomCode = "";
    questionIndex = 0;
    results = [];
    selectedAnswers = [];
    lobbyScreen.hidden = true;
    quizScreen.hidden = true;
    resultScreen.hidden = true;
    introScreen.hidden = false;
    document.querySelector("#scoreboard").hidden = true;
    document.querySelector("#result-scoreboard").hidden = true;
    if (event.kind === "closed") setRoomStatus("L’hôte a fermé la salle.", true);
    if (event.kind === "missing") setRoomStatus("Cette salle n’existe plus.", true);
    return;
  }

  if (event.kind !== "room") return;
  currentRoomCode = event.roomCode;
  const room = event.room;
  const players = room.players || {};
  const currentPlayer = players[event.uid];
  if (!currentPlayer) {
    setRoomStatus("Vous ne faites plus partie de cette salle.", true);
    return;
  }

  playerName = currentPlayer.name;
  document.querySelector("#player-greeting").textContent = playerName;
  renderScoreboard(players, event.uid, document.querySelector("#scoreboard-list"));
  renderScoreboard(players, event.uid, document.querySelector("#result-scoreboard-list"));
  document.querySelector("#scoreboard-room-code").textContent = currentRoomCode;
  document.querySelector("#result-room-code").textContent = currentRoomCode;

  if (room.status === "lobby") {
    multiplayerMode = true;
    multiplayerStarted = false;
    introScreen.hidden = true;
    quizScreen.hidden = true;
    resultScreen.hidden = true;
    lobbyScreen.hidden = false;
    document.querySelector("#room-code-display").textContent = currentRoomCode;
    const playerCount = Object.keys(players).length;
    document.querySelector("#lobby-player-count").textContent =
      `${playerCount} joueur${playerCount > 1 ? "s" : ""}`;
    document.querySelector("#lobby-description").textContent =
      "Partagez le code. L’hôte lance le quiz ; chacun répond à son rythme et le classement se met à jour en direct.";
    document.querySelector("#lobby-player-list").replaceChildren(...Object.entries(players)
      .sort(([, first], [, second]) => first.name.localeCompare(second.name))
      .map(([uid, player]) => {
        const item = document.createElement("li");
        const name = document.createElement("span");
        const role = document.createElement("span");
        name.textContent = `${player.name}${uid === event.uid ? " (vous)" : ""}`;
        role.textContent = uid === event.hostUid ? "Hôte" : "Prêt";
        item.append(name, role);
        return item;
      }));
    document.querySelector("#start-room-button").hidden = event.uid !== event.hostUid;
    document.querySelector("#host-wait-message").hidden = event.uid === event.hostUid;
    document.querySelector("#lobby-status").textContent = event.uid === event.hostUid
      ? "Partagez le code, puis lancez la partie quand tout le monde est prêt."
      : "En attente du lancement par l’hôte…";
    return;
  }

  if (room.status !== "playing") return;
  multiplayerMode = true;
  const remoteResults = normalizePlayerResults(currentPlayer.results);
  const remoteQuestionIndex = Number.isInteger(currentPlayer.questionIndex)
    ? Math.min(Math.max(currentPlayer.questionIndex, 0), questions.length)
    : 0;
  const restoredQuestionIndex = Math.min(remoteQuestionIndex, remoteResults.length);
  const remoteSelectedAnswers = Array.isArray(currentPlayer.selectedAnswers)
    ? currentPlayer.selectedAnswers.filter(Number.isInteger)
    : [];
  const needsRender = !multiplayerStarted
    || restoredQuestionIndex !== questionIndex
    || JSON.stringify(remoteResults) !== JSON.stringify(results)
    || JSON.stringify(remoteSelectedAnswers) !== JSON.stringify(selectedAnswers);
  if (needsRender) {
    questionIndex = restoredQuestionIndex;
    results = remoteResults;
    selectedAnswers = remoteSelectedAnswers;
  }
  multiplayerStarted = true;
  introScreen.hidden = true;
  lobbyScreen.hidden = true;
  document.querySelector("#scoreboard").hidden = questionIndex >= questions.length;
  document.querySelector("#result-scoreboard").hidden = questionIndex < questions.length;
  if (questionIndex === questions.length && results.length === questions.length) {
    if (resultScreen.hidden) showResults();
    return;
  }

  resultScreen.hidden = true;
  quizScreen.hidden = false;
  if (needsRender) renderQuestion();
}

function normalizePlayerResults(remoteResults) {
  const values = Array.isArray(remoteResults)
    ? remoteResults
    : remoteResults && typeof remoteResults === "object"
      ? Object.keys(remoteResults).sort((a, b) => Number(a) - Number(b)).map((key) => remoteResults[key])
      : [];
  return values.slice(0, questions.length).filter((result) =>
    result && typeof result.correct === "boolean" && Array.isArray(result.selected));
}

function renderScoreboard(players, currentUid, list) {
  const entries = Object.entries(players)
    .sort(([, first], [, second]) =>
      (Number(second.score) || 0) - (Number(first.score) || 0)
      || (Number(second.questionIndex) || 0) - (Number(first.questionIndex) || 0));
  list.replaceChildren(...entries.map(([uid, player], index) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const score = document.createElement("strong");
    item.classList.toggle("is-current", uid === currentUid);
    name.textContent = `${index + 1}. ${player.name}${uid === currentUid ? " (vous)" : ""}`;
    score.textContent = `${Number(player.score) || 0}/5`;
    item.append(name, score);
    return item;
  }));
}

async function leaveCurrentRoom(confirmFirst = true) {
  if (!multiplayerClient) return;
  if (confirmFirst && !window.confirm("Voulez-vous quitter cette salle ? Votre joueur et son score seront retirés du classement.")) return;
  try {
    await multiplayerClient.leaveRoom();
    multiplayerMode = false;
    multiplayerStarted = false;
    questionIndex = 0;
    results = [];
    selectedAnswers = [];
    setRoomStatus("Vous avez quitté la salle.");
  } catch (error) {
    setRoomStatus(error.message, true);
  }
}

async function initializeMultiplayer() {
  try {
    const { createMultiplayer } = await import("./multiplayer.js");
    multiplayerClient = createMultiplayer({
      onRoomData: handleRoomData,
      onStatus: (message) => setRoomStatus(message),
      onError: (message) => {
        setRoomStatus(message, true);
        if (multiplayerMode) setSaveStatus(message, true);
      }
    });
    const connection = await multiplayerClient.ready;
    if (!connection.connected) {
      restoreProgress();
      return;
    }

    createRoomButton.disabled = false;
    joinRoomButton.disabled = false;
    setRoomStatus(connection.resumed
      ? "Votre progression dans la salle a été restaurée."
      : "Accès multijoueur prêt. Créez une salle ou saisissez un code.");
    if (!connection.resumed) restoreProgress();
  } catch (error) {
    console.error("Impossible de charger le module multijoueur.", error);
    setRoomStatus("Firebase n’a pas pu être chargé. Le mode solo reste disponible.", true);
    restoreProgress();
  }
}

function restoreProgress() {
  const progress = loadProgress();
  if (!progress) return;

  introScreen.hidden = true;
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

initializeMultiplayer();
