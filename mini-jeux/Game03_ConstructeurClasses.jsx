import { useState, useEffect } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", accent: "#32E0C4", gold: "#F59E0B",
  text: "#e2e8f0", muted: "#94a3b8", dimmed: "#64748b", border: "#1e293b",
  success: "#10B981", danger: "#EF4444", primary: "#0D7377", secondary: "#14A3C7",
  code: "#1E293B", codeText: "#32E0C4", keyword: "#c792ea", string: "#c3e88d",
};

const KEY = "codequest-game-oop";

const CHALLENGES = [
  {
    title: "Niveau 1 : Les attributs",
    desc: "Quels attributs faut-il pour une classe Invention ?",
    type: "select_multiple",
    options: [
      { text: "private String nom;", correct: true, why: "Le nom est un texte → String, et il doit être private" },
      { text: "public String nom;", correct: false, why: "Les attributs doivent être private, pas public !" },
      { text: "private int annee;", correct: true, why: "L'année est un nombre entier → int, et private" },
      { text: "String inventeur;", correct: false, why: "Il manque le modificateur d'accès : il faut private" },
      { text: "private String inventeur;", correct: true, why: "Correct : private + type String" },
      { text: "private double nom;", correct: false, why: "Un nom est du texte (String), pas un nombre (double)" },
    ],
    points: 20,
  },
  {
    title: "Niveau 2 : Le constructeur",
    desc: "Quel constructeur est correct pour la classe Invention(nom, annee) ?",
    type: "select_one",
    options: [
      { text: "public Invention(String nom, int annee) {\n    this.nom = nom;\n    this.annee = annee;\n}", correct: true, why: "Parfait : même nom que la classe, this pour chaque attribut" },
      { text: "public void Invention(String nom, int annee) {\n    this.nom = nom;\n    this.annee = annee;\n}", correct: false, why: "Un constructeur n'a PAS de type de retour (pas de void) !" },
      { text: "public Invention(String nom, int annee) {\n    nom = nom;\n    annee = annee;\n}", correct: false, why: "Sans this, le paramètre s'assigne à lui-même ! L'attribut reste null/0" },
      { text: "public Invention() {\n    nom = \"\";\n    annee = 0;\n}", correct: false, why: "Ce constructeur ne prend aucun paramètre, on ne peut pas passer de valeurs" },
    ],
    points: 25,
  },
  {
    title: "Niveau 3 : Getter ou setter ?",
    desc: "Classez chaque méthode : est-ce un getter ou un setter ?",
    type: "classify",
    items: [
      { text: "public String getNom() { return nom; }", category: "Getter", why: "Retourne la valeur → getter" },
      { text: "public void setNom(String nom) { this.nom = nom; }", category: "Setter", why: "Modifie la valeur → setter" },
      { text: "public int getAnnee() { return annee; }", category: "Getter", why: "Retourne la valeur → getter" },
      { text: "public void setAnnee(int a) { if(a>0) annee=a; }", category: "Setter", why: "Modifie avec validation → setter" },
    ],
    points: 30,
  },
  {
    title: "Niveau 4 : Trouver les bugs",
    desc: "Ce code a des erreurs. Trouvez-les toutes !",
    type: "find_bugs",
    code: `public class Invention {
    public String nom;
    private int annee;
    
    public void Invention(String nom, int annee) {
        nom = nom;
        this.annee = annee;
    }
    
    public String getNom() {
        return nom;
    }
    
    public void setAnnee(int annee) {
        annee = annee;
    }
}`,
    bugs: [
      { line: 2, text: "Ligne 2 : 'public String nom' → devrait être private", fix: "private String nom;" },
      { line: 5, text: "Ligne 5 : 'public void Invention' → un constructeur n'a PAS de void", fix: "public Invention(String nom, int annee)" },
      { line: 6, text: "Ligne 6 : 'nom = nom' → manque this.nom = nom", fix: "this.nom = nom;" },
      { line: 15, text: "Ligne 15 : 'annee = annee' → manque this.annee = annee", fix: "this.annee = annee;" },
    ],
    points: 40,
  },
  {
    title: "Niveau 5 : Assembler la classe complète",
    desc: "Remettez ces blocs dans le bon ordre pour construire une classe Java valide.",
    type: "order",
    blocks: [
      { id: "attr", text: "private String nom;\nprivate int annee;", order: 0 },
      { id: "const", text: "public Invention(String nom, int annee) {\n    this.nom = nom;\n    this.annee = annee;\n}", order: 1 },
      { id: "get1", text: "public String getNom() {\n    return this.nom;\n}", order: 2 },
      { id: "get2", text: "public int getAnnee() {\n    return this.annee;\n}", order: 3 },
      { id: "set", text: "public void setNom(String nom) {\n    if (nom != null && !nom.isEmpty())\n        this.nom = nom;\n}", order: 4 },
      { id: "method", text: "public void afficher() {\n    System.out.println(nom + \" (\" + annee + \")\");\n}", order: 5 },
    ],
    points: 50,
  },
];

