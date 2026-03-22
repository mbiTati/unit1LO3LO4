import { useState, useEffect } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", dimmed: "#64748b", border: "#1e293b",
  success: "#10B981", danger: "#EF4444", primary: "#0D7377", secondary: "#14A3C7",
  code: "#1E293B", codeText: "#32E0C4", keyword: "#c792ea",
};

const KEY = "codequest-game-crud";

const MISSIONS = [
  { instruction: "Ajoutez \"Tesla\" à la liste", op: "add", param: "Tesla", check: (list) => list.includes("Tesla") },
  { instruction: "Ajoutez \"Edison\" à la liste", op: "add", param: "Edison", check: (list) => list.includes("Edison") },
  { instruction: "Ajoutez \"Bell\" à la liste", op: "add", param: "Bell", check: (list) => list.includes("Bell") },
  { instruction: "Affichez l'élément à l'index 0 (utilisez GET)", op: "get", param: "0", check: (_, __, lastOutput) => lastOutput !== "" },
  { instruction: "Remplacez l'élément à l'index 1 par \"Curie\" (utilisez SET)", op: "set", param: "1,Curie", check: (list) => list.includes("Curie") },
  { instruction: "Supprimez \"Bell\" de la liste (utilisez REMOVE)", op: "remove", param: "Bell", check: (list) => !list.includes("Bell") },
  { instruction: "Vérifiez si \"Tesla\" est dans la liste (utilisez CONTAINS)", op: "contains", param: "Tesla", check: (_, __, lastOutput) => lastOutput.includes("true") },
  { instruction: "Affichez la taille de la liste (utilisez SIZE)", op: "size", param: "", check: (_, __, lastOutput) => lastOutput !== "" },
  { instruction: "Ajoutez \"Turing\" et \"Lovelace\"", op: "add2", param: "Turing,Lovelace", check: (list) => list.includes("Turing") && list.includes("Lovelace") },
  { instruction: "Trouvez l'index de \"Curie\" (utilisez INDEXOF)", op: "indexOf", param: "Curie", check: (_, __, lastOutput) => lastOutput !== "" },
];

