import { useState, useEffect, useCallback } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", primary: "#0D7377", secondary: "#14A3C7",
  accent: "#32E0C4", gold: "#F59E0B", text: "#e2e8f0", muted: "#94a3b8",
  dimmed: "#64748b", border: "#1e293b", success: "#10B981", danger: "#EF4444",
  code: "#1E293B", codeBorder: "#2d3a4f", codeText: "#32E0C4", comment: "#6b7f99",
  keyword: "#c792ea", string: "#c3e88d", number: "#f78c6c", type: "#ffcb6b",
};

const KEY = "codequest-m02-boucles";
async function load() { try { const r = await window.storage.get(KEY); return r ? JSON.parse(r.value) : null; } catch { return null; } }
async function save(d) { try { await window.storage.set(KEY, JSON.stringify(d)); } catch {} }

function Code({ code, hl = [] }) {
  const lines = code.split("\n");
  return (
    <div style={{ background: C.code, border: `1px solid ${C.codeBorder}`, borderRadius: 10, overflow: "hidden", fontSize: 13, fontFamily: "'JetBrains Mono',monospace", margin: "10px 0" }}>
      <div style={{ display: "flex", gap: 6, padding: "6px 12px", background: "#0d1117", borderBottom: `1px solid ${C.codeBorder}` }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
      </div>
      <div style={{ padding: "10px 0", overflowX: "auto" }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: "flex", padding: "1px 0", background: hl.includes(i) ? C.accent + "12" : "transparent", borderLeft: hl.includes(i) ? `3px solid ${C.accent}` : "3px solid transparent" }}>
            <span style={{ width: 36, textAlign: "right", paddingRight: 10, color: C.dimmed, userSelect: "none", flexShrink: 0, fontSize: 11 }}>{i + 1}</span>
            <span style={{ color: C.codeText, whiteSpace: "pre" }}>{colorize(line)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function colorize(l) {
  return l.replace(/(\/\/.*)/, `\x01C$1\x02`).replace(/\b(public|static|void|class|int|String|double|boolean|if|else|switch|case|break|default|return|new|final|for|while|do|true|false|private|protected|import)\b/g, `\x01K$&\x02`).replace(/("(?:[^"\\]|\\.)*")/g, `\x01S$1\x02`).replace(/\b(\d+)\b/g, `\x01N$1\x02`).replace(/\b(System|Scanner|Math)\b/g, `\x01T$1\x02`).split(/(\x01\w.*?\x02)/).map((p, i) => {
    if (p.startsWith("\x01C")) return <span key={i} style={{ color: C.comment, fontStyle: "italic" }}>{p.slice(2, -1)}</span>;
    if (p.startsWith("\x01K")) return <span key={i} style={{ color: C.keyword }}>{p.slice(2, -1)}</span>;
    if (p.startsWith("\x01S")) return <span key={i} style={{ color: C.string }}>{p.slice(2, -1)}</span>;
    if (p.startsWith("\x01N")) return <span key={i} style={{ color: C.number }}>{p.slice(2, -1)}</span>;
    if (p.startsWith("\x01T")) return <span key={i} style={{ color: C.type }}>{p.slice(2, -1)}</span>;
    return <span key={i}>{p}</span>;
  });
}
function Quiz({ q, opts, correct, onAns, done }) {
  const [sel, setSel] = useState(null);
  const click = (i) => { if (done) return; setSel(i); onAns(i === correct); };
  return (
    <div style={{ margin: "14px 0" }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 8 }}>{q}</div>
      {opts.map((o, i) => {
        let bg = C.card, bc = C.border;
        if (done && i === correct) { bg = C.success + "20"; bc = C.success; }
        else if (done && sel === i) { bg = C.danger + "20"; bc = C.danger; }
        return (<button key={i} onClick={() => click(i)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", marginBottom: 4, borderRadius: 8, border: `1px solid ${bc}`, background: bg, color: C.text, cursor: done ? "default" : "pointer", fontFamily: "inherit", fontSize: 13 }}>{String.fromCharCode(65+i)}. {o}</button>);
      })}
    </div>
  );
}
function Task({ title, children }) {
  return (<div style={{ background: C.primary + "15", borderRadius: 10, padding: 14, border: `1px solid ${C.primary}40`, margin: "12px 0" }}><div style={{ fontSize: 13, fontWeight: 600, color: C.accent, marginBottom: 6 }}>{title}</div><div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{children}</div></div>);
}
function Tip({ title, children, color = C.gold }) {
  return (<div style={{ background: color + "15", borderRadius: 8, padding: 12, border: `1px solid ${color}40`, margin: "10px 0" }}><div style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 4 }}>{title}</div><div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{children}</div></div>);
}

