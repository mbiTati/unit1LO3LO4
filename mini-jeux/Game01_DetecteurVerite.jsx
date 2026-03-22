import { useState, useEffect, useCallback } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", dimmed: "#64748b", border: "#1e293b",
  success: "#10B981", danger: "#EF4444", primary: "#0D7377", secondary: "#14A3C7",
  keyword: "#c792ea", code: "#1E293B",
};

const KEY = "codequest-game-conditions";

function genQuestion(diff) {
  const r = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  if (diff === "easy") {
    const ops = [
      () => { const a = r(1,20), b = r(1,20), op = pick([">","<",">=","<=","==","!="]); return { expr: `${a} ${op} ${b}`, answer: eval(`${a} ${op === "==" ? "===" : op === "!=" ? "!==" : op} ${b}`) }; },
      () => { const a = r(1,50); return { expr: `${a} % 2 == 0`, answer: a % 2 === 0 }; },
      () => { const a = r(-5,20); return { expr: `${a} >= 0`, answer: a >= 0 }; },
    ];
    return pick(ops)();
  }
  if (diff === "medium") {
    const ops = [
      () => { const a = r(1,30), b = r(1,30), c = r(1,30); return { expr: `${a} > ${b} && ${b} > ${c}`, answer: a > b && b > c }; },
      () => { const a = r(1,20), b = r(1,20); return { expr: `${a} > 10 || ${b} < 5`, answer: a > 10 || b < 5 }; },
      () => { const a = r(1,50); return { expr: `!(${a} > 25)`, answer: !(a > 25) }; },
      () => { const a = r(10,30); return { expr: `${a} >= 18 && ${a} <= 25`, answer: a >= 18 && a <= 25 }; },
    ];
    return pick(ops)();
  }
  // hard
  const ops = [
    () => { const a = r(1,30), b = r(1,30), c = r(1,30); return { expr: `(${a} > ${b} || ${c} < 10) && ${a} != ${c}`, answer: (a > b || c < 10) && a !== c }; },
    () => { const a = r(1,20), b = r(1,20), c = r(1,20); return { expr: `!(${a} == ${b}) && (${b} > ${c} || ${a} < 5)`, answer: (a !== b) && (b > c || a < 5) }; },
    () => { const a = r(1,100); return { expr: `${a} >= 90 || (${a} >= 50 && ${a} < 70)`, answer: a >= 90 || (a >= 50 && a < 70) }; },
    () => { const a = pick(["true","false"]), b = pick(["true","false"]), c = pick(["true","false"]); const av = a==="true",bv=b==="true",cv=c==="true"; return { expr: `${a} && (${b} || ${c})`, answer: av && (bv || cv) }; },
  ];
  return pick(ops)();
}