export default function Game04CRUD() {
  const [screen, setScreen] = useState("menu");
  const [list, setList] = useState([]);
  const [missionIdx, setMissionIdx] = useState(0);
  const [input, setInput] = useState("");
  const [op, setOp] = useState("add");
  const [output, setOutput] = useState([]);
  const [lastOutput, setLastOutput] = useState("");
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [history, setHistory] = useState([]);
  const [showJava, setShowJava] = useState(false);

  useEffect(() => { (async () => { try { const r = await window.storage.get(KEY); if (r) setHistory(JSON.parse(r.value)); } catch {} })(); }, []);

  const mission = MISSIONS[missionIdx];

  const startGame = () => {
    setList([]); setMissionIdx(0); setInput(""); setOp("add"); setOutput([]);
    setLastOutput(""); setScore(0); setErrors(0); setCompleted(false); setScreen("game");
  };

  const execute = () => {
    let newList = [...list];
    let out = "";
    let success = false;

    switch (op) {
      case "add":
        if (input.trim()) { newList.push(input.trim()); out = `add("${input.trim()}") → ajouté`; success = true; }
        else { out = "Erreur : valeur vide"; }
        break;
      case "get": {
        const idx = parseInt(input);
        if (!isNaN(idx) && idx >= 0 && idx < list.length) { out = `get(${idx}) → "${list[idx]}"`; success = true; }
        else { out = `Erreur : index ${input} invalide (taille: ${list.length})`; }
        break;
      }
      case "set": {
        const parts = input.split(",").map(s => s.trim());
        const idx = parseInt(parts[0]);
        if (parts.length === 2 && !isNaN(idx) && idx >= 0 && idx < list.length && parts[1]) {
          const old = newList[idx]; newList[idx] = parts[1];
          out = `set(${idx}, "${parts[1]}") → "${old}" remplacé par "${parts[1]}"`;
          success = true;
        } else { out = "Erreur : format attendu : index,valeur (ex: 1,Curie)"; }
        break;
      }
      case "remove": {
        const idx = newList.indexOf(input.trim());
        if (idx >= 0) { newList.splice(idx, 1); out = `remove("${input.trim()}") → supprimé (était à l'index ${idx})`; success = true; }
        else { out = `Erreur : "${input.trim()}" non trouvé dans la liste`; }
        break;
      }
      case "contains":
        out = `contains("${input.trim()}") → ${newList.includes(input.trim())}`; success = true;
        break;
      case "size":
        out = `size() → ${newList.length}`; success = true;
        break;
      case "indexOf": {
        const idx = newList.indexOf(input.trim());
        out = `indexOf("${input.trim()}") → ${idx}${idx === -1 ? " (non trouvé)" : ""}`;
        success = true;
        break;
      }
      default:
        out = "Opération inconnue";
    }

    setList(newList);
    setLastOutput(out);
    setOutput(o => [...o, { text: out, success }]);
    setInput("");

    if (success && mission.check(newList, list, out)) {
      setScore(s => s + 10);
      if (missionIdx < MISSIONS.length - 1) {
        setTimeout(() => setMissionIdx(m => m + 1), 400);
      } else {
        setCompleted(true);
        const entry = { date: new Date().toLocaleDateString("fr-CH"), score: score + 10, errors };
        const newH = [...history, entry].slice(-20);
        setHistory(newH);
        try { window.storage.set(KEY, JSON.stringify(newH)); } catch {}
      }
    } else if (success) {
      setErrors(e => e + 1);
      setOutput(o => [...o, { text: "→ Ce n'est pas ce que la mission demande. Relisez l'instruction.", success: false }]);
    }
  };

  const javaCode = [
    ...list.map((item, i) => i === 0 ? `ArrayList<String> list = new ArrayList<>();\nlist.add("${item}");` : `list.add("${item}");`),
  ].join("\n") || 'ArrayList<String> list = new ArrayList<>();\n// (liste vide)';

  // MENU
  if (screen === "menu") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s", textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.dimmed, marginBottom: 8 }}>CODEQUEST · MODULE 04</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, marginBottom: 8 }}>Le Terminal CRUD</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>
          Manipulez un ArrayList en temps réel ! Suivez les missions : ajoutez, lisez, modifiez et supprimez des éléments. Voyez le code Java correspondant se construire.
        </div>
        <button onClick={startGame} style={{ padding: "14px 36px", borderRadius: 12, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700 }}>Commencer ({MISSIONS.length} missions)</button>
        {history.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dimmed, marginBottom: 8 }}>HISTORIQUE</div>
            {[...history].reverse().slice(0, 5).map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: C.dimmed }}>{h.date}</span>
                <span style={{ color: C.gold, fontWeight: 700 }}>{h.score} pts</span>
                <span style={{ color: h.errors === 0 ? C.success : C.muted }}>{h.errors} err</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // GAME
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 16 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes pop{0%{transform:scale(0.9)}50%{transform:scale(1.05)}100%{transform:scale(1)}}`}</style>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
          <span style={{ color: C.dimmed }}>Mission {missionIdx + 1}/{MISSIONS.length}</span>
          <span style={{ color: C.gold, fontWeight: 700 }}>Score: {score}</span>
        </div>
        <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
          {MISSIONS.map((_, i) => (<div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < missionIdx ? C.success : i === missionIdx ? C.accent : C.border }} />))}
        </div>

        {/* Mission instruction */}
        <div style={{ background: completed ? C.success + "15" : C.gold + "15", borderRadius: 10, padding: "10px 16px", border: `1px solid ${completed ? C.success : C.gold}40`, marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: completed ? C.success : C.gold }}>
            {completed ? "Toutes les missions terminées !" : mission.instruction}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Left: ArrayList visual */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dimmed, marginBottom: 6 }}>ARRAYLIST ({list.length} éléments)</div>
            <div style={{ background: C.card, borderRadius: 10, padding: 12, border: `1px solid ${C.border}`, minHeight: 180 }}>
              {list.length === 0 ? (
                <div style={{ color: C.dimmed, fontSize: 12, textAlign: "center", padding: 20 }}>[ vide ]</div>
              ) : (
                list.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px", borderRadius: 6, marginBottom: 3, background: C.code, animation: "pop .3s ease-out" }}>
                    <span style={{ color: C.dimmed, fontSize: 11, fontFamily: "monospace", minWidth: 24 }}>[{i}]</span>
                    <span style={{ color: C.accent, fontWeight: 600, fontSize: 13 }}>"{item}"</span>
                  </div>
                ))
              )}
            </div>

            {/* Java code equivalent */}
            <button onClick={() => setShowJava(!showJava)} style={{ marginTop: 8, padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 11, width: "100%" }}>
              {showJava ? "Masquer" : "Voir"} le code Java correspondant
            </button>
            {showJava && (
              <div style={{ background: C.code, borderRadius: 8, padding: 10, marginTop: 4, fontFamily: "monospace", fontSize: 11, color: C.codeText, whiteSpace: "pre-wrap", animation: "fadeIn .2s" }}>
                {javaCode}
              </div>
            )}
          </div>

          {/* Right: Terminal */}
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dimmed, marginBottom: 6 }}>TERMINAL</div>
            <div style={{ background: C.code, borderRadius: 10, padding: 10, border: `1px solid ${C.border}`, minHeight: 180, maxHeight: 200, overflow: "auto" }}>
              {output.length === 0 ? (
                <div style={{ color: C.dimmed, fontSize: 11 }}>Exécutez une opération...</div>
              ) : (
                output.slice(-8).map((o, i) => (
                  <div key={i} style={{ fontSize: 11, fontFamily: "monospace", padding: "2px 0", color: o.success ? C.codeText : C.danger }}>
                    {">"} {o.text}
                  </div>
                ))
              )}
            </div>

            {/* Controls */}
            {!completed && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
                  {[
                    { val: "add", label: "ADD" },
                    { val: "get", label: "GET" },
                    { val: "set", label: "SET" },
                    { val: "remove", label: "REMOVE" },
                    { val: "contains", label: "CONTAINS" },
                    { val: "size", label: "SIZE" },
                    { val: "indexOf", label: "INDEXOF" },
                  ].map(b => (
                    <button key={b.val} onClick={() => setOp(b.val)} style={{
                      padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 700,
                      border: `1px solid ${op === b.val ? C.accent : C.border}`,
                      background: op === b.val ? C.accent + "20" : "transparent",
                      color: op === b.val ? C.accent : C.muted, cursor: "pointer", fontFamily: "monospace",
                    }}>{b.label}</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && execute()}
                    placeholder={op === "size" ? "(pas de paramètre)" : op === "set" ? "index,valeur" : "valeur"}
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`,
                      background: C.card, color: C.text, fontFamily: "monospace", fontSize: 13, outline: "none",
                    }} />
                  <button onClick={execute} style={{
                    padding: "8px 20px", borderRadius: 8, border: "none",
                    background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit",
                    fontSize: 13, fontWeight: 700,
                  }}>Exécuter</button>
                </div>
              </div>
            )}
            {completed && (
              <div style={{ marginTop: 12, textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.gold }}>{score} points</div>
                <button onClick={startGame} style={{ marginTop: 8, padding: "8px 20px", borderRadius: 8, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>Rejouer</button>
                <button onClick={() => setScreen("menu")} style={{ marginTop: 8, marginLeft: 8, padding: "8px 20px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Menu</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