const MODULES = [
  { id: "for", title: "La boucle for", icon: "🔄", steps: [
    { title: "Comprendre la boucle for", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>Une <strong style={{ color: C.text }}>boucle</strong> répète un bloc de code plusieurs fois. La boucle <code style={{ color: C.keyword }}>for</code> est utilisée quand on <strong style={{ color: C.accent }}>sait combien de fois</strong> on veut répéter.</p>
      <Code hl={[1,2,3]} code={`// Structure : for (début; condition; incrément)
for (int i = 0; i < 5; i++) {
    System.out.println("Tour numéro " + i);
}
// Affiche : Tour numéro 0, 1, 2, 3, 4`} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "12px 0" }}>
        <div style={{ background: C.card, borderRadius: 8, padding: 10, border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: 700, color: C.accent, fontSize: 12 }}>int i = 0</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Initialisation : on commence à 0</div>
        </div>
        <div style={{ background: C.card, borderRadius: 8, padding: 10, border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: 700, color: C.gold, fontSize: 12 }}>{"i < 5"}</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Condition : tant que i {"<"} 5</div>
        </div>
        <div style={{ background: C.card, borderRadius: 8, padding: 10, border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: 700, color: C.secondary, fontSize: 12 }}>i++</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Incrément : i augmente de 1</div>
        </div>
      </div>
      <Task title="À taper dans Eclipse">
        1. Créez une classe <code style={{ color: C.accent }}>TestBoucles</code><br/>
        2. Écrivez une boucle for qui affiche les nombres de 1 à 10<br/>
        3. Modifiez pour afficher de 10 à 1 (indice : <code style={{ color: C.accent }}>i--</code>)<br/>
        4. Modifiez pour afficher seulement les nombres pairs (indice : <code style={{ color: C.accent }}>i += 2</code>)
      </Task>
      <Quiz q="Combien de fois s'exécute : for(int i=0; i<3; i++) ?" opts={["2 fois", "3 fois", "4 fois", "Boucle infinie"]} correct={1} onAns={onQ} done={done} />
    </>)},
    { title: "for et les tableaux", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>La boucle <code style={{ color: C.keyword }}>for</code> est parfaite pour parcourir un <strong style={{ color: C.text }}>tableau (array)</strong>.</p>
      <Code hl={[1,4,5,9,10]} code={`// Déclarer un tableau
String[] inventions = {"Téléphone", "Ampoule", "Internet", "GPS"};

// Parcourir avec for classique
for (int i = 0; i < inventions.length; i++) {
    System.out.println((i+1) + ". " + inventions[i]);
}

// Parcourir avec for-each (plus simple)
for (String inv : inventions) {
    System.out.println("- " + inv);
}`} />
      <Tip title="for classique vs for-each">
        <strong>for classique</strong> : quand vous avez besoin de l'index (i)<br/>
        <strong>for-each</strong> : quand vous voulez juste chaque élément, sans l'index
      </Tip>
      <Code hl={[3,4,5,6]} code={`// Calculer la somme d'un tableau
int[] notes = {85, 72, 90, 68, 95};
int somme = 0;

for (int note : notes) {
    somme += note;  // somme = somme + note
}

double moyenne = (double) somme / notes.length;
System.out.println("Moyenne : " + moyenne);`} />
      <Task title="À taper dans Eclipse">
        1. Créez un tableau de 5 prénoms<br/>
        2. Affichez-les avec un for classique (numérotés 1, 2, 3...)<br/>
        3. Affichez-les avec un for-each<br/>
        4. Comptez combien de prénoms ont plus de 5 lettres (utilisez <code style={{ color: C.accent }}>.length()</code> sur le String)
      </Task>
      <Quiz q="Quelle est la différence entre .length et .length() ?" opts={["C'est la même chose", ".length pour les tableaux, .length() pour les String", ".length() pour les tableaux, .length pour les String", "Aucune des deux n'existe"]} correct={1} onAns={onQ} done={done} />
    </>)},
  ]},
  { id: "while", title: "Les boucles while et do-while", icon: "🔁", steps: [
    { title: "La boucle while", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}><code style={{ color: C.keyword }}>while</code> répète <strong style={{ color: C.text }}>tant que</strong> la condition est vraie. On l'utilise quand on <strong style={{ color: C.accent }}>ne sait pas à l'avance</strong> combien de fois répéter.</p>
      <Code hl={[3,4,5,6]} code={`// Exemple : diviser par 2 jusqu'à atteindre 1
int nombre = 64;

while (nombre > 1) {
    System.out.println(nombre);
    nombre = nombre / 2;  // ou nombre /= 2
}
System.out.println(nombre);
// Affiche : 64, 32, 16, 8, 4, 2, 1`} />
      <Tip title="Piège : la boucle infinie !" color={C.danger}>
        Si la condition ne devient JAMAIS false, le programme tourne à l'infini !<br/>
        <code style={{ color: C.danger }}>while (true) {"{ ... }"}</code> → infini sauf si <code style={{ color: C.accent }}>break;</code> à l'intérieur<br/>
        Toujours vérifier que quelque chose change dans la boucle pour que la condition finisse par être false.
      </Tip>
      <Code hl={[5,6,7,8,9,10,11]} code={`import java.util.Scanner;
// Exemple pratique : demander un mot de passe
Scanner sc = new Scanner(System.in);
String motDePasse = "";

while (!motDePasse.equals("codequest")) {
    System.out.print("Mot de passe : ");
    motDePasse = sc.next();
    
    if (!motDePasse.equals("codequest")) {
        System.out.println("Incorrect, réessayez !");
    }
}
System.out.println("Accès autorisé !");`} />
      <Task title="À taper dans Eclipse">
        1. Écrivez un programme qui demande un nombre à l'utilisateur<br/>
        2. Tant que le nombre n'est pas entre 1 et 100, redemandez<br/>
        3. Quand c'est bon, affichez "Nombre accepté : " + le nombre<br/>
        4. Comptez combien de tentatives il a fallu
      </Task>
      <Quiz q="Quelle boucle utiliser quand on ne sait pas combien de fois répéter ?" opts={["for", "while", "switch", "if"]} correct={1} onAns={onQ} done={done} />
    </>)},
    { title: "do-while et break/continue", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}><code style={{ color: C.keyword }}>do-while</code> est comme while, mais le bloc s'exécute <strong style={{ color: C.accent }}>au moins une fois</strong> (la condition est vérifiée APRÈS).</p>
      <Code hl={[2,3,4,5]} code={`// Menu qui s'affiche au moins une fois
int choix;
do {
    System.out.println("1. Jouer  2. Scores  3. Quitter");
    System.out.print("Choix : ");
    choix = sc.nextInt();
} while (choix != 3);  // Continue tant que pas 3
System.out.println("Au revoir !");`} />
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginTop: 12 }}><code style={{ color: C.keyword }}>break</code> sort immédiatement de la boucle. <code style={{ color: C.keyword }}>continue</code> saute au tour suivant.</p>
      <Code hl={[3,4,7,8]} code={`for (int i = 0; i < 10; i++) {
    
    // Sauter le numéro 5
    if (i == 5) continue;  // passe directement à i=6
    
    // Arrêter à 8
    if (i == 8) break;     // sort de la boucle
    
    System.out.println(i);
}
// Affiche : 0, 1, 2, 3, 4, 6, 7`} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, margin: "12px 0" }}>
        <div style={{ background: C.card, borderRadius: 8, padding: 10, border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: 700, color: C.accent, fontSize: 12 }}>while</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Vérifie AVANT. Peut ne jamais s'exécuter.</div>
        </div>
        <div style={{ background: C.card, borderRadius: 8, padding: 10, border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: 700, color: C.gold, fontSize: 12 }}>do-while</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Vérifie APRÈS. S'exécute au moins 1 fois.</div>
        </div>
        <div style={{ background: C.card, borderRadius: 8, padding: 10, border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: 700, color: C.secondary, fontSize: 12 }}>for</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Quand on connaît le nombre de tours.</div>
        </div>
      </div>
      <Quiz q="Quelle est la différence entre while et do-while ?" opts={["Aucune", "do-while s'exécute au moins 1 fois", "while est plus rapide", "do-while ne peut pas avoir de break"]} correct={1} onAns={onQ} done={done} />
    </>)},
  ]},
  { id: "exercice", title: "Exercice : Le Labo de Stats", icon: "💻", steps: [
    { title: "Énoncé", content: (onQ, done) => (<>
      <div style={{ background: C.gold + "15", borderRadius: 12, padding: 16, border: `1px solid ${C.gold}40` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.gold, marginBottom: 6 }}>Exercice — 50 Crédits R&D</div>
        <div style={{ color: C.text, fontSize: 14, lineHeight: 1.6 }}>Créez un programme qui analyse les résultats d'expériences du Labo. L'utilisateur entre des notes une par une, et le programme calcule des statistiques.</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.accent, marginTop: 14, marginBottom: 8 }}>Cahier des charges :</div>
      <div style={{ color: C.text, fontSize: 13, lineHeight: 1.8 }}>
        1. L'utilisateur entre des notes (0-100) en boucle <strong>(while)</strong><br/>
        2. Il tape <strong>-1</strong> pour arrêter la saisie<br/>
        3. Les notes invalides ({"<"}0 ou {">"}100, sauf -1) sont refusées avec un message<br/>
        4. À la fin, afficher :<br/>
        &nbsp;&nbsp;— Nombre de notes entrées<br/>
        &nbsp;&nbsp;— Note la plus haute et la plus basse<br/>
        &nbsp;&nbsp;— Moyenne<br/>
        &nbsp;&nbsp;— Nombre de Distinction (≥90), Merit (≥70), Pass (≥50), Refer ({"<"}50)<br/>
        5. <strong>Bonus</strong> : stocker les notes dans un tableau et les afficher triées
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
        {["while", "if/else", "for", "arrays", "min/max", "moyenne", "compteurs"].map(c => (
          <span key={c} style={{ padding: "4px 10px", borderRadius: 20, background: C.primary + "20", color: C.accent, fontSize: 11 }}>{c}</span>
        ))}
      </div>
      <Code code={`// Squelette — à compléter !
import java.util.Scanner;

public class LaboStats {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        int compteur = 0;
        int somme = 0;
        int max = 0;       // Note la plus haute
        int min = 100;     // Note la plus basse
        int nbDistinction = 0, nbMerit = 0, nbPass = 0, nbRefer = 0;
        
        System.out.println("=== LABO DE STATISTIQUES ===");
        System.out.println("Entrez des notes (0-100), -1 pour terminer");
        
        // TODO : boucle while qui lit les notes
        // while (...) {
        //     lire la note
        //     vérifier si valide
        //     mettre à jour compteur, somme, max, min
        //     compter les grades avec if/else
        // }
        
        // TODO : afficher les résultats
        // Attention : vérifier que compteur > 0 avant la moyenne !
        
        sc.close();
    }
}`} />
      <Quiz q="Pourquoi initialiser min à 100 et max à 0 ?" opts={["C'est obligatoire en Java", "Pour que la première vraie note remplace toujours ces valeurs initiales", "C'est une convention", "Pour éviter les erreurs de compilation"]} correct={1} onAns={onQ} done={done} />
    </>)},
    { title: "Correction complète", content: (onQ, done) => (<>
      <div style={{ background: C.success + "12", borderRadius: 10, padding: 12, border: `1px solid ${C.success}40`, marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.success }}>Correction — Pour l'enseignant</div>
      </div>
      <Code hl={[16,17,18,19,20,21,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,42,43,44,45,46,47,48,49,50]} code={`import java.util.Scanner;

public class LaboStats_CORRECTION {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        int compteur = 0;
        int somme = 0;
        int max = 0;
        int min = 100;
        int nbDistinction = 0, nbMerit = 0, nbPass = 0, nbRefer = 0;
        
        System.out.println("=== LABO DE STATISTIQUES ===");
        System.out.println("Entrez des notes (0-100), -1 pour terminer\\n");
        
        int note = 0;
        while (note != -1) {
            System.out.print("Note : ");
            note = sc.nextInt();
            
            // -1 = fin de saisie
            if (note == -1) break;
            
            // Validation
            if (note < 0 || note > 100) {
                System.out.println("  → Note invalide ! (0-100 uniquement)");
                continue;  // Retour au début de la boucle
            }
            
            // Mise à jour des stats
            compteur++;
            somme += note;
            if (note > max) max = note;
            if (note < min) min = note;
            
            // Comptage des grades
            if (note >= 90) nbDistinction++;
            else if (note >= 70) nbMerit++;
            else if (note >= 50) nbPass++;
            else nbRefer++;
        }
        
        // Affichage des résultats
        System.out.println("\\n=== RÉSULTATS ===");
        if (compteur == 0) {
            System.out.println("Aucune note entrée.");
        } else {
            double moyenne = (double) somme / compteur;
            System.out.println("Nombre de notes : " + compteur);
            System.out.println("Note max        : " + max);
            System.out.println("Note min        : " + min);
            System.out.println("Moyenne         : " + moyenne);
            System.out.println("\\nRépartition :");
            System.out.println("  Distinction (90+) : " + nbDistinction);
            System.out.println("  Merit (70-89)     : " + nbMerit);
            System.out.println("  Pass (50-69)      : " + nbPass);
            System.out.println("  Refer (0-49)      : " + nbRefer);
        }
        
        sc.close();
    }
}`} />
      <Tip title="Points clés de la correction">
        <strong>continue</strong> (ligne 28) : saute les notes invalides sans planter<br/>
        <strong>break</strong> (ligne 22) : sort proprement quand -1 est entré<br/>
        <strong>(double)</strong> (ligne 48) : cast obligatoire sinon division entière !<br/>
        <strong>compteur == 0</strong> (ligne 45) : évite la division par zéro
      </Tip>
      <Quiz q="Que fait 'continue' dans une boucle while ?" opts={["Sort de la boucle", "Retourne au début de la boucle (tour suivant)", "Arrête le programme", "Continue l'exécution normale"]} correct={1} onAns={onQ} done={done} />
    </>)},
  ]},
];