function CodeDisplay({ code, bugs = [], foundBugs = [] }) {
  const lines = code.split("\n");
  return (
    <div style={{ background: C.code, borderRadius: 10, overflow: "hidden", fontFamily: "'JetBrains Mono',monospace", fontSize: 13, margin: "10px 0" }}>
      <div style={{ padding: "10px 0" }}>
        {lines.map((line, i) => {
          const bugIdx = bugs.findIndex(b => b.line === i + 1);
          const isFound = bugIdx >= 0 && foundBugs.includes(bugIdx);
          const isBug = bugIdx >= 0;
          return (
            <div key={i} style={{
              display: "flex", padding: "2px 0", cursor: isBug && !isFound ? "pointer" : "default",
              background: isFound ? C.success + "15" : isBug ? C.danger + "08" : "transparent",
              borderLeft: isFound ? `3px solid ${C.success}` : "3px solid transparent",
            }}>
              <span style={{ width: 36, textAlign: "right", paddingRight: 10, color: C.dimmed, userSelect: "none", flexShrink: 0, fontSize: 11 }}>{i + 1}</span>
              <span style={{ color: C.codeText, whiteSpace: "pre" }}>{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Game03OOPBuilder() {
  const [screen, setScreen] = useState("menu");
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selections, setSelections] = useState([]);
  const [foundBugs, setFoundBugs] = useState([]);
  const [blockOrder, setBlockOrder] = useState([]);
  const [classifications, setClassifications] = useState({});
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => { (async () => { try { const r = await window.storage.get(KEY); if (r) setHistory(JSON.parse(r.value)); } catch {} })(); }, []);

  const ch = CHALLENGES[level];

  const reset = () => {
    setAnswered(false); setSelections([]); setFoundBugs([]); setFeedback("");
    setClassifications({});
    if (ch?.type === "order") {
      const shuffled = [...ch.blocks].sort(() => Math.random() - 0.5);
      setBlockOrder(shuffled.map(b => b.id));
    }
  };

  useEffect(() => { if (screen === "game") reset(); }, [level, screen]);

  const startGame = () => { setLevel(0); setScore(0); setScreen("game"); };

  const toggleSelection = (idx) => {
    if (answered) return;
    setSelections(s => s.includes(idx) ? s.filter(i => i !== idx) : [...s, idx]);
  };

  const checkAnswer = () => {
    setAnswered(true);
    const ch = CHALLENGES[level];
    if (ch.type === "select_multiple") {
      const correctIdxs = ch.options.map((o, i) => o.correct ? i : -1).filter(i => i >= 0);
      const allCorrect = correctIdxs.every(i => selections.includes(i)) && selections.every(i => ch.options[i].correct);
      const pts = allCorrect ? ch.points : Math.floor(ch.points * 0.5 * (selections.filter(i => ch.options[i].correct).length / correctIdxs.length));
      setScore(s => s + pts);
      setFeedback(allCorrect ? `Parfait ! +${ch.points} pts` : `Partiellement correct. +${pts} pts`);
    } else if (ch.type === "select_one") {
      const correct = selections[0] !== undefined && ch.options[selections[0]].correct;
      const pts = correct ? ch.points : 0;
      setScore(s => s + pts);
      setFeedback(correct ? `Correct ! +${pts} pts` : "Incorrect !");
    } else if (ch.type === "classify") {
      const allCorrect = ch.items.every((item, i) => classifications[i] === item.category);
      const correctCount = ch.items.filter((item, i) => classifications[i] === item.category).length;
      const pts = allCorrect ? ch.points : Math.floor(ch.points * correctCount / ch.items.length);
      setScore(s => s + pts);
      setFeedback(allCorrect ? `Parfait ! +${ch.points} pts` : `${correctCount}/${ch.items.length} correct. +${pts} pts`);
    } else if (ch.type === "find_bugs") {
      const pts = Math.floor(ch.points * foundBugs.length / ch.bugs.length);
      setScore(s => s + pts);
      setFeedback(`${foundBugs.length}/${ch.bugs.length} bugs trouvés. +${pts} pts`);
    } else if (ch.type === "order") {
      const correct = blockOrder.every((id, i) => ch.blocks.find(b => b.id === id).order === i);
      const pts = correct ? ch.points : 0;
      setScore(s => s + pts);
      setFeedback(correct ? `Ordre parfait ! +${pts} pts` : "L'ordre n'est pas correct.");
    }
  };

  const nextLevel = () => {
    if (level < CHALLENGES.length - 1) { setLevel(l => l + 1); }
    else {
      const entry = { date: new Date().toLocaleDateString("fr-CH"), score };
      const newH = [...history, entry].slice(-20);
      setHistory(newH);
      try { window.storage.set(KEY, JSON.stringify(newH)); } catch {}
      setScreen("result");
    }
  };

  const moveBlock = (fromIdx, dir) => {
    const toIdx = fromIdx + dir;
    if (toIdx < 0 || toIdx >= blockOrder.length) return;
    const newOrder = [...blockOrder];
    [newOrder[fromIdx], newOrder[toIdx]] = [newOrder[toIdx], newOrder[fromIdx]];
    setBlockOrder(newOrder);
  };

  // MENU
  if (screen === "menu") return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ animation: "fadeIn .4s", textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, color: C.dimmed, marginBottom: 8 }}>CODEQUEST · MODULE 03</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent, marginBottom: 8 }}>Le Constructeur de Classes</div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 24, lineHeight: 1.6 }}>
          5 niveaux pour maîtriser la POO : choisir les bons attributs, écrire un constructeur correct, distinguer getter/setter, trouver des bugs, et assembler une classe complète.
        </div>
        <button onClick={startGame} style={{ padding: "14px 36px", borderRadius: 12, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700 }}>Commencer</button>
        {history.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.dimmed, marginBottom: 8 }}>HISTORIQUE</div>
            {[...history].reverse().slice(0, 5).map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", borderRadius: 6, background: C.card, border: `1px solid ${C.border}`, fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: C.dimmed }}>{h.date}</span>
                <span style={{ color: C.gold, fontWeight: 700 }}>{h.score} / 165 pts</span>
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
      <div style={{ animation: "fadeIn .4s", textAlign: "center" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{score >= 140 ? "🏆" : score >= 100 ? "🎯" : "💪"}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.gold }}>{score} / 165 points</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 8 }}>
          {score >= 140 ? "Excellent ! Tu maîtrises la POO !" : score >= 100 ? "Bien ! Quelques points à revoir." : "Continue à pratiquer, tu progresses !"}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
          <button onClick={startGame} style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700 }}>Rejouer</button>
          <button onClick={() => setScreen("menu")} style={{ padding: "10px 22px", borderRadius: 10, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, cursor: "pointer", fontFamily: "inherit" }}>Menu</button>
        </div>
      </div>
    </div>
  );

  // GAME
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif", padding: 20 }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 12 }}>
          <span style={{ color: C.dimmed }}>Niveau {level + 1}/{CHALLENGES.length}</span>
          <span style={{ color: C.gold, fontWeight: 700 }}>Score: {score}</span>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {CHALLENGES.map((_, i) => (<div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < level ? C.success : i === level ? C.accent : C.border }} />))}
        </div>

        <div style={{ animation: "fadeIn .3s" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{ch.title}</h2>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>{ch.desc}</p>

          {/* SELECT MULTIPLE */}
          {ch.type === "select_multiple" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ch.options.map((opt, i) => {
                const isSel = selections.includes(i);
                let bg = isSel ? C.accent + "20" : C.card;
                let bc = isSel ? C.accent : C.border;
                if (answered) {
                  bg = opt.correct ? C.success + "20" : (isSel ? C.danger + "20" : C.card);
                  bc = opt.correct ? C.success : (isSel ? C.danger : C.border);
                }
                return (
                  <button key={i} onClick={() => toggleSelection(i)} style={{
                    padding: "10px 14px", borderRadius: 8, border: `1px solid ${bc}`,
                    background: bg, color: C.text, cursor: answered ? "default" : "pointer",
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 12, textAlign: "left",
                    transition: "all .2s",
                  }}>
                    <div>{opt.text}</div>
                    {answered && <div style={{ fontSize: 11, color: opt.correct ? C.success : C.danger, marginTop: 4 }}>{opt.why}</div>}
                  </button>
                );
              })}
            </div>
          )}

          {/* SELECT ONE */}
          {ch.type === "select_one" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ch.options.map((opt, i) => {
                const isSel = selections.includes(i);
                let bg = isSel ? C.accent + "20" : C.card;
                let bc = isSel ? C.accent : C.border;
                if (answered) {
                  bg = opt.correct ? C.success + "20" : (isSel ? C.danger + "20" : C.card);
                  bc = opt.correct ? C.success : (isSel ? C.danger : C.border);
                }
                return (
                  <button key={i} onClick={() => { if (!answered) setSelections([i]); }} style={{
                    padding: "10px 14px", borderRadius: 8, border: `1px solid ${bc}`,
                    background: bg, color: C.codeText, cursor: answered ? "default" : "pointer",
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 12, textAlign: "left",
                    whiteSpace: "pre-wrap",
                  }}>
                    {opt.text}
                    {answered && <div style={{ fontSize: 11, color: opt.correct ? C.success : C.danger, marginTop: 6, fontFamily: "'Segoe UI',sans-serif" }}>{opt.why}</div>}
                  </button>
                );
              })}
            </div>
          )}

          {/* CLASSIFY */}
          {ch.type === "classify" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ch.items.map((item, i) => {
                const cats = ["Getter", "Setter"];
                const userCat = classifications[i];
                const isCorrect = userCat === item.category;
                return (
                  <div key={i} style={{ background: C.card, borderRadius: 8, padding: 12, border: `1px solid ${answered ? (isCorrect ? C.success : C.danger) + "40" : C.border}` }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: C.codeText, marginBottom: 8 }}>{item.text}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {cats.map(cat => (
                        <button key={cat} onClick={() => { if (!answered) setClassifications(c => ({ ...c, [i]: cat })); }} style={{
                          padding: "6px 16px", borderRadius: 6, border: `1px solid ${userCat === cat ? C.accent : C.border}`,
                          background: userCat === cat ? C.accent + "20" : "transparent",
                          color: userCat === cat ? C.accent : C.muted, cursor: answered ? "default" : "pointer",
                          fontFamily: "inherit", fontSize: 12, fontWeight: 600,
                        }}>{cat}</button>
                      ))}
                    </div>
                    {answered && <div style={{ fontSize: 11, color: isCorrect ? C.success : C.danger, marginTop: 6 }}>{item.why}</div>}
                  </div>
                );
              })}
            </div>
          )}

          {/* FIND BUGS */}
          {ch.type === "find_bugs" && (
            <>
              <p style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Cliquez sur les lignes qui contiennent un bug ({foundBugs.length}/{ch.bugs.length} trouvés)</p>
              <div style={{ background: C.code, borderRadius: 10, overflow: "hidden", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>
                <div style={{ padding: "10px 0" }}>
                  {ch.code.split("\n").map((line, i) => {
                    const bugIdx = ch.bugs.findIndex(b => b.line === i + 1);
                    const isFound = bugIdx >= 0 && foundBugs.includes(bugIdx);
                    return (
                      <div key={i} onClick={() => {
                        if (answered) return;
                        if (bugIdx >= 0 && !foundBugs.includes(bugIdx)) setFoundBugs(f => [...f, bugIdx]);
                      }} style={{
                        display: "flex", padding: "2px 0", cursor: answered ? "default" : "pointer",
                        background: isFound ? C.success + "15" : "transparent",
                        borderLeft: isFound ? `3px solid ${C.success}` : "3px solid transparent",
                      }}>
                        <span style={{ width: 36, textAlign: "right", paddingRight: 10, color: C.dimmed, userSelect: "none", flexShrink: 0, fontSize: 11 }}>{i + 1}</span>
                        <span style={{ color: C.codeText, whiteSpace: "pre" }}>{line}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {answered && ch.bugs.map((bug, i) => (
                <div key={i} style={{ fontSize: 12, padding: "6px 10px", borderRadius: 6, margin: "4px 0", background: foundBugs.includes(i) ? C.success + "10" : C.danger + "10", color: foundBugs.includes(i) ? C.success : C.danger }}>
                  {foundBugs.includes(i) ? "✓" : "✗"} {bug.text} → <span style={{ color: C.accent }}>{bug.fix}</span>
                </div>
              ))}
            </>
          )}

          {/* ORDER */}
          {ch.type === "order" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {blockOrder.map((id, idx) => {
                const block = ch.blocks.find(b => b.id === id);
                const isCorrectPos = answered && block.order === idx;
                return (
                  <div key={id} style={{
                    display: "flex", gap: 8, alignItems: "center", padding: "8px 12px",
                    borderRadius: 8, background: answered ? (isCorrectPos ? C.success + "15" : C.danger + "15") : C.card,
                    border: `1px solid ${answered ? (isCorrectPos ? C.success : C.danger) + "40" : C.border}`,
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <button onClick={() => moveBlock(idx, -1)} disabled={answered || idx === 0} style={{ background: "none", border: "none", color: C.muted, cursor: answered ? "default" : "pointer", fontSize: 14, padding: 0 }}>▲</button>
                      <button onClick={() => moveBlock(idx, 1)} disabled={answered || idx === blockOrder.length - 1} style={{ background: "none", border: "none", color: C.muted, cursor: answered ? "default" : "pointer", fontSize: 14, padding: 0 }}>▼</button>
                    </div>
                    <span style={{ fontSize: 12, color: C.dimmed, fontWeight: 700, minWidth: 20 }}>{idx + 1}.</span>
                    <pre style={{ margin: 0, fontSize: 11, color: C.codeText, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "pre-wrap", flex: 1 }}>{block.text}</pre>
                  </div>
                );
              })}
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: feedback.includes("Parfait") || feedback.includes("Correct") || feedback.includes("parfait") ? C.success + "15" : C.gold + "15", color: feedback.includes("Parfait") || feedback.includes("Correct") || feedback.includes("parfait") ? C.success : C.gold, fontWeight: 600, fontSize: 14, textAlign: "center", animation: "fadeIn .3s" }}>
              {feedback}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
            {!answered && (
              <button onClick={checkAnswer} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700 }}>Valider</button>
            )}
            {answered && (
              <button onClick={nextLevel} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: C.accent, color: C.bg, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 700 }}>
                {level < CHALLENGES.length - 1 ? "Niveau suivant →" : "Voir le score"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
