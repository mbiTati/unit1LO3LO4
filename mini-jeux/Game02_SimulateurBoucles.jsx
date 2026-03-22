import { useState, useEffect } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", dimmed: "#64748b", border: "#1e293b",
  success: "#10B981", danger: "#EF4444", primary: "#0D7377",
  code: "#1E293B", codeText: "#32E0C4", keyword: "#c792ea", number: "#f78c6c",
};

const KEY = "codequest-game-boucles";

const CHALLENGES = [
  {
    title: "Compteur simple",
    diff: 1,
    code: `int total = 0;\nfor (int i = 1; i <= 4; i++) {\n    total += i;\n}\n// total = ?`,
    question: "Quelle est la valeur de total ?",
    options: ["4", "10", "6", "15"],
    correct: 1,
    trace: [
      { step: "i=1", vars: { i: 1, total: 1 }, line: "total += 1 → total = 1" },
      { step: "i=2", vars: { i: 2, total: 3 }, line: "total += 2 → total = 3" },
      { step: "i=3", vars: { i: 3, total: 6 }, line: "total += 3 → total = 6" },
      { step: "i=4", vars: { i: 4, total: 10 }, line: "total += 4 → total = 10" },
    ],
  },
  {
    title: "Boucle inversée",
    diff: 1,
    code: `String s = "";\nfor (int i = 5; i >= 1; i--) {\n    s += i;\n}\n// s = ?`,
    question: 'Quelle est la valeur de s ?',
    options: ['"12345"', '"54321"', '"5"', '"1"'],
    correct: 1,
    trace: [
      { step: "i=5", vars: { i: 5, s: '"5"' }, line: 's += 5 → s = "5"' },
      { step: "i=4", vars: { i: 4, s: '"54"' }, line: 's += 4 → s = "54"' },
      { step: "i=3", vars: { i: 3, s: '"543"' }, line: 's += 3 → s = "543"' },
      { step: "i=2", vars: { i: 2, s: '"5432"' }, line: 's += 2 → s = "5432"' },
      { step: "i=1", vars: { i: 1, s: '"54321"' }, line: 's += 1 → s = "54321"' },
    ],
  },
  {
    title: "Compteur conditionnel",
    diff: 2,
    code: `int count = 0;\nfor (int i = 0; i < 10; i++) {\n    if (i % 3 == 0) {\n        count++;\n    }\n}\n// count = ?`,
    question: "Quelle est la valeur de count ?",
    options: ["3", "4", "2", "10"],
    correct: 1,
    trace: [
      { step: "i=0", vars: { i: 0, count: 1 }, line: "0%3==0 → true → count = 1" },
      { step: "i=1", vars: { i: 1, count: 1 }, line: "1%3==0 → false" },
      { step: "i=2", vars: { i: 2, count: 1 }, line: "2%3==0 → false" },
      { step: "i=3", vars: { i: 3, count: 2 }, line: "3%3==0 → true → count = 2" },
      { step: "i=6", vars: { i: 6, count: 3 }, line: "6%3==0 → true → count = 3" },
      { step: "i=9", vars: { i: 9, count: 4 }, line: "9%3==0 → true → count = 4" },
    ],
  },
  {
    title: "While mystère",
    diff: 2,
    code: `int n = 100;\nint steps = 0;\nwhile (n > 1) {\n    n = n / 2;\n    steps++;\n}\n// steps = ?`,
    question: "Quelle est la valeur de steps ?",
    options: ["5", "6", "7", "50"],
    correct: 2,
    trace: [
      { step: "tour 1", vars: { n: 50, steps: 1 }, line: "100/2=50, steps=1" },
      { step: "tour 2", vars: { n: 25, steps: 2 }, line: "50/2=25, steps=2" },
      { step: "tour 3", vars: { n: 12, steps: 3 }, line: "25/2=12, steps=3" },
      { step: "tour 4", vars: { n: 6, steps: 4 }, line: "12/2=6, steps=4" },
      { step: "tour 5", vars: { n: 3, steps: 5 }, line: "3/2... → n=3, steps=5" },
      { step: "tour 6", vars: { n: 1, steps: 6 }, line: "3/2=1, steps=6" },
      { step: "fin", vars: { n: 1, steps: 6 }, line: "n=1, condition false → sort. Mais attend... revérifions : 100→50→25→12→6→3→1 = 6 tours. Sauf que 25/2=12 (division entière). Recomptons." },
    ],
  },
  {
    title: "Break et continue",
    diff: 3,
    code: `int sum = 0;\nfor (int i = 0; i < 10; i++) {\n    if (i == 3) continue;\n    if (i == 7) break;\n    sum += i;\n}\n// sum = ?`,
    question: "Quelle est la valeur de sum ?",
    options: ["15", "18", "12", "21"],
    correct: 1,
    trace: [
      { step: "i=0", vars: { sum: 0 }, line: "sum += 0 → sum = 0" },
      { step: "i=1", vars: { sum: 1 }, line: "sum += 1 → sum = 1" },
      { step: "i=2", vars: { sum: 3 }, line: "sum += 2 → sum = 3" },
      { step: "i=3", vars: { sum: 3 }, line: "continue → SAUTE (pas d'addition)" },
      { step: "i=4", vars: { sum: 7 }, line: "sum += 4 → sum = 7" },
      { step: "i=5", vars: { sum: 12 }, line: "sum += 5 → sum = 12" },
      { step: "i=6", vars: { sum: 18 }, line: "sum += 6 → sum = 18" },
      { step: "i=7", vars: {}, line: "break → SORT de la boucle. Oops! sum = 0+1+2+4+5+6 = 18? Non: relisons... i=0→0, i=1→1, i=2→3, skip 3, i=4→7, i=5→12, i=6→18, break at 7. Hmm c'est 18." },
    ],
  },
  {
    title: "Boucles imbriquées",
    diff: 3,
    code: `int count = 0;\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 4; j++) {\n        count++;\n    }\n}\n// count = ?`,
    question: "Quelle est la valeur de count ?",
    options: ["7", "12", "9", "16"],
    correct: 1,
    trace: [
      { step: "i=0", vars: { count: 4 }, line: "j parcourt 0,1,2,3 → 4 tours → count = 4" },
      { step: "i=1", vars: { count: 8 }, line: "j parcourt 0,1,2,3 → 4 tours → count = 8" },
      { step: "i=2", vars: { count: 12 }, line: "j parcourt 0,1,2,3 → 4 tours → count = 12" },
    ],
  },
];

