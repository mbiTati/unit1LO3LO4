import { useState, useEffect, useCallback } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", primary: "#0D7377", secondary: "#14A3C7",
  accent: "#32E0C4", gold: "#F59E0B", text: "#e2e8f0", muted: "#94a3b8",
  dimmed: "#64748b", border: "#1e293b", success: "#10B981", danger: "#EF4444",
  code: "#1E293B", codeBorder: "#2d3a4f", codeText: "#32E0C4", comment: "#6b7f99",
  keyword: "#c792ea", string: "#c3e88d", type: "#ffcb6b", number: "#f78c6c",
};

const KEY = "codequest-m01-conditions";
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
  return l.replace(/(\/\/.*)/, `\x01C$1\x02`).replace(/\b(public|static|void|class|int|String|double|boolean|if|else|switch|case|break|default|return|new|final|for|while|true|false|private|protected)\b/g, `\x01K$&\x02`).replace(/("(?:[^"\\]|\\.)*")/g, `\x01S$1\x02`).replace(/\b(\d+)\b/g, `\x01N$1\x02`).replace(/\b(System|Scanner|Math)\b/g, `\x01T$1\x02`).split(/(\x01\w.*?\x02)/).map((p, i) => {
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
        return (
          <button key={i} onClick={() => click(i)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", marginBottom: 4, borderRadius: 8, border: `1px solid ${bc}`, background: bg, color: C.text, cursor: done ? "default" : "pointer", fontFamily: "inherit", fontSize: 13, transition: "all .2s" }}>{String.fromCharCode(65 + i)}. {o}</button>
        );
      })}
    </div>
  );
}