export default function GameConditions() {
  const [screen, setScreen] = useState("menu");
  const [diff, setDiff] = useState("easy");
  const [question, setQuestion] = useState(null);
  const [qNum, setQNum] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [history, setHistory] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const TOTAL = 15;
  const TIMES = { easy: 15, medium: 12, hard: 8 };

  useEffect(() => { (async () => { try { const r = await window.storage.get(KEY); if (r) setHistory(JSON.parse(r.value)); } catch {} })(); }, []);

  useEffect(() => {
    if (screen !== "game" || answered || timeLeft <= 0) return;
    const t = setTimeout(() => {
      if (timeLeft <= 1) { handleAnswer(null); }
      else setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [screen, timeLeft, answered]);

  const startGame = (d) => {
    setDiff(d); setScore(0); setStreak(0); setMaxStreak(0); setMistakes(0);
    setQNum(1); setGameLog([]); setAnswered(false); setLastCorrect(null);
    setQuestion(genQuestion(d)); setTimeLeft(TIMES[d]); setScreen("game");
  };

  const handleAnswer = (userAnswer) => {
    if (answered) return;
    setAnswered(true);
    const correct = userAnswer === question.answer;
    setLastCorrect(correct);
    const pts = correct ? (10 + streak * 3 + (diff === "hard" ? 10 : diff === "medium" ? 5 : 0)) : 0;
    if (correct) { setScore(s => s + pts); setStreak(s => s + 1); setMaxStreak(m => Math.max(m, streak + 1)); }
    else { setMistakes(m => m + 1); setStreak(0); }
    setGameLog(l => [...l, { expr: question.expr, answer: question.answer, user: userAnswer, correct, pts }]);

    setTimeout(() => {
      if (qNum >= TOTAL) {
        const finalScore = score + pts;
        const entry = { date: new Date().toLocaleDateString("fr-CH"), diff, score: finalScore, mistakes: mistakes + (correct ? 0 : 1), maxStreak: Math.max(maxStreak, correct ? streak + 1 : maxStreak) };
        const newH = [...history, entry].slice(-20);
        setHistory(newH);
        try { window.storage.set(KEY, JSON.stringify(newH)); } catch {}
        setScore(finalScore);
        setScreen("result");
      } else {
        setQNum(n => n + 1); setQuestion(genQuestion(diff));
        setTimeLeft(TIMES[diff]); setAnswered(false); setLastCorrect(null);
      }
    }, 1200);
  };

  const LABELS = { easy: "Facile", medium: "Moyen", hard: "Difficile" };

  // MENU
  if (screen === "menu") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s ease-out", textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.dimmed, marginBottom: 8 }}>CODEQUEST · MODULE 01</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, marginBottom: 8 }}>Le Détecteur de Vérité</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 28, lineHeight: 1.6 }}>
          Une expression Java s'affiche. Vous devez déterminer si elle vaut <span style={{ color: C.success, fontWeight: 700 }}>true</span> ou <span style={{ color: C.danger, fontWeight: 700 }}>false</span>. Vite, le temps est compté !
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 28 }}>
          {["easy","medium","hard"].map((d, i) => (
            <button key={d} onClick={() => startGame(d)} style={{
              padding: "14px 24px", borderRadius: 12, border: `1px solid ${C.border}`,
              background: C.card, color: C.text, cursor: "pointer", fontFamily: "inherit",
              fontSize: 14, fontWeight: 600, minWidth: 130, transition: "all .2s",
              animation: `fadeIn .4s ease-out ${i*80}ms both`,
            }}
            onMouseEnter={e => { e.target.style.borderColor = C.accent; }}
            onMouseLeave={e => { e.target.style.borderColor = C.border; }}
            >
              <div>{LABELS[d]}</div>
              <div style={{ fontSize: 11, color: C.dimmed, marginTop: 4 }}>{TIMES[d]}s par question</div>
            </button>
          ))}
        </div>
        {history.length > 0 && (
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dimmed, marginBottom: 8 }}>HISTORIQUE</div>
            {[...history].reverse().slice(0,5).map((h,i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: C.dimmed }}>{h.date}</span>
                <span>{LABELS[h.diff]}</span>
                <span style={{ color: C.gold, fontWeight: 700 }}>{h.score} pts</span>
                <span style={{ color: h.mistakes === 0 ? C.success : C.muted }}>{h.mistakes} err</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // RESULT
  if (screen === "result") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s ease-out", textAlign: "center", maxWidth: 520 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{mistakes === 0 ? "🏆" : mistakes <= 3 ? "🎯" : "💪"}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.gold }}>{score} points</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>{TOTAL - mistakes} / {TOTAL} correct · Max combo x{maxStreak}</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
          <button onClick={() => startGame(diff)} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700 }}>Rejouer</button>
          <button onClick={() => setScreen("menu")} style={{ padding: "10px 22px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}>Menu</button>
        </div>
        <div style={{ marginTop: 20, maxHeight: 200, overflow: "auto", textAlign: "left" }}>
          {gameLog.map((g,i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", padding: "4px 10px", borderRadius: 4, marginBottom: 2, background: g.correct ? C.success + "10" : C.danger + "10", fontSize: 12, fontFamily: "monospace" }}>
              <span style={{ color: g.correct ? C.success : C.danger }}>{g.correct ? "✓" : "✗"}</span>
              <span style={{ color: C.accent, flex: 1 }}>{g.expr}</span>
              <span style={{ color: C.muted }}>= {String(g.answer)}</span>
              {g.correct && <span style={{ color: C.gold }}>+{g.pts}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // GAME
  const pct = (timeLeft / TIMES[diff]) * 100;
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}`}</style>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Top stats */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 12 }}>
          <span style={{ color: C.dimmed }}>Question {qNum}/{TOTAL}</span>
          <span style={{ color: C.gold, fontWeight: 700 }}>Score: {score}</span>
          <span style={{ color: streak >= 3 ? C.accent : C.dimmed }}>Combo x{streak}</span>
        </div>

        {/* Timer bar */}
        <div style={{ height: 6, background: C.border, borderRadius: 3, marginBottom: 24, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct > 30 ? C.accent : pct > 15 ? C.gold : C.danger, borderRadius: 3, transition: "width 1s linear" }} />
        </div>

        {/* Question */}
        <div style={{
          background: C.code, borderRadius: 14, padding: "28px 24px", textAlign: "center",
          border: `1px solid ${answered ? (lastCorrect ? C.success : C.danger) + "60" : C.border}`,
          marginBottom: 24, animation: answered && !lastCorrect ? "shake .3s" : "none",
        }}>
          <div style={{ fontSize: 11, color: C.dimmed, marginBottom: 8, letterSpacing: 2 }}>ÉVALUEZ CETTE EXPRESSION</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.accent, fontFamily: "'JetBrains Mono',monospace" }}>
            {question.expr}
          </div>
          {answered && (
            <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: lastCorrect ? C.success : C.danger, animation: "fadeIn .2s" }}>
              {lastCorrect ? `✓ Correct ! +${gameLog[gameLog.length-1]?.pts || 0} pts` : `✗ La réponse était : ${String(question.answer)}`}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button onClick={() => handleAnswer(true)} disabled={answered} style={{
            flex: 1, maxWidth: 200, padding: "18px 0", borderRadius: 14, border: "none",
            background: answered && question.answer === true ? C.success + "30" : `linear-gradient(135deg, ${C.success}, #059669)`,
            color: "#fff", fontSize: 20, fontWeight: 800, cursor: answered ? "default" : "pointer",
            fontFamily: "inherit", opacity: answered && question.answer !== true ? 0.4 : 1,
            transition: "all .2s",
          }}>TRUE</button>
          <button onClick={() => handleAnswer(false)} disabled={answered} style={{
            flex: 1, maxWidth: 200, padding: "18px 0", borderRadius: 14, border: "none",
            background: answered && question.answer === false ? C.danger + "30" : `linear-gradient(135deg, ${C.danger}, #dc2626)`,
            color: "#fff", fontSize: 20, fontWeight: 800, cursor: answered ? "default" : "pointer",
            fontFamily: "inherit", opacity: answered && question.answer !== false ? 0.4 : 1,
            transition: "all .2s",
          }}>FALSE</button>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 20 }}>
          {Array.from({ length: TOTAL }, (_, i) => {
            const log = gameLog[i];
            return <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: log ? (log.correct ? C.success : C.danger) : i === qNum - 1 ? C.accent : C.border,
              transition: "all .3s",
            }} />;
          })}
        </div>
      </div>
    </div>
  );
}
