import { useState, useEffect, useCallback } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", primary: "#0D7377", secondary: "#14A3C7",
  accent: "#32E0C4", gold: "#F59E0B", text: "#e2e8f0", muted: "#94a3b8",
  dimmed: "#64748b", border: "#1e293b", success: "#10B981", danger: "#EF4444",
  code: "#1E293B", codeBorder: "#2d3a4f", codeText: "#32E0C4", comment: "#6b7f99",
  keyword: "#c792ea", string: "#c3e88d", number: "#f78c6c", type: "#ffcb6b",
};

const KEY = "codequest-m03-oop";
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
            <span style={{ color: C.codeText, whiteSpace: "pre" }}>{col(line)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function col(l) {
  return l.replace(/(\/\/.*)/, `\x01C$1\x02`).replace(/\b(public|static|void|class|int|String|double|boolean|if|else|return|new|final|for|while|private|protected|this|null)\b/g, `\x01K$&\x02`).replace(/("(?:[^"\\]|\\.)*")/g, `\x01S$1\x02`).replace(/\b(\d+\.?\d*)\b/g, `\x01N$1\x02`).replace(/\b(System|Scanner|Math|ArrayList)\b/g, `\x01T$1\x02`).split(/(\x01\w.*?\x02)/).map((p, i) => {
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
function Analogy({ children }) {
  return (<div style={{ background: C.secondary + "12", borderRadius: 10, padding: 14, border: `1px solid ${C.secondary}30`, margin: "12px 0", borderLeft: `4px solid ${C.secondary}` }}><div style={{ fontSize: 12, fontWeight: 600, color: C.secondary, marginBottom: 4 }}>Analogie</div><div style={{ color: C.text, fontSize: 13, lineHeight: 1.6 }}>{children}</div></div>);
}

// ═══════════════════════════════════════════════════════════════
const MODULES = [
  { id: "pourquoi", title: "Pourquoi la POO ?", icon: "🧠", steps: [
    { title: "Le problème sans les classes", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>Imaginez un programme qui gère 3 inventions dans un labo. <strong style={{ color: C.danger }}>Sans classes</strong>, ça donne ça :</p>
      <Code hl={[1,2,3,5,6,7,9,10,11]} code={`// Invention 1
String nom1 = "Téléphone";
String inventeur1 = "Bell";
int annee1 = 1876;
// Invention 2
String nom2 = "Ampoule";
String inventeur2 = "Edison";
int annee2 = 1879;
// Invention 3
String nom3 = "Radio";
String inventeur3 = "Marconi";
int annee3 = 1895;

// Et si on veut 100 inventions ? 300 variables !
// Et si on veut ajouter un champ "description" ? 
// Il faut modifier PARTOUT dans le code !`} />
      <Analogy>
        C'est comme si un labo rangeait ses fiches d'inventions en vrac sur la table : nom ici, inventeur là-bas, année ailleurs. Si quelqu'un bouge une feuille, tout est mélangé. Ce qu'il faut, c'est un <strong>classeur</strong> avec une fiche structurée pour chaque invention.
      </Analogy>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginTop: 8 }}><strong style={{ color: C.accent }}>Une classe</strong> = le modèle de fiche. <strong style={{ color: C.accent }}>Un objet</strong> = une fiche remplie.</p>
      <Quiz q="Quel est le problème principal du code sans classes ci-dessus ?" opts={["Il ne compile pas", "Il est trop lent", "Il est impossible à maintenir quand on a beaucoup de données", "Il utilise trop de mémoire"]} correct={2} onAns={onQ} done={done} />
    </>)},
    { title: "Classe = Plan, Objet = Construction", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>En POO (Programmation Orientée Objet) :</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "12px 0" }}>
        <div style={{ background: C.card, borderRadius: 10, padding: 14, border: `1px solid ${C.accent}40` }}>
          <div style={{ fontWeight: 700, color: C.accent, fontSize: 15, marginBottom: 6 }}>Classe</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>Le <strong style={{ color: C.text }}>plan de construction</strong>. Décrit la structure : quels attributs, quelles méthodes. On l'écrit <strong>une seule fois</strong>.</div>
          <div style={{ color: C.dimmed, fontSize: 11, marginTop: 8, fontStyle: "italic" }}>= le moule à gâteau</div>
        </div>
        <div style={{ background: C.card, borderRadius: 10, padding: 14, border: `1px solid ${C.gold}40` }}>
          <div style={{ fontWeight: 700, color: C.gold, fontSize: 15, marginBottom: 6 }}>Objet</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>Une <strong style={{ color: C.text }}>instance</strong> de la classe. Un exemplaire concret avec ses propres valeurs. On peut en créer <strong>autant qu'on veut</strong>.</div>
          <div style={{ color: C.dimmed, fontSize: 11, marginTop: 8, fontStyle: "italic" }}>= un gâteau sorti du moule</div>
        </div>
      </div>
      <Code hl={[1,2,3,4,8,9,10]} code={`// La CLASSE (le plan)
public class Invention {
    String nom;
    String inventeur;
    int annee;
}

// Les OBJETS (les instances)
Invention tel = new Invention();  // 1er objet
tel.nom = "Téléphone";
tel.inventeur = "Bell";
tel.annee = 1876;

Invention amp = new Invention();  // 2ème objet
amp.nom = "Ampoule";
amp.inventeur = "Edison";
amp.annee = 1879;`} />
      <Task title="À taper dans Eclipse">
        1. Créez une nouvelle classe <code style={{ color: C.accent }}>Invention</code> (File → New → Class, <strong>sans</strong> cocher main)<br/>
        2. Ajoutez les 3 attributs : nom, inventeur, annee<br/>
        3. Créez une autre classe <code style={{ color: C.accent }}>TestInvention</code> (avec main)<br/>
        4. Dans le main, créez 2 objets Invention et affichez-les avec println
      </Task>
      <Tip title="2 fichiers = 2 classes">
        En Java, chaque classe publique va dans <strong>son propre fichier</strong>.<br/>
        <code style={{ color: C.accent }}>Invention.java</code> contient la classe Invention.<br/>
        <code style={{ color: C.accent }}>TestInvention.java</code> contient le main qui utilise Invention.
      </Tip>
      <Quiz q='Que fait "new Invention()" ?' opts={["Déclare une variable", "Crée un objet (une instance) de la classe Invention", "Compile la classe", "Supprime un objet"]} correct={1} onAns={onQ} done={done} />
    </>)},
  ]},
  { id: "constructeur", title: "Le constructeur", icon: "🏗️", steps: [
    { title: "Pourquoi un constructeur ?", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>Dans le code précédent, on pouvait créer un objet <strong style={{ color: C.danger }}>sans lui donner de valeurs</strong> :</p>
      <Code hl={[1,2]} code={`Invention inv = new Invention();
System.out.println(inv.nom);  // null !!
// L'objet existe mais il est VIDE — c'est dangereux`} />
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>Le <strong style={{ color: C.accent }}>constructeur</strong> force à donner des valeurs dès la création :</p>
      <Code hl={[5,6,7,8,9]} code={`public class Invention {
    String nom;
    String inventeur;
    int annee;
    
    // Le CONSTRUCTEUR : même nom que la classe, pas de return
    public Invention(String nom, String inventeur, int annee) {
        this.nom = nom;           // this = cet objet-ci
        this.inventeur = inventeur;
        this.annee = annee;
    }
}`} />
      <Analogy>
        Le constructeur c'est comme le formulaire d'entrée du Labo. Vous ne pouvez pas entrer sans remplir : nom, inventeur, année. Pas de fiche incomplète !
      </Analogy>
      <Code hl={[1,2]} code={`// Maintenant on est OBLIGÉ de donner les valeurs
Invention tel = new Invention("Téléphone", "Bell", 1876);

// Ceci ne compile PLUS :
// Invention inv = new Invention();  // ERREUR !`} />
      <Task title="À taper dans Eclipse">
        1. Ajoutez le constructeur dans votre classe Invention<br/>
        2. Dans TestInvention, modifiez la création avec le constructeur<br/>
        3. <strong>Essayez</strong> d'écrire <code style={{ color: C.accent }}>new Invention()</code> sans paramètres → observez l'erreur<br/>
        4. Lisez le message d'Eclipse : que dit-il exactement ?
      </Task>
      <Quiz q='Que signifie "this.nom = nom" dans le constructeur ?' opts={["Ça crée une nouvelle variable", "this.nom = l'attribut de l'objet, nom = le paramètre reçu", "C'est la même chose que nom = nom", "this est optionnel"]} correct={1} onAns={onQ} done={done} />
    </>)},
    { title: "this en détail", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}><code style={{ color: C.keyword }}>this</code> signifie <strong style={{ color: C.accent }}>"cet objet-ci"</strong>. Il sert à distinguer l'attribut de la classe du paramètre du même nom.</p>
      <Code hl={[3,4,5,6,10,11,12,13]} code={`public class Invention {
    String nom;         // attribut de l'objet
    
    // SANS this : PROBLÈME
    public Invention(String nom) {
        nom = nom;  // ⚠️ Le paramètre s'assigne à lui-même !
                    // L'attribut reste null !
    }
    
    // AVEC this : CORRECT
    public Invention(String nom) {
        this.nom = nom;  // this.nom = attribut de l'objet
                         // nom = paramètre reçu
    }
}`} />
      <Task title="Expérience à faire dans Eclipse" >
        1. Écrivez le constructeur <strong>SANS this</strong> : <code style={{ color: C.danger }}>nom = nom;</code><br/>
        2. Créez un objet et affichez <code style={{ color: C.accent }}>objet.nom</code> → que vaut-il ?<br/>
        3. Réponse : <strong>null</strong> ! Le paramètre s'est assigné à lui-même<br/>
        4. Corrigez avec <code style={{ color: C.success }}>this.nom = nom;</code><br/>
        5. Affichez à nouveau → maintenant ça marche !
      </Task>
      <Tip title="Règle d'or" color={C.danger}>
        Si le paramètre a le <strong>même nom</strong> que l'attribut, utilisez <code style={{ color: C.accent }}>this</code>.<br/>
        Si les noms sont différents (ex: attribut <code style={{ color: C.accent }}>nom</code>, paramètre <code style={{ color: C.accent }}>n</code>), this est optionnel. Mais par convention, on utilise les mêmes noms + this.
      </Tip>
      <Quiz q="Que vaut inv.nom si le constructeur fait 'nom = nom;' sans this ?" opts={["La valeur passée en paramètre", "null", "Une erreur de compilation", "0"]} correct={1} onAns={onQ} done={done} />
    </>)},
  ]},
  { id: "encapsulation", title: "Private, getters et setters", icon: "🔒", steps: [
    { title: "Pourquoi private ?", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>Pour l'instant, n'importe qui peut modifier les attributs directement :</p>
      <Code hl={[2,3]} code={`Invention inv = new Invention("Téléphone", "Bell", 1876);
inv.annee = -500;    // Année négative ?! Pas de sens !
inv.nom = "";        // Nom vide ?! Fiche corrompue !
// Personne ne vérifie si les valeurs sont valides`} />
      <Analogy>
        C'est comme si n'importe qui pouvait entrer dans le bureau du Labo et modifier les fiches. Il faut un <strong>gardien</strong> qui vérifie avant de changer quoi que ce soit.
      </Analogy>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, marginTop: 8 }}><code style={{ color: C.keyword }}>private</code> = personne ne peut accéder directement. Seule la classe elle-même peut toucher ses attributs.</p>
      <Code hl={[1,2,3]} code={`public class Invention {
    private String nom;        // PLUS accessible depuis l'extérieur
    private String inventeur;  // PLUS accessible depuis l'extérieur
    private int annee;         // PLUS accessible depuis l'extérieur
    
    public Invention(String nom, String inventeur, int annee) {
        this.nom = nom;
        this.inventeur = inventeur;
        this.annee = annee;
    }
}`} />
      <Code hl={[1,2]} code={`// Dans TestInvention.java
Invention inv = new Invention("Téléphone", "Bell", 1876);
inv.nom = "Truc";  // ❌ ERREUR : nom has private access`} />
      <Task title="À taper dans Eclipse">
        1. Ajoutez <code style={{ color: C.keyword }}>private</code> devant chaque attribut<br/>
        2. Dans TestInvention, essayez <code style={{ color: C.danger }}>inv.nom = "test";</code><br/>
        3. <strong>Observez l'erreur Eclipse</strong> — lisez le message<br/>
        4. Essayez aussi <code style={{ color: C.danger }}>System.out.println(inv.nom);</code> → même erreur !
      </Task>
      <Quiz q="Que signifie 'private' sur un attribut ?" opts={["L'attribut n'existe plus", "Seul le code à l'intérieur de la classe peut y accéder", "L'attribut est en lecture seule", "L'attribut est partagé entre tous les objets"]} correct={1} onAns={onQ} done={done} />
    </>)},
    { title: "Les getters : lire un attribut private", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>Un <strong style={{ color: C.accent }}>getter</strong> est une méthode publique qui <strong style={{ color: C.text }}>retourne</strong> la valeur d'un attribut privé. C'est un <strong>accès en lecture</strong> contrôlé.</p>
      <Code hl={[7,8,9,11,12,13,15,16,17]} code={`public class Invention {
    private String nom;
    private String inventeur;
    private int annee;
    
    // ... constructeur ...
    
    // GETTER : retourne la valeur de l'attribut
    public String getNom() {
        return this.nom;
    }
    
    public String getInventeur() {
        return this.inventeur;
    }
    
    public int getAnnee() {
        return this.annee;
    }
}`} />
      <Tip title="Convention de nommage">
        Un getter s'appelle toujours <code style={{ color: C.accent }}>getXxx()</code> où Xxx est le nom de l'attribut avec une majuscule.<br/>
        <code style={{ color: C.accent }}>nom</code> → <code style={{ color: C.accent }}>getNom()</code><br/>
        <code style={{ color: C.accent }}>annee</code> → <code style={{ color: C.accent }}>getAnnee()</code><br/>
        Pour un boolean : <code style={{ color: C.accent }}>isActif()</code> au lieu de <code style={{ color: C.accent }}>getActif()</code>
      </Tip>
      <Code code={`// Utilisation dans TestInvention
Invention inv = new Invention("Téléphone", "Bell", 1876);
System.out.println(inv.getNom());      // "Téléphone" ✅
System.out.println(inv.getAnnee());    // 1876 ✅
// inv.nom → ERREUR (private)
// inv.getNom() → OK (public)`} />
      <Task title="À taper dans Eclipse">
        1. Ajoutez les 3 getters dans votre classe Invention<br/>
        2. Dans TestInvention, utilisez les getters pour afficher<br/>
        3. Vérifiez que <code style={{ color: C.danger }}>inv.nom</code> ne marche toujours pas<br/>
        4. Mais <code style={{ color: C.success }}>inv.getNom()</code> fonctionne
      </Task>
      <Quiz q="Pourquoi un getter retourne-t-il une valeur (return) ?" opts={["Pour afficher dans la Console", "Pour donner la valeur de l'attribut privé à celui qui l'appelle", "Pour modifier l'attribut", "C'est optionnel"]} correct={1} onAns={onQ} done={done} />
    </>)},
    { title: "Les setters : modifier avec validation", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>Un <strong style={{ color: C.accent }}>setter</strong> permet de modifier un attribut privé <strong style={{ color: C.text }}>avec vérification</strong>. C'est là que réside la puissance de l'encapsulation !</p>
      <Code hl={[3,4,5,6,7,10,11,12,13,14]} code={`public class Invention {
    // ... attributs private + constructeur + getters ...
    
    // SETTER avec VALIDATION
    public void setNom(String nom) {
        if (nom != null && !nom.isEmpty()) {  // Vérifie !
            this.nom = nom;
        }
        // Si le nom est vide ou null → on ne fait RIEN (on protège la donnée)
    }
    
    public void setAnnee(int annee) {
        if (annee > 0 && annee <= 2026) {  // Année réaliste
            this.annee = annee;
        }
    }
}`} />
      <Analogy>
        Le setter c'est le gardien du Labo. Quelqu'un veut modifier une fiche ? Le gardien vérifie d'abord : "Est-ce que cette valeur a du sens ?" Si oui, il modifie. Si non, il refuse poliment.
      </Analogy>
      <Code hl={[2,3,5,6]} code={`Invention inv = new Invention("Téléphone", "Bell", 1876);

inv.setNom("Smartphone");     // ✅ Accepté
inv.setNom("");                // ❌ Refusé ! (nom vide)
System.out.println(inv.getNom());  // "Smartphone" (pas vide)

inv.setAnnee(-500);            // ❌ Refusé ! (année négative)
inv.setAnnee(2007);            // ✅ Accepté
System.out.println(inv.getAnnee()); // 2007`} />
      <Task title="À taper dans Eclipse">
        1. Ajoutez les setters avec validation dans Invention<br/>
        2. Dans TestInvention, testez :<br/>
        &nbsp;&nbsp;— <code style={{ color: C.success }}>inv.setNom("Smartphone")</code> puis affichez<br/>
        &nbsp;&nbsp;— <code style={{ color: C.danger }}>inv.setNom("")</code> puis affichez → le nom n'a PAS changé !<br/>
        &nbsp;&nbsp;— <code style={{ color: C.danger }}>inv.setAnnee(-500)</code> puis affichez → idem<br/>
        3. Comprenez : <strong>les données sont protégées</strong>
      </Task>
      <Quiz q='Que se passe-t-il si on appelle setNom("") avec la validation ci-dessus ?' opts={["Le nom devient vide", "Erreur de compilation", "Rien — le nom garde sa valeur précédente", "NullPointerException"]} correct={2} onAns={onQ} done={done} />
    </>)},
    { title: "Récapitulatif : public vs private", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>Voici le schéma complet de l'<strong style={{ color: C.text }}>encapsulation</strong> :</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "12px 0" }}>
        <div style={{ background: C.danger + "12", borderRadius: 10, padding: 14, border: `1px solid ${C.danger}40` }}>
          <div style={{ fontWeight: 700, color: C.danger, fontSize: 14, marginBottom: 6 }}>private (attributs)</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
            Les <strong style={{ color: C.text }}>données</strong> sont cachées.<br/>
            Personne ne peut y accéder directement.<br/>
            <code style={{ color: C.danger }}>private String nom;</code><br/>
            <code style={{ color: C.danger }}>private int annee;</code>
          </div>
        </div>
        <div style={{ background: C.success + "12", borderRadius: 10, padding: 14, border: `1px solid ${C.success}40` }}>
          <div style={{ fontWeight: 700, color: C.success, fontSize: 14, marginBottom: 6 }}>public (méthodes)</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
            L'<strong style={{ color: C.text }}>accès</strong> est contrôlé.<br/>
            Getters pour lire, setters pour modifier.<br/>
            <code style={{ color: C.success }}>public String getNom()</code><br/>
            <code style={{ color: C.success }}>public void setNom(String)</code>
          </div>
        </div>
      </div>
      <Code code={`// RÉSUMÉ — La classe complète
public class Invention {
    // 1. ATTRIBUTS (private)
    private String nom;
    private String inventeur;
    private int annee;
    
    // 2. CONSTRUCTEUR (public)
    public Invention(String nom, String inventeur, int annee) {
        this.nom = nom;
        this.inventeur = inventeur;
        this.annee = annee;
    }
    
    // 3. GETTERS (public) — lire
    public String getNom() { return this.nom; }
    public String getInventeur() { return this.inventeur; }
    public int getAnnee() { return this.annee; }
    
    // 4. SETTERS (public) — modifier avec validation
    public void setNom(String nom) {
        if (nom != null && !nom.isEmpty()) this.nom = nom;
    }
    public void setAnnee(int annee) {
        if (annee > 0 && annee <= 2026) this.annee = annee;
    }
}`} />
      <Quiz q="Dans quel ordre écrit-on le contenu d'une classe ?" opts={["Méthodes → attributs → constructeur", "Attributs → constructeur → getters → setters", "Constructeur → attributs → méthodes", "L'ordre n'a aucune importance technique"]} correct={3} onAns={onQ} done={done} />
    </>)},
  ]},
  { id: "methodes", title: "Les méthodes métier", icon: "⚙️", steps: [
    { title: "Des méthodes qui font des choses", content: (onQ, done) => (<>
      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>Les getters/setters ne sont pas les seules méthodes. On ajoute des <strong style={{ color: C.accent }}>méthodes métier</strong> — des actions que l'objet peut faire.</p>
      <Code hl={[5,6,7,10,11,12,13,14,15,16,17,18]} code={`public class Invention {
    private String nom;
    private String inventeur;
    private int annee;
    // ... constructeur + getters + setters ...
    
    // MÉTHODE MÉTIER : afficher la fiche
    public void afficher() {
        System.out.println("=== " + nom + " ===");
        System.out.println("Inventeur : " + inventeur);
        System.out.println("Année     : " + annee);
    }
    
    // MÉTHODE qui RETOURNE une valeur
    public int getAge() {
        return 2026 - annee;
    }
    
    // MÉTHODE avec paramètre
    public boolean estPlusAncienneQue(Invention autre) {
        return this.annee < autre.annee;
    }
}`} />
      <Code code={`// Utilisation
Invention tel = new Invention("Téléphone", "Bell", 1876);
Invention amp = new Invention("Ampoule", "Edison", 1879);

tel.afficher();
System.out.println("Age : " + tel.getAge() + " ans");
System.out.println("Plus ancienne ? " + tel.estPlusAncienneQue(amp));
// true (1876 < 1879)`} />
      <Tip title="void vs return">
        <code style={{ color: C.keyword }}>void</code> = la méthode fait une action mais ne retourne rien (afficher, modifier...)<br/>
        <code style={{ color: C.keyword }}>int</code>, <code style={{ color: C.keyword }}>String</code>, <code style={{ color: C.keyword }}>boolean</code>... = la méthode calcule et retourne un résultat
      </Tip>
      <Task title="À taper dans Eclipse">
        1. Ajoutez les 3 méthodes à votre classe Invention<br/>
        2. Testez <code style={{ color: C.accent }}>afficher()</code>, <code style={{ color: C.accent }}>getAge()</code> et <code style={{ color: C.accent }}>estPlusAncienneQue()</code><br/>
        3. Ajoutez une méthode <code style={{ color: C.accent }}>toString()</code> qui retourne une String formatée au lieu d'afficher<br/>
        4. Testez : <code style={{ color: C.accent }}>System.out.println(inv)</code> → appelle automatiquement toString() !
      </Task>
      <Quiz q="Quelle est la différence entre void et int comme type de retour ?" opts={["void retourne 0, int retourne un nombre", "void ne retourne rien, int retourne un nombre entier", "C'est la même chose", "void est pour les constructeurs"]} correct={1} onAns={onQ} done={done} />
    </>)},
  ]},
  { id: "exercice", title: "Exercice : Catalogue du Labo", icon: "💻", steps: [
    { title: "Énoncé", content: (onQ, done) => (<>
      <div style={{ background: C.gold + "15", borderRadius: 12, padding: 16, border: `1px solid ${C.gold}40` }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.gold, marginBottom: 6 }}>Exercice — 80 Crédits R&D</div>
        <div style={{ color: C.text, fontSize: 14, lineHeight: 1.6 }}>Créez un système de gestion d'inventions avec 2 classes : <code style={{ color: C.accent }}>Invention</code> et <code style={{ color: C.accent }}>Catalogue</code>.</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.accent, marginTop: 14, marginBottom: 8 }}>Classe Invention :</div>
      <div style={{ color: C.text, fontSize: 13, lineHeight: 1.8 }}>
        — Attributs privés : nom (String), inventeur (String), annee (int), categorie (String)<br/>
        — Constructeur avec les 4 paramètres<br/>
        — Getters pour tous les attributs<br/>
        — Setters avec validation (nom non vide, annee {">"} 0)<br/>
        — Méthode <code style={{ color: C.accent }}>afficher()</code><br/>
        — Méthode <code style={{ color: C.accent }}>getAge()</code> qui retourne l'âge
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.accent, marginTop: 14, marginBottom: 8 }}>Classe Catalogue :</div>
      <div style={{ color: C.text, fontSize: 13, lineHeight: 1.8 }}>
        — Attribut : <code style={{ color: C.accent }}>ArrayList{"<Invention>"} inventions</code><br/>
        — Méthode <code style={{ color: C.accent }}>ajouter(Invention inv)</code><br/>
        — Méthode <code style={{ color: C.accent }}>afficherTout()</code> — affiche toutes les inventions<br/>
        — Méthode <code style={{ color: C.accent }}>rechercherParCategorie(String cat)</code> — retourne les inventions d'une catégorie<br/>
        — Méthode <code style={{ color: C.accent }}>trouverPlusAncienne()</code> — retourne l'invention la plus vieille<br/>
        — <strong>Bonus</strong> : méthode <code style={{ color: C.accent }}>supprimer(String nom)</code>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
        {["class", "private", "constructeur", "this", "getter/setter", "ArrayList", "for-each", "if/else", "return"].map(c => (
          <span key={c} style={{ padding: "4px 10px", borderRadius: 20, background: C.primary + "20", color: C.accent, fontSize: 11 }}>{c}</span>
        ))}
      </div>
      <Quiz q="Pour stocker plusieurs Invention dans le Catalogue, on utilise :" opts={["int[]", "String[]", "ArrayList<Invention>", "Invention[][]"]} correct={2} onAns={onQ} done={done} />
    </>)},
    { title: "Correction complète", content: (onQ, done) => (<>
      <div style={{ background: C.success + "12", borderRadius: 10, padding: 12, border: `1px solid ${C.success}40`, marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.success }}>Correction — Pour l'enseignant</div>
      </div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 8 }}>Fichier <code style={{ color: C.accent }}>Invention.java</code> :</p>
      <Code code={`public class Invention {
    private String nom;
    private String inventeur;
    private int annee;
    private String categorie;
    
    public Invention(String nom, String inventeur, int annee, String categorie) {
        this.nom = nom;
        this.inventeur = inventeur;
        this.annee = annee;
        this.categorie = categorie;
    }
    
    public String getNom() { return nom; }
    public String getInventeur() { return inventeur; }
    public int getAnnee() { return annee; }
    public String getCategorie() { return categorie; }
    
    public void setNom(String nom) {
        if (nom != null && !nom.isEmpty()) this.nom = nom;
    }
    public void setAnnee(int annee) {
        if (annee > 0 && annee <= 2026) this.annee = annee;
    }
    
    public int getAge() { return 2026 - annee; }
    
    public void afficher() {
        System.out.println(nom + " (" + annee + ") par " + inventeur + " [" + categorie + "]");
    }
}`} />
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 8, marginTop: 16 }}>Fichier <code style={{ color: C.accent }}>Catalogue.java</code> :</p>
      <Code hl={[1,7,11,12,13,16,17,18,19,20,21,24,25,26,27,28,29,30,31,32,33]} code={`import java.util.ArrayList;

public class Catalogue {
    private ArrayList<Invention> inventions;
    
    public Catalogue() {
        this.inventions = new ArrayList<>();
    }
    
    public void ajouter(Invention inv) {
        inventions.add(inv);
        System.out.println("Ajouté : " + inv.getNom());
    }
    
    public void afficherTout() {
        System.out.println("=== CATALOGUE (" + inventions.size() + " inventions) ===");
        for (Invention inv : inventions) {
            inv.afficher();
        }
    }
    
    public ArrayList<Invention> rechercherParCategorie(String cat) {
        ArrayList<Invention> resultats = new ArrayList<>();
        for (Invention inv : inventions) {
            if (inv.getCategorie().equals(cat)) {
                resultats.add(inv);
            }
        }
        return resultats;
    }
    
    public Invention trouverPlusAncienne() {
        if (inventions.isEmpty()) return null;
        Invention plusAncienne = inventions.get(0);
        for (Invention inv : inventions) {
            if (inv.getAnnee() < plusAncienne.getAnnee()) {
                plusAncienne = inv;
            }
        }
        return plusAncienne;
    }
    
    // BONUS
    public boolean supprimer(String nom) {
        for (int i = 0; i < inventions.size(); i++) {
            if (inventions.get(i).getNom().equals(nom)) {
                inventions.remove(i);
                return true;
            }
        }
        return false;
    }
}`} />
      <Tip title="Points clés de la correction">
        <strong>ArrayList{"<Invention>"}</strong> : liste dynamique d'objets Invention<br/>
        <strong>.add()</strong> : ajouter, <strong>.get(i)</strong> : accéder, <strong>.remove(i)</strong> : supprimer, <strong>.size()</strong> : taille<br/>
        <strong>for-each</strong> : pour parcourir, <strong>for classique</strong> : quand on a besoin de l'index (supprimer)<br/>
        <strong>.equals()</strong> : TOUJOURS pour comparer des String, JAMAIS ==
      </Tip>
      <Quiz q="Pourquoi utiliser ArrayList plutôt qu'un tableau classique ?" opts={["ArrayList est plus rapide", "ArrayList a une taille dynamique (on peut ajouter/supprimer)", "Les tableaux n'existent pas en Java", "ArrayList utilise moins de mémoire"]} correct={1} onAns={onQ} done={done} />
    </>)},
  ]},
];

