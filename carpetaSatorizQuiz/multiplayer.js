import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import {
  getDatabase,
  get,
  onValue,
  ref,
  remove,
  serverTimestamp,
  set,
  update
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyClS-dg2RE6HFrBEyRsq7v2dqH4rNIlYzQ",
  authDomain: "le-bon-produit.firebaseapp.com",
  databaseURL: "https://le-bon-produit-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "le-bon-produit",
  storageBucket: "le-bon-produit.firebasestorage.app",
  messagingSenderId: "812031209422",
  appId: "1:812031209422:web:08305754b6846e6010059f"
};

const roomSessionKey = "le-bon-produit-multiplayer-room";
const roomCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createMultiplayer({ onRoomData, onStatus, onError }) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);
  let user = null;
  let roomId = "";
  let roomCode = "";
  let hostUid = "";
  let roomUnsubscribe = null;
  let authenticationStarted = false;
  let initializedUid = "";
  let resolveReady;

  const ready = new Promise((resolve) => {
    resolveReady = resolve;
  });

  onAuthStateChanged(auth, (authenticatedUser) => {
    if (authenticatedUser) {
      if (initializedUid === authenticatedUser.uid) return;
      initializedUid = authenticatedUser.uid;
      user = authenticatedUser;
      initializeSession().then(resolveReady).catch((error) => {
        console.error("Impossible d’initialiser la session Firebase.", error);
        onError("Connexion Firebase impossible. Vérifiez le domaine autorisé et les règles de la base.");
        resolveReady({ connected: false, resumed: false });
      });
      return;
    }

    if (authenticationStarted) return;
    authenticationStarted = true;
    signInAnonymously(auth).catch((error) => {
      console.error("La connexion anonyme à Firebase a échoué.", error);
      onError("Connexion multijoueur impossible. Vérifiez que l’accès anonyme est activé dans Firebase Authentication.");
      resolveReady({ connected: false, resumed: false });
    });
  }, (error) => {
    console.error("Firebase Authentication a signalé une erreur.", error);
    onError("Firebase Authentication n’a pas pu démarrer. Vous pouvez toujours jouer en solo.");
    resolveReady({ connected: false, resumed: false });
  });

  async function initializeSession() {
    onStatus("Authentification anonyme Firebase prête.");
    const resumed = await restoreRoomSession();
    return { connected: true, resumed };
  }

  async function restoreRoomSession() {
    let savedSession;
    try {
      const rawSession = localStorage.getItem(roomSessionKey);
      if (!rawSession) return false;
      savedSession = JSON.parse(rawSession);
    } catch (error) {
      console.error("La session de salle enregistrée n’a pas pu être lue.", error);
      clearSavedRoomSession();
      onError("La dernière salle n’a pas pu être restaurée. Vous pouvez en rejoindre une autre.");
      return false;
    }

    if (!savedSession || !/^[A-Z2-9]{6}$/.test(savedSession.roomCode)
        || typeof savedSession.playerName !== "string") {
      clearSavedRoomSession();
      return false;
    }

    try {
      const playerSnapshot = await get(ref(database, `rooms/${savedSession.roomCode}/players/${user.uid}`));
      if (!playerSnapshot.exists()) {
        clearSavedRoomSession();
        return false;
      }

      const roomSnapshot = await get(ref(database, `rooms/${savedSession.roomCode}`));
      if (!roomSnapshot.exists() || roomSnapshot.val().status === "closed") {
        clearSavedRoomSession();
        return false;
      }

      roomCode = savedSession.roomCode;
      roomId = roomCode;
      hostUid = roomSnapshot.val().hostUid;
      attachRoomListener();
      return true;
    } catch (error) {
      console.error("La salle enregistrée n’a pas pu être restaurée.", error);
      onError("Impossible de restaurer la salle. Vérifiez les règles de Realtime Database.");
      return false;
    }
  }

  async function createRoom(playerName) {
    requireConnection();
    let code;
    try {
      code = await generateRoomCode();
    } catch (error) {
      console.error("Firebase n’a pas autorisé la réservation d’un code de salle.", error);
      throw new Error("La base bloque encore l’accès. Publiez les règles de database.rules.json dans Firebase Console.");
    }
    const room = {
      hostUid: user.uid,
      status: "lobby",
      questionIndex: 0,
      createdAt: serverTimestamp(),
      players: {
        [user.uid]: createPlayer(playerName)
      }
    };

    try {
      await set(ref(database, `rooms/${code}`), room);
      roomCode = code;
      roomId = code;
      hostUid = user.uid;
      saveRoomSession(code, playerName);
      attachRoomListener();
    } catch (error) {
      console.error("La création de la salle a échoué.", error);
      throw new Error("Impossible de créer la salle. Vérifiez les règles de Realtime Database.");
    }
  }

  async function joinRoom(inputCode, playerName) {
    requireConnection();
    const code = inputCode.trim().toUpperCase();
    if (!/^[A-Z2-9]{6}$/.test(code)) {
      throw new Error("Le code doit contenir 6 lettres ou chiffres.");
    }

    try {
      const [hostSnapshot, statusSnapshot, playerSnapshot] = await Promise.all([
        get(ref(database, `rooms/${code}/hostUid`)),
        get(ref(database, `rooms/${code}/status`)),
        get(ref(database, `rooms/${code}/players/${user.uid}`))
      ]);
      if (!hostSnapshot.exists() || !statusSnapshot.exists()) {
        throw new Error("Cette salle n’existe pas. Vérifiez le code.");
      }

      const status = statusSnapshot.val();
      if (status === "closed") throw new Error("Cette salle a été fermée.");
      if (!playerSnapshot.exists() && status !== "lobby") {
        throw new Error("La partie a déjà commencé. Rejoignez une salle en attente.");
      }

      if (!playerSnapshot.exists()) {
        await set(ref(database, `rooms/${code}/players/${user.uid}`), createPlayer(playerName));
      } else {
        await update(ref(database, `rooms/${code}/players/${user.uid}`), { name: playerName });
      }

      roomCode = code;
      roomId = code;
      hostUid = hostSnapshot.val();
      saveRoomSession(code, playerName);
      attachRoomListener();
    } catch (error) {
      console.error("Impossible de rejoindre la salle.", error);
      if (error instanceof Error && !/permission[_ ]denied/i.test(error.message)) throw error;
      throw new Error("Impossible de rejoindre la salle. Vérifiez le code et les règles de Realtime Database.");
    }
  }

  async function startRoom() {
    requireRoom();
    if (user.uid !== hostUid) throw new Error("Seul l’hôte peut lancer la partie.");
    try {
      await set(ref(database, `rooms/${roomId}/status`), "playing");
    } catch (error) {
      console.error("Impossible de lancer la partie.", error);
      throw new Error("Impossible de lancer la partie. Vérifiez les règles de Realtime Database.");
    }
  }

  async function updatePlayer(playerState) {
    requireRoom();
    try {
      await update(ref(database, `rooms/${roomId}/players/${user.uid}`), {
        score: playerState.score,
        questionIndex: playerState.questionIndex,
        results: playerState.results,
        selectedAnswers: playerState.selectedAnswers,
        finished: playerState.finished,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("La progression du joueur n’a pas pu être synchronisée.", error);
      onError("La progression n’a pas pu être synchronisée. Vérifiez votre connexion et les règles de la base.");
      throw error;
    }
  }

  async function leaveRoom() {
    requireRoom();
    const leavingRoomId = roomId;
    const leavingUid = user.uid;
    const isHost = leavingUid === hostUid;
    stopRoomListener();

    try {
      if (isHost) {
        await set(ref(database, `rooms/${leavingRoomId}/status`), "closed");
      }
      await remove(ref(database, `rooms/${leavingRoomId}/players/${leavingUid}`));
      clearRoom();
      onRoomData({ kind: "left", roomCode: leavingRoomId, uid: leavingUid, hostUid });
    } catch (error) {
      console.error("La sortie de la salle n’a pas pu être synchronisée.", error);
      throw new Error("Impossible de quitter la salle. Vérifiez les règles de Realtime Database.");
    }
  }

  async function generateRoomCode() {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const randomValues = new Uint8Array(6);
      crypto.getRandomValues(randomValues);
      const candidate = [...randomValues]
        .map((value) => roomCodeAlphabet[value % roomCodeAlphabet.length])
        .join("");
      const existingRoom = await get(ref(database, `rooms/${candidate}/hostUid`));
      if (!existingRoom.exists()) return candidate;
    }
    throw new Error("Impossible de générer un code de salle. Réessayez.");
  }

  function createPlayer(playerName) {
    return {
      name: playerName,
      score: 0,
      questionIndex: 0,
      results: [],
      selectedAnswers: [],
      finished: false
    };
  }

  function attachRoomListener() {
    stopRoomListener();
    roomUnsubscribe = onValue(ref(database, `rooms/${roomId}`), (snapshot) => {
      if (!snapshot.exists()) {
        onRoomData({ kind: "missing", roomCode, uid: user.uid, hostUid });
        return;
      }

      const room = snapshot.val();
      if (room.status === "closed") {
        stopRoomListener();
        clearSavedRoomSession();
        onRoomData({ kind: "closed", roomCode, uid: user.uid, hostUid });
        clearRoom();
        return;
      }
      onRoomData({ kind: "room", roomCode, uid: user.uid, hostUid: room.hostUid, room });
    }, (error) => {
      console.error("Impossible d’écouter les mises à jour de la salle.", error);
      onError("La connexion à la salle a été perdue. Rechargez la page pour réessayer.");
    });
  }

  function stopRoomListener() {
    if (roomUnsubscribe) {
      roomUnsubscribe();
      roomUnsubscribe = null;
    }
  }

  function saveRoomSession(code, playerName) {
    try {
      localStorage.setItem(roomSessionKey, JSON.stringify({ roomCode: code, playerName }));
    } catch (error) {
      console.error("Impossible d’enregistrer la salle sur cet appareil.", error);
      onError("La salle fonctionne, mais ce navigateur ne peut pas enregistrer la session pour la restaurer après actualisation.");
    }
  }

  function clearSavedRoomSession() {
    try {
      localStorage.removeItem(roomSessionKey);
    } catch (error) {
      console.error("Impossible d’effacer la salle enregistrée sur cet appareil.", error);
      onError("La session de salle enregistrée n’a pas pu être effacée dans ce navigateur.");
    }
  }

  function clearRoom() {
    roomId = "";
    roomCode = "";
    hostUid = "";
  }

  function requireConnection() {
    if (!user) throw new Error("Firebase est encore en cours de connexion. Réessayez dans quelques secondes.");
  }

  function requireRoom() {
    requireConnection();
    if (!roomId) throw new Error("Vous n’êtes pas dans une salle.");
  }

  return {
    ready,
    createRoom,
    joinRoom,
    startRoom,
    updatePlayer,
    leaveRoom,
    get roomCode() {
      return roomCode;
    },
    get uid() {
      return user ? user.uid : "";
    }
  };
}