function Task({ title, children }) {
  return (
    <div style={{ background: C.primary + "15", borderRadius: 10, padding: 14, border: `1px solid ${C.primary}40`, margin: "12px 0" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.accent, marginBottom: 6 }}>{title}</div>
      <div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function Tip({ title, children, color = C.gold }) {
  return (
    <div style={{ background: color + "15", borderRadius: 8, padding: 12, border: `1px solid ${color}40`, margin: "10px 0" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color, marginBottom: 4 }}>{title}</div>
      <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
const MODULES = [
  {
    id: "comprendre", title: "Comprendre les conditions", icon: "🧠",
    steps: [
      {
        title: "C'est quoi une condition ?",
        content: (onQ, done) => (<>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>Une <strong style={{ color: C.text }}>condition</strong> permet au programme de <strong style={{ color: C.accent }}>prendre une décision</strong>. C'est comme dans la vie : "S'il pleut, je prends un parapluie. Sinon, je prends mes lunettes de soleil."</p>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>En Java, une condition est une expression qui vaut <code style={{ color: C.keyword }}>true</code> ou <code style={{ color: C.keyword }}>false</code>. C'est un <strong style={{ color: C.text }}>boolean</strong>.</p>
          <Code hl={[2, 3, 5, 6]} code={`// Une condition retourne true ou false
int age = 20;
boolean estMajeur = (age >= 18);  // true
System.out.println(estMajeur);    // true

boolean estMineur = (age < 18);   // false
System.out.println(estMineur);    // false`} />
          <Tip title="Les opérateurs de comparaison">
            <code style={{ color: C.accent }}>{`==`}</code> égal &nbsp;|&nbsp;
            <code style={{ color: C.accent }}>{`!=`}</code> différent &nbsp;|&nbsp;
            <code style={{ color: C.accent }}>{`>`}</code> plus grand &nbsp;|&nbsp;
            <code style={{ color: C.accent }}>{`<`}</code> plus petit &nbsp;|&nbsp;
            <code style={{ color: C.accent }}>{`>=`}</code> plus grand ou égal &nbsp;|&nbsp;
            <code style={{ color: C.accent }}>{`<=`}</code> plus petit ou égal
          </Tip>
          <Quiz q="Que vaut (10 > 5) ?" opts={["10", "5", "true", "false"]} correct={2} onAns={onQ} done={done} />
        </>),
      },
      {
        title: "if / else",
        content: (onQ, done) => (<>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}><code style={{ color: C.keyword }}>if</code> exécute un bloc de code <strong style={{ color: C.text }}>uniquement si</strong> la condition est vraie. <code style={{ color: C.keyword }}>else</code> s'exécute si la condition est fausse.</p>
          <Code hl={[3, 4, 5, 6]} code={`int temperature = 35;

if (temperature > 30) {
    System.out.println("Il fait chaud !");
} else {
    System.out.println("Température normale.");
}
// Affiche : Il fait chaud !`} />
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>On peut enchaîner avec <code style={{ color: C.keyword }}>else if</code> :</p>
          <Code hl={[2, 4, 6]} code={`int note = 75;

if (note >= 90) {
    System.out.println("Excellent !");
} else if (note >= 70) {
    System.out.println("Bien !");      // ← celui-ci !
} else if (note >= 50) {
    System.out.println("Passable.");
} else {
    System.out.println("Échec.");
}`} />
          <Task title="À taper dans Eclipse">
            1. Créez une classe <code style={{ color: C.accent }}>TestConditions</code><br />
            2. Déclarez <code style={{ color: C.accent }}>int note = 85;</code><br />
            3. Écrivez le if/else if/else ci-dessus<br />
            4. <strong>Changez la note</strong> (40, 55, 72, 95) et observez ce qui s'affiche<br />
            5. <strong>Question :</strong> que se passe-t-il si note = 90 exactement ?
          </Task>
          <Quiz q='Si note = 50, quel message s\'affiche ?' opts={["Excellent !", "Bien !", "Passable.", "Échec."]} correct={2} onAns={onQ} done={done} />
        </>),
      },
      {
        title: "Opérateurs logiques : && et ||",
        content: (onQ, done) => (<>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>Parfois une seule condition ne suffit pas. On combine avec :</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "12px 0" }}>
            <div style={{ background: C.card, borderRadius: 8, padding: 12, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, color: C.accent, fontSize: 14 }}>&& (ET / AND)</div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Les DEUX conditions doivent être vraies</div>
              <div style={{ color: C.text, fontSize: 12, marginTop: 4 }}>true && true = true<br />true && false = false</div>
            </div>
            <div style={{ background: C.card, borderRadius: 8, padding: 12, border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 700, color: C.gold, fontSize: 14 }}>|| (OU / OR)</div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>AU MOINS UNE condition doit être vraie</div>
              <div style={{ color: C.text, fontSize: 12, marginTop: 4 }}>true || false = true<br />false || false = false</div>
            </div>
          </div>
          <Code hl={[4, 8]} code={`int age = 20;
boolean aPermis = true;

// ET : les deux doivent être vrais
if (age >= 18 && aPermis) {
    System.out.println("Peut conduire !");
}

// OU : au moins un doit être vrai
if (age < 12 || age > 65) {
    System.out.println("Tarif réduit");
}`} />
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>Et il y a aussi <code style={{ color: C.keyword }}>!</code> (NOT) qui inverse :</p>
          <Code code={`boolean estFerme = false;
if (!estFerme) {  // si PAS fermé = si ouvert
    System.out.println("Le labo est ouvert !");
}`} />
          <Task title="À taper dans Eclipse">
            1. Déclarez <code style={{ color: C.accent }}>int age = 25;</code> et <code style={{ color: C.accent }}>boolean estEtudiant = true;</code><br />
            2. Écrivez un if qui affiche "Réduction" si age {"<"} 26 ET estEtudiant est true<br />
            3. Testez avec age = 30 → que se passe-t-il ?<br />
            4. Testez avec estEtudiant = false → que se passe-t-il ?
          </Task>
          <Quiz q="Que vaut (true && false) ?" opts={["true", "false", "null", "erreur"]} correct={1} onAns={onQ} done={done} />
        </>),
      },
      {
        title: "switch / case",
        content: (onQ, done) => (<>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}><code style={{ color: C.keyword }}>switch</code> est une alternative propre au <code style={{ color: C.keyword }}>if/else if/else if...</code> quand on compare <strong style={{ color: C.text }}>une variable à plusieurs valeurs fixes</strong>.</p>
          <Code hl={[2, 3, 4, 6, 7, 11, 12]} code={`int jour = 3;

switch (jour) {
    case 1:
        System.out.println("Lundi");
        break;        // IMPORTANT : sans break, ça continue !
    case 2:
        System.out.println("Mardi");
        break;
    case 3:
        System.out.println("Mercredi");  // ← celui-ci !
        break;
    case 4:
        System.out.println("Jeudi");
        break;
    case 5:
        System.out.println("Vendredi");
        break;
    default:
        System.out.println("Weekend");
}`} />
          <Tip title="Piège classique : le break oublié !" color={C.danger}>
            Sans <code style={{ color: C.accent }}>break</code>, le programme continue dans le case suivant !<br />
            Essayez d'enlever le break du case 3 et observez ce qui se passe.
          </Tip>
          <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>Switch fonctionne aussi avec des <code style={{ color: C.keyword }}>String</code> :</p>
          <Code code={`String commande = "café";

switch (commande) {
    case "café":
        System.out.println("2.50 CHF");
        break;
    case "thé":
        System.out.println("2.00 CHF");
        break;
    default:
        System.out.println("Commande inconnue");
}`} />
          <Task title="À taper dans Eclipse">
            1. Créez un programme qui demande un numéro de mois (1-12)<br />
            2. Utilisez switch pour afficher le nom du mois<br />
            3. <strong>Enlevez un break</strong> et observez le bug<br />
            4. Remettez le break et ajoutez un default pour les valeurs invalides
          </Task>
          <Quiz q="Que se passe-t-il si on oublie le break dans un case ?" opts={["Erreur de compilation", "Le programme s'arrête", "Il exécute aussi le case suivant (fall-through)", "Rien, c'est optionnel"]} correct={2} onAns={onQ} done={done} />
        </>),
      },
    ],
  },
  {
    id: "exercice", title: "Exercice guidé : Le Distributeur", icon: "💻",
    steps: [
      {
        title: "Énoncé : Distributeur de boissons",
        content: (onQ, done) => (<>
          <div style={{ background: C.gold + "15", borderRadius: 12, padding: 16, border: `1px solid ${C.gold}40`, margin: "8px 0" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.gold, marginBottom: 6 }}>Exercice — 50 Crédits R&D</div>
            <div style={{ color: C.text, fontSize: 14, lineHeight: 1.6 }}>Créez un programme Java qui simule un distributeur de boissons. L'utilisateur choisit une boisson et le programme calcule le prix, applique des réductions, et affiche le résultat.</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.accent, marginTop: 14, marginBottom: 8 }}>Cahier des charges :</div>
          <div style={{ color: C.text, fontSize: 13, lineHeight: 1.8 }}>
            1. L'utilisateur entre un <strong>numéro de boisson</strong> (1=Café 2.50, 2=Thé 2.00, 3=Chocolat 3.00, 4=Jus 3.50)<br />
            2. L'utilisateur entre son <strong>âge</strong><br />
            3. <strong>Réduction</strong> : -20% si âge {"<"} 18 OU âge {">="} 65<br />
            4. <strong>Supplément</strong> : +0.50 si la boisson est un chocolat ET l'âge {">"} 12 (crème chantilly auto)<br />
            5. Afficher : nom boisson, prix de base, réduction, supplément, <strong>prix final</strong><br />
            6. Si numéro invalide → "Boisson inconnue"
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.dimmed, marginTop: 14, marginBottom: 8 }}>Concepts utilisés :</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["switch/case", "if/else", "&& (ET)", "|| (OU)", "variables", "Scanner", "double", "String"].map(c => (
              <span key={c} style={{ padding: "4px 10px", borderRadius: 20, background: C.primary + "20", color: C.accent, fontSize: 11 }}>{c}</span>
            ))}
          </div>
          <Code code={`// Squelette de départ — à compléter !
import java.util.Scanner;

public class Distributeur {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // 1. Afficher le menu
        System.out.println("=== DISTRIBUTEUR ===");
        System.out.println("1. Café    (2.50)");
        System.out.println("2. Thé     (2.00)");
        System.out.println("3. Chocolat(3.00)");
        System.out.println("4. Jus     (3.50)");
        
        // 2. Lire le choix
        System.out.print("Votre choix : ");
        int choix = sc.nextInt();
        
        // 3. Déterminer le nom et le prix avec switch
        String nom = "";
        double prix = 0;
        
        // TODO : switch(choix) { case 1: ... }
        
        // 4. Lire l'âge
        System.out.print("Votre âge : ");
        int age = sc.nextInt();
        
        // 5. Calculer la réduction avec if et ||
        // TODO : if (age < 18 || age >= 65) ...
        
        // 6. Calculer le supplément avec if et &&
        // TODO : if (choix == 3 && age > 12) ...
        
        // 7. Afficher le résumé
        // TODO : println avec concaténation
        
        sc.close();
    }
}`} />
          <Quiz q="Quel opérateur utiliser pour 'si âge < 18 OU âge >= 65' ?" opts={["&&", "||", "==", "!="]} correct={1} onAns={onQ} done={done} />
        </>),
      },
      {
        title: "Correction complète",
        content: (onQ, done) => (<>
          <div style={{ background: C.success + "12", borderRadius: 10, padding: 12, border: `1px solid ${C.success}40`, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.success }}>Correction — Pour l'enseignant</div>
          </div>
          <Code hl={[22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 37, 38, 39, 40, 43, 44, 45, 46]} code={`import java.util.Scanner;

public class Distributeur {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.println("=== DISTRIBUTEUR ===");
        System.out.println("1. Café    (2.50)");
        System.out.println("2. Thé     (2.00)");
        System.out.println("3. Chocolat(3.00)");
        System.out.println("4. Jus     (3.50)");
        
        System.out.print("Votre choix : ");
        int choix = sc.nextInt();
        
        String nom = "";
        double prix = 0;
        double reduction = 0;
        double supplement = 0;
        
        // SWITCH pour déterminer la boisson
        switch (choix) {
            case 1:
                nom = "Café";
                prix = 2.50;
                break;
            case 2:
                nom = "Thé";
                prix = 2.00;
                break;
            case 3:
                nom = "Chocolat";
                prix = 3.00;
                break;
            case 4:
                nom = "Jus d'orange";
                prix = 3.50;
                break;
            default:
                System.out.println("Boisson inconnue !");
                sc.close();
                return;  // Quitter le programme
        }
        
        System.out.print("Votre âge : ");
        int age = sc.nextInt();
        
        // IF avec || pour la réduction
        if (age < 18 || age >= 65) {
            reduction = prix * 0.20;  // 20% de réduction
        }
        
        // IF avec && pour le supplément
        if (choix == 3 && age > 12) {
            supplement = 0.50;  // Crème chantilly
        }
        
        double prixFinal = prix - reduction + supplement;
        
        // Affichage
        System.out.println("\\n=== TICKET ===");
        System.out.println("Boisson   : " + nom);
        System.out.println("Prix base : " + prix + " CHF");
        if (reduction > 0) {
            System.out.println("Réduction : -" + reduction + " CHF");
        }
        if (supplement > 0) {
            System.out.println("Supplément: +" + supplement + " CHF");
        }
        System.out.println("TOTAL     : " + prixFinal + " CHF");
        
        sc.close();
    }
}`} />
          <div style={{ background: C.card, borderRadius: 10, padding: 14, border: `1px solid ${C.border}`, margin: "12px 0" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.accent, marginBottom: 8 }}>Points de vérification</div>
            <div style={{ color: C.text, fontSize: 13, lineHeight: 1.8 }}>
              ✓ switch/case avec break pour chaque boisson<br />
              ✓ default pour les choix invalides<br />
              ✓ || (OU) pour la réduction : âge {"<"} 18 OU âge {">="} 65<br />
              ✓ && (ET) pour le supplément : chocolat ET âge {">"} 12<br />
              ✓ Calcul correct du prix final<br />
              ✓ Affichage clair du ticket
            </div>
          </div>
          <Tip title="Cas de test à vérifier">
            Choix 1, âge 15 → Café 2.50 - 0.50 = 2.00 CHF<br />
            Choix 3, âge 25 → Chocolat 3.00 + 0.50 = 3.50 CHF<br />
            Choix 3, âge 10 → Chocolat 3.00 - 0.60 + 0 = 2.40 CHF (pas de chantilly, réduction jeune)<br />
            Choix 5 → "Boisson inconnue !"
          </Tip>
          <Quiz q="Dans la correction, pourquoi y a-t-il 'return;' dans le default ?" opts={["C'est obligatoire en Java", "Pour quitter le programme si le choix est invalide", "Pour retourner une valeur", "C'est un commentaire"]} correct={1} onAns={onQ} done={done} />
        </>),
      },
    ],
  },
  {
    id: "defi", title: "Défi bonus : Le Labo d'Analyse", icon: "🏆",
    steps: [
      {
        title: "Défi : Analyseur de notes",
        content: (onQ, done) => (<>
          <div style={{ background: C.gold + "15", borderRadius: 12, padding: 16, border: `1px solid ${C.gold}40` }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.gold, marginBottom: 6 }}>Défi Bonus — 30 Crédits R&D supplémentaires</div>
          </div>
          <div style={{ color: C.text, fontSize: 13, lineHeight: 1.8, marginTop: 12 }}>
            Créez une classe <code style={{ color: C.accent }}>AnalyseurNotes</code> qui :<br /><br />
            1. Demande une <strong>note sur 100</strong> à l'utilisateur<br />
            2. Affiche le <strong>grade BTEC</strong> avec switch ou if/else :<br />
            &nbsp;&nbsp;&nbsp;&nbsp;90-100 = Distinction, 70-89 = Merit, 50-69 = Pass, 0-49 = Refer<br />
            3. Vérifie que la note est <strong>valide</strong> (entre 0 et 100), sinon message d'erreur<br />
            4. Si grade = Distinction ET note == 100 → afficher "PARFAIT !"<br />
            5. Si grade = Refer OU note {"<"} 30 → afficher "Attention, rattrapage nécessaire"<br /><br />
            <strong>Contrainte :</strong> utiliser au moins un switch, un if/else, un && et un ||
          </div>
          <Quiz q="Pour vérifier que note est entre 0 et 100, quelle condition ?" opts={["note >= 0 || note <= 100", "note >= 0 && note <= 100", "note > 0 && note < 100", "note == 0 || note == 100"]} correct={1} onAns={onQ} done={done} />
        </>),
      },
      {
        title: "Correction du défi",
        content: (onQ, done) => (<>
          <div style={{ background: C.success + "12", borderRadius: 10, padding: 12, border: `1px solid ${C.success}40`, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.success }}>Correction du défi</div>
          </div>
          <Code hl={[12, 13, 14, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 33, 37]} code={`import java.util.Scanner;

public class AnalyseurNotes {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Entrez votre note (0-100) : ");
        int note = sc.nextInt();
        
        // Validation avec && 
        if (note < 0 || note > 100) {
            System.out.println("Erreur : note invalide !");
            sc.close();
            return;
        }
        
        // Grade avec if/else if
        String grade;
        if (note >= 90) {
            grade = "Distinction";
        } else if (note >= 70) {
            grade = "Merit";
        } else if (note >= 50) {
            grade = "Pass";
        } else {
            grade = "Refer";
        }
        
        System.out.println("Note  : " + note + "/100");
        System.out.println("Grade : " + grade);
        
        // Condition avec &&
        if (grade.equals("Distinction") && note == 100) {
            System.out.println("PARFAIT !");
        }
        
        // Condition avec ||
        if (grade.equals("Refer") || note < 30) {
            System.out.println("Attention, rattrapage nécessaire");
        }
        
        sc.close();
    }
}`} />
          <Tip title="Point important" color={C.danger}>
            Pour comparer des String en Java, on utilise <code style={{ color: C.accent }}>.equals()</code> et PAS <code style={{ color: C.danger }}>==</code> !<br />
            <code style={{ color: C.success }}>grade.equals("Distinction")</code> et non <code style={{ color: C.danger }}>grade == "Distinction"</code>
          </Tip>
          <Quiz q='Pourquoi utiliser .equals() et pas == pour comparer des String ?' opts={["C'est la même chose", "== compare les références mémoire, .equals() compare le contenu", "equals() est plus rapide", "== ne marche pas en Java"]} correct={1} onAns={onQ} done={done} />
        </>),
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
export default function Module01Conditions() {
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

  useEffect(() => { load().then(d => { if (d) { setCompleted(d.completed || {}); setScore(d.score || 0); setTotal(d.total || 0); setCredits(d.credits || 0); if (d.mod !== undefined) setMod(d.mod); if (d.step !== undefined) setStep(d.step); } setReady(true); }); }, []);

  const persist = useCallback((c, s, t, cr, m, st) => { save({ completed: c, score: s, total: t, credits: cr, mod: m, step: st }); }, []);

  const handleQuiz = (ok) => {
    const nT = total + 1, nS = score + (ok ? 1 : 0), nCr = credits + (ok ? 5 : 0);
    const nC = { ...completed, [key]: true };
    setTotal(nT); setScore(nS); setCredits(nCr); setCompleted(nC);
    persist(nC, nS, nT, nCr, mod, step);
  };

  const goNext = () => {
    const m = MODULES[mod];
    if (step < m.steps.length - 1) { setStep(step + 1); persist(completed, score, total, credits, mod, step + 1); }
    else if (mod < MODULES.length - 1) { setMod(mod + 1); setStep(0); persist(completed, score, total, credits, mod + 1, 0); }
  };
  const goPrev = () => {
    if (step > 0) { setStep(step - 1); persist(completed, score, total, credits, mod, step - 1); }
    else if (mod > 0) { const p = MODULES[mod - 1]; setMod(mod - 1); setStep(p.steps.length - 1); persist(completed, score, total, credits, mod - 1, p.steps.length - 1); }
  };

  if (!ready) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>Chargement...</div>;

  const isFirst = mod === 0 && step === 0;
  const isLast = mod === MODULES.length - 1 && step === MODULES[MODULES.length - 1].steps.length - 1;
  const curMod = MODULES[mod];
  const curStep = curMod.steps[step];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ padding: "10px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.card, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, letterSpacing: 2, color: C.dimmed }}>CODEQUEST</span>
          <span style={{ color: C.border }}>|</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>Module 01 : Conditions</span>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
          <span style={{ color: C.muted }}>Quiz: <strong style={{ color: C.success }}>{score}/{total}</strong></span>
          <span style={{ color: C.muted }}>CR: <strong style={{ color: C.gold }}>{credits}</strong></span>
          <span style={{ color: C.muted }}>{doneCount}/{allSteps}</span>
        </div>
      </div>
      <div style={{ display: "flex", maxWidth: 1100, margin: "0 auto", minHeight: "calc(100vh - 46px)" }}>
        <div style={{ width: 220, borderRight: `1px solid ${C.border}`, padding: "12px 0", flexShrink: 0, overflowY: "auto" }}>
          {MODULES.map((m, mi) => (
            <div key={m.id}>
              <div style={{ padding: "6px 14px", fontSize: 10, letterSpacing: 1, color: C.dimmed, fontWeight: 600 }}>{m.icon} {m.title.toUpperCase()}</div>
              {m.steps.map((s, si) => {
                const k = `${mi}-${si}`, cur = mi === mod && si === step, dn = !!completed[k];
                return (<button key={k} onClick={() => { setMod(mi); setStep(si); }} style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", padding: "6px 14px 6px 24px", border: "none", background: cur ? C.accent + "15" : "transparent", borderLeft: cur ? `3px solid ${C.accent}` : "3px solid transparent", cursor: "pointer", fontFamily: "inherit", fontSize: 12, color: cur ? C.accent : dn ? C.success : C.muted, textAlign: "left" }}>
                  <span style={{ fontSize: 9 }}>{dn ? "✓" : "○"}</span>{s.title}
                </button>);
              })}
            </div>
          ))}
          <div style={{ padding: 14, marginTop: "auto" }}>
            <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${(doneCount / allSteps) * 100}%`, height: "100%", background: `linear-gradient(90deg,${C.primary},${C.accent})`, borderRadius: 2, transition: "width .5s" }} />
            </div>
            <div style={{ fontSize: 10, color: C.dimmed, textAlign: "center", marginTop: 4 }}>{doneCount === allSteps ? "Module terminé !" : `${allSteps - doneCount} restantes`}</div>
          </div>
        </div>
        <div style={{ flex: 1, padding: "20px 28px", overflowY: "auto", maxHeight: "calc(100vh - 46px)" }}>
          <div key={key} style={{ animation: "fadeIn .3s ease-out" }}>
            <div style={{ fontSize: 11, color: C.dimmed, letterSpacing: 1, marginBottom: 4 }}>{curMod.icon} {curMod.title}</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{curStep.title}</h2>
            {curStep.content(handleQuiz, isDone)}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
              <button onClick={goPrev} disabled={isFirst} style={{ padding: "8px 18px", borderRadius: 8, border: `1px solid ${C.border}`, background: "transparent", color: isFirst ? C.border : C.muted, cursor: isFirst ? "default" : "pointer", fontFamily: "inherit", fontSize: 13 }}>← Précédent</button>
              <button onClick={goNext} disabled={isLast} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: isLast ? C.border : C.accent, color: isLast ? C.muted : C.bg, cursor: isLast ? "default" : "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>{isLast ? "Terminé !" : "Suivant →"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