// ═══════════════════════════════════════════════════════════════
export default function Module03OOP() {
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

  useEffect(() => { load().then(d => { if(d){setCompleted(d.completed||{});setScore(d.score||0);setTotal(d.total||0);setCredits(d.credits||0);if(d.mod!==undefined)setMod(d.mod);if(d.step!==undefined)setStep(d.step);} setReady(true); }); }, []);
  const persist = useCallback((c,s,t,cr,m,st) => { save({completed:c,score:s,total:t,credits:cr,mod:m,step:st}); }, []);
  const handleQuiz = (ok) => { const nT=total+1,nS=score+(ok?1:0),nCr=credits+(ok?5:0),nC={...completed,[key]:true}; setTotal(nT);setScore(nS);setCredits(nCr);setCompleted(nC); persist(nC,nS,nT,nCr,mod,step); };
  const goNext = () => { const m=MODULES[mod]; if(step<m.steps.length-1){setStep(step+1);persist(completed,score,total,credits,mod,step+1);}else if(mod<MODULES.length-1){setMod(mod+1);setStep(0);persist(completed,score,total,credits,mod+1,0);} };
  const goPrev = () => { if(step>0){setStep(step-1);persist(completed,score,total,credits,mod,step-1);}else if(mod>0){const p=MODULES[mod-1];setMod(mod-1);setStep(p.steps.length-1);persist(completed,score,total,credits,mod-1,p.steps.length-1);} };

  if (!ready) return <div style={{ minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted }}>Chargement...</div>;
  const isFirst=mod===0&&step===0,isLast=mod===MODULES.length-1&&step===MODULES[MODULES.length-1].steps.length-1;
  const curMod=MODULES[mod],curStep=curMod.steps[step];

  return (
    <div style={{ minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ padding:"10px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:6 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontSize:11,letterSpacing:2,color:C.dimmed }}>CODEQUEST</span><span style={{ color:C.border }}>|</span>
          <span style={{ fontSize:13,fontWeight:600,color:C.accent }}>Module 03 : POO Fondamentaux</span>
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
            <div style={{ fontSize:10,color:C.dimmed,textAlign:"center",marginTop:4 }}>{doneCount===allSteps?"Module terminé !":""}</div>
          </div>
        </div>
        <div style={{ flex:1,padding:"20px 28px",overflowY:"auto",maxHeight:"calc(100vh - 46px)" }}>
          <div key={key} style={{ animation:"fadeIn .3s ease-out" }}>
            <div style={{ fontSize:11,color:C.dimmed,letterSpacing:1,marginBottom:4 }}>{curMod.icon} {curMod.title}</div>
            <h2 style={{ fontSize:20,fontWeight:700,marginBottom:16 }}>{curStep.title}</h2>
            {curStep.content(handleQuiz,isDone)}
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