export default function Module02Boucles() {
  const [mod, setMod] = useState(0);
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [credits, setCredits] = useState(0);
  const [ready, setReady] = useState(false);

  const allSteps = MODULES.reduce((a, m) => a + m.steps.length, 0);
  const doneCount = Object.keys(completed).length;
  const key = `${mod}-${step}`;
  const isDone = !!completed[key];

  useEffect(() => { load().then(d => { if (d) { setCompleted(d.completed||{}); setScore(d.score||0); setTotal(d.total||0); setCredits(d.credits||0); if(d.mod!==undefined)setMod(d.mod); if(d.step!==undefined)setStep(d.step); } setReady(true); }); }, []);
  const persist = useCallback((c,s,t,cr,m,st) => { save({completed:c,score:s,total:t,credits:cr,mod:m,step:st}); }, []);
  const handleQuiz = (ok) => { const nT=total+1,nS=score+(ok?1:0),nCr=credits+(ok?5:0),nC={...completed,[key]:true}; setTotal(nT);setScore(nS);setCredits(nCr);setCompleted(nC); persist(nC,nS,nT,nCr,mod,step); };
  const goNext = () => { const m=MODULES[mod]; if(step<m.steps.length-1){setStep(step+1);persist(completed,score,total,credits,mod,step+1);}else if(mod<MODULES.length-1){setMod(mod+1);setStep(0);persist(completed,score,total,credits,mod+1,0);} };
  const goPrev = () => { if(step>0){setStep(step-1);persist(completed,score,total,credits,mod,step-1);}else if(mod>0){const p=MODULES[mod-1];setMod(mod-1);setStep(p.steps.length-1);persist(completed,score,total,credits,mod-1,p.steps.length-1);} };

  if (!ready) return <div style={{ minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted }}>Chargement...</div>;
  const isFirst=mod===0&&step===0, isLast=mod===MODULES.length-1&&step===MODULES[MODULES.length-1].steps.length-1;
  const curMod=MODULES[mod], curStep=curMod.steps[step];

  return (
    <div style={{ minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ padding:"10px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:6 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontSize:11,letterSpacing:2,color:C.dimmed }}>CODEQUEST</span>
          <span style={{ color:C.border }}>|</span>
          <span style={{ fontSize:13,fontWeight:600,color:C.accent }}>Module 02 : Boucles</span>
        </div>
        <div style={{ display:"flex",gap:12,fontSize:12 }}>
          <span style={{ color:C.muted }}>Quiz: <strong style={{ color:C.success }}>{score}/{total}</strong></span>
          <span style={{ color:C.muted }}>CR: <strong style={{ color:C.gold }}>{credits}</strong></span>
        </div>
      </div>
      <div style={{ display:"flex",maxWidth:1100,margin:"0 auto",minHeight:"calc(100vh - 46px)" }}>
        <div style={{ width:220,borderRight:`1px solid ${C.border}`,padding:"12px 0",flexShrink:0,overflowY:"auto" }}>
          {MODULES.map((m,mi) => (<div key={m.id}>
            <div style={{ padding:"6px 14px",fontSize:10,letterSpacing:1,color:C.dimmed,fontWeight:600 }}>{m.icon} {m.title.toUpperCase()}</div>
            {m.steps.map((s,si) => { const k=`${mi}-${si}`,cur=mi===mod&&si===step,dn=!!completed[k]; return (<button key={k} onClick={()=>{setMod(mi);setStep(si);}} style={{ display:"flex",alignItems:"center",gap:6,width:"100%",padding:"6px 14px 6px 24px",border:"none",background:cur?C.accent+"15":"transparent",borderLeft:cur?`3px solid ${C.accent}`:"3px solid transparent",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:cur?C.accent:dn?C.success:C.muted,textAlign:"left" }}><span style={{ fontSize:9 }}>{dn?"✓":"○"}</span>{s.title}</button>); })}
          </div>))}
          <div style={{ padding:14,marginTop:"auto" }}>
            <div style={{ height:4,background:C.border,borderRadius:2,overflow:"hidden" }}><div style={{ width:`${(doneCount/allSteps)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.primary},${C.accent})`,borderRadius:2,transition:"width .5s" }}/></div>
          </div>
        </div>
        <div style={{ flex:1,padding:"20px 28px",overflowY:"auto",maxHeight:"calc(100vh - 46px)" }}>
          <div key={key} style={{ animation:"fadeIn .3s ease-out" }}>
            <div style={{ fontSize:11,color:C.dimmed,letterSpacing:1,marginBottom:4 }}>{curMod.icon} {curMod.title}</div>
            <h2 style={{ fontSize:20,fontWeight:700,marginBottom:16 }}>{curStep.title}</h2>
            {curStep.content(handleQuiz, isDone)}
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:28,paddingTop:14,borderTop:`1px solid ${C.border}` }}>
              <button onClick={goPrev} disabled={isFirst} style={{ padding:"8px 18px",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:isFirst?C.border:C.muted,cursor:isFirst?"default":"pointer",fontFamily:"inherit",fontSize:13 }}>← Précédent</button>
              <button onClick={goNext} disabled={isLast} style={{ padding:"8px 18px",borderRadius:8,border:"none",background:isLast?C.border:C.accent,color:isLast?C.muted:C.bg,cursor:isLast?"default":"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600 }}>{isLast?"Terminé !":"Suivant →"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