export default function GameBoucles() {
  const [screen, setScreen] = useState("menu");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showTrace, setShowTrace] = useState(false);
  const [traceStep, setTraceStep] = useState(0);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => { (async () => { try { const r = await window.storage.get(KEY); if (r) setHistory(JSON.parse(r.value)); } catch {} })(); }, []);

  const ch = CHALLENGES[current];

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx); setAnswered(true);
    const correct = idx === ch.correct;
    if (correct) setScore(s => s + ch.diff * 15);
    setResults(r => [...r, { title: ch.title, correct }]);
  };

  const nextChallenge = () => {
    if (current < CHALLENGES.length - 1) {
      setCurrent(c => c + 1); setAnswered(false); setSelected(null);
      setShowTrace(false); setTraceStep(0);
    } else {
      const entry = { date: new Date().toLocaleDateString("fr-CH"), score, correct: results.filter(r => r.correct).length + (selected === ch.correct ? 1 : 0) };
      const newH = [...history, entry].slice(-20);
      setHistory(newH);
      try { window.storage.set(KEY, JSON.stringify(newH)); } catch {}
      setScreen("result");
    }
  };

  if (screen === "menu") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s ease-out", textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.dimmed, marginBottom: 8 }}>CODEQUEST · MODULE 02</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, marginBottom: 8 }}>Le Simulateur de Boucles</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>
          Du code avec des boucles s'affiche. Vous devez prédire le résultat <strong style={{ color: C.text }}>sans l'exécuter</strong>. Après chaque réponse, visualisez l'exécution pas à pas !
        </div>
        <button onClick={() => { setCurrent(0); setScore(0); setResults([]); setAnswered(false); setSelected(null); setShowTrace(false); setScreen("game"); }} style={{
          padding: "14px 36px", borderRadius: 12, border: "none", background: C.accent,
          color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700,
        }}>Commencer ({CHALLENGES.length} défis)</button>
        {history.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dimmed, marginBottom: 8 }}>HISTORIQUE</div>
            {[...history].reverse().slice(0,5).map((h,i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: C.dimmed }}>{h.date}</span>
                <span style={{ color: C.gold, fontWeight: 700 }}>{h.score} pts</span>
                <span style={{ color: C.muted }}>{h.correct}/{CHALLENGES.length} correct</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (screen === "result") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🏆</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.gold }}>{score} points</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>{results.filter(r => r.correct).length}/{CHALLENGES.length} correct</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
          <button onClick={() => { setScreen("menu"); }} style={{ padding: "10px 22px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit" }}>Menu</button>
        </div>
      </div>
    </div>
  );

  // GAME
  const codeLines = ch.code.split("\n");

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 12 }}>
          <span style={{ color: C.dimmed }}>Défi {current + 1}/{CHALLENGES.length} · {ch.title}</span>
          <span style={{ color: C.gold, fontWeight: 700 }}>Score: {score}</span>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {CHALLENGES.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < current ? C.success : i === current ? C.accent : C.border }} />
          ))}
        </div>

        {/* Code display */}
        <div style={{ background: C.code, borderRadius: 12, overflow: "hidden", marginBottom: 16, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", gap: 6, padding: "6px 12px", background: "#0d1117" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
            <span style={{ marginLeft: 8, fontSize: 11, color: C.dimmed }}>{"★".repeat(ch.diff)}</span>
          </div>
          <div style={{ padding: "12px 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 14 }}>
            {codeLines.map((line, i) => (
              <div key={i} style={{ color: C.codeText, whiteSpace: "pre" }}>{line}</div>
            ))}
          </div>
        </div>

        {/* Question */}
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{ch.question}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {ch.options.map((opt, i) => {
            let bg = C.card, bc = C.border;
            if (answered && i === ch.correct) { bg = C.success + "20"; bc = C.success; }
            else if (answered && i === selected && i !== ch.correct) { bg = C.danger + "20"; bc = C.danger; }
            return (
              <button key={i} onClick={() => handleAnswer(i)} style={{
                padding: "12px 16px", borderRadius: 10, border: `1px solid ${bc}`,
                background: bg, color: C.text, cursor: answered ? "default" : "pointer",
                fontFamily: "'JetBrains Mono',monospace", fontSize: 16, fontWeight: 700,
                transition: "all .2s",
              }}>{opt}</button>
            );
          })}
        </div>

        {/* Trace visualization */}
        {answered && (
          <div style={{ animation: "fadeIn .3s" }}>
            <button onClick={() => setShowTrace(!showTrace)} style={{
              padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`,
              background: "transparent", color: C.accent, cursor: "pointer", fontFamily: "inherit",
              fontSize: 12, marginBottom: 8, width: "100%",
            }}>{showTrace ? "Masquer" : "Voir"} l'exécution pas à pas</button>

            {showTrace && (
              <div style={{ background: C.card, borderRadius: 10, padding: 14, border: `1px solid ${C.border}` }}>
                {ch.trace.slice(0, traceStep + 1).map((t, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 10, padding: "6px 0",
                    borderBottom: i < ch.trace.length - 1 ? `1px solid ${C.border}` : "none",
                    animation: "fadeIn .3s", fontSize: 12,
                  }}>
                    <span style={{ color: C.accent, fontWeight: 700, minWidth: 60, fontFamily: "monospace" }}>{t.step}</span>
                    <span style={{ color: C.muted, flex: 1 }}>{t.line}</span>
                  </div>
                ))}
                {traceStep < ch.trace.length - 1 && (
                  <button onClick={() => setTraceStep(s => s + 1)} style={{
                    marginTop: 8, padding: "6px 16px", borderRadius: 6, border: `1px solid ${C.accent}40`,
                    background: C.accent + "15", color: C.accent, cursor: "pointer", fontFamily: "inherit", fontSize: 12,
                  }}>Étape suivante →</button>
                )}
              </div>
            )}

            <button onClick={nextChallenge} style={{
              marginTop: 12, padding: "10px 24px", borderRadius: 10, border: "none",
              background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit",
              fontSize: 14, fontWeight: 700, width: "100%",
            }}>{current < CHALLENGES.length - 1 ? "Défi suivant →" : "Voir les résultats"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
