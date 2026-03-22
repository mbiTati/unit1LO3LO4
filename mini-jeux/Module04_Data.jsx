import { useState, useEffect, useCallback } from "react";

const C = { bg:"#0a0f1a",card:"#111827",primary:"#0D7377",secondary:"#14A3C7",accent:"#32E0C4",gold:"#F59E0B",text:"#e2e8f0",muted:"#94a3b8",dimmed:"#64748b",border:"#1e293b",success:"#10B981",danger:"#EF4444",code:"#1E293B",codeBorder:"#2d3a4f",codeText:"#32E0C4",comment:"#6b7f99",keyword:"#c792ea",string:"#c3e88d",number:"#f78c6c",type:"#ffcb6b" };
const KEY = "codequest-m04-data";
async function load(){try{const r=await window.storage.get(KEY);return r?JSON.parse(r.value):null;}catch{return null;}}
async function save(d){try{await window.storage.set(KEY,JSON.stringify(d));}catch{}}

function Code({code,hl=[]}){const lines=code.split("\n");return(<div style={{background:C.code,border:`1px solid ${C.codeBorder}`,borderRadius:10,overflow:"hidden",fontSize:13,fontFamily:"'JetBrains Mono',monospace",margin:"10px 0"}}><div style={{display:"flex",gap:6,padding:"6px 12px",background:"#0d1117",borderBottom:`1px solid ${C.codeBorder}`}}><span style={{width:8,height:8,borderRadius:"50%",background:"#ff5f57"}}/><span style={{width:8,height:8,borderRadius:"50%",background:"#febc2e"}}/><span style={{width:8,height:8,borderRadius:"50%",background:"#28c840"}}/></div><div style={{padding:"10px 0",overflowX:"auto"}}>{lines.map((line,i)=>(<div key={i} style={{display:"flex",padding:"1px 0",background:hl.includes(i)?C.accent+"12":"transparent",borderLeft:hl.includes(i)?`3px solid ${C.accent}`:"3px solid transparent"}}><span style={{width:36,textAlign:"right",paddingRight:10,color:C.dimmed,userSelect:"none",flexShrink:0,fontSize:11}}>{i+1}</span><span style={{color:C.codeText,whiteSpace:"pre"}}>{col(line)}</span></div>))}</div></div>);}
function col(l){return l.replace(/(\/\/.*)/, `\x01C$1\x02`).replace(/\b(public|static|void|class|int|String|double|boolean|if|else|return|new|final|for|while|private|this|null|import)\b/g,`\x01K$&\x02`).replace(/("(?:[^"\\]|\\.)*")/g,`\x01S$1\x02`).replace(/\b(\d+\.?\d*)\b/g,`\x01N$1\x02`).replace(/\b(System|Scanner|ArrayList|Collections)\b/g,`\x01T$1\x02`).split(/(\x01\w.*?\x02)/).map((p,i)=>{if(p.startsWith("\x01C"))return <span key={i} style={{color:C.comment,fontStyle:"italic"}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01K"))return <span key={i} style={{color:C.keyword}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01S"))return <span key={i} style={{color:C.string}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01N"))return <span key={i} style={{color:C.number}}>{p.slice(2,-1)}</span>;if(p.startsWith("\x01T"))return <span key={i} style={{color:C.type}}>{p.slice(2,-1)}</span>;return <span key={i}>{p}</span>;});}
function Quiz({q,opts,correct,onAns,done}){const[sel,setSel]=useState(null);const click=(i)=>{if(done)return;setSel(i);onAns(i===correct);};return(<div style={{margin:"14px 0"}}><div style={{fontSize:14,fontWeight:600,color:C.text,marginBottom:8}}>{q}</div>{opts.map((o,i)=>{let bg=C.card,bc=C.border;if(done&&i===correct){bg=C.success+"20";bc=C.success;}else if(done&&sel===i){bg=C.danger+"20";bc=C.danger;}return(<button key={i} onClick={()=>click(i)} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 12px",marginBottom:4,borderRadius:8,border:`1px solid ${bc}`,background:bg,color:C.text,cursor:done?"default":"pointer",fontFamily:"inherit",fontSize:13}}>{String.fromCharCode(65+i)}. {o}</button>);})}</div>);}
function Task({title,children}){return(<div style={{background:C.primary+"15",borderRadius:10,padding:14,border:`1px solid ${C.primary}40`,margin:"12px 0"}}><div style={{fontSize:13,fontWeight:600,color:C.accent,marginBottom:6}}>{title}</div><div style={{color:C.text,fontSize:13,lineHeight:1.6}}>{children}</div></div>);}
function Tip({title,children,color=C.gold}){return(<div style={{background:color+"15",borderRadius:8,padding:12,border:`1px solid ${color}40`,margin:"10px 0"}}><div style={{fontSize:12,fontWeight:600,color,marginBottom:4}}>{title}</div><div style={{color:C.text,fontSize:12,lineHeight:1.6}}>{children}</div></div>);}

const MODULES=[
  {id:"string",title:"Manipuler les String",icon:"📝",steps:[
    {title:"Méthodes essentielles des String",content:(onQ,done)=>(<>
      <p style={{color:C.muted,fontSize:14,lineHeight:1.7}}>Les <code style={{color:C.keyword}}>String</code> en Java ont plein de méthodes utiles. Voici les plus importantes :</p>
      <Code hl={[1,3,4,5,6,7,8,9,10,11,12]} code={`String texte = "Labo CodeQuest";

// Longueur
System.out.println(texte.length());         // 14

// Majuscules / minuscules
System.out.println(texte.toUpperCase());    // "LABO CODEQUEST"
System.out.println(texte.toLowerCase());    // "labo codequest"

// Extraire une partie (substring)
System.out.println(texte.substring(0, 4));  // "Labo"
System.out.println(texte.substring(5));     // "CodeQuest"

// Chercher
System.out.println(texte.contains("Code")); // true
System.out.println(texte.indexOf("Quest")); // 9
System.out.println(texte.startsWith("Labo")); // true

// Remplacer
System.out.println(texte.replace("Labo", "Super")); // "Super CodeQuest"

// Découper (split)
String[] mots = texte.split(" ");  // ["Labo", "CodeQuest"]`} />
      <Tip title="Rappel crucial">
        Les String sont <strong>immuables</strong> en Java ! <code style={{color:C.accent}}>texte.toUpperCase()</code> ne modifie PAS texte — il retourne un NOUVEAU String.<br/>
        Pour garder le résultat : <code style={{color:C.accent}}>texte = texte.toUpperCase();</code>
      </Tip>
      <Task title="À taper dans Eclipse">
        1. Déclarez <code style={{color:C.accent}}>String phrase = "Bienvenue au Labo CodeQuest 2026";</code><br/>
        2. Affichez sa longueur<br/>
        3. Extrayez "CodeQuest" avec substring<br/>
        4. Vérifiez si elle contient "Labo"<br/>
        5. Découpez-la en mots avec split(" ") et affichez chaque mot avec un for-each
      </Task>
      <Quiz q='Que retourne "Hello".substring(1, 4) ?' opts={['"Hell"', '"ell"', '"ello"', '"Hel"']} correct={1} onAns={onQ} done={done}/>
    </>)},
    {title:"Comparer des String + charAt",content:(onQ,done)=>(<>
      <p style={{color:C.muted,fontSize:14,lineHeight:1.7}}>Rappel : pour comparer des String, <strong style={{color:C.danger}}>JAMAIS ==</strong>, toujours <code style={{color:C.success}}>.equals()</code> !</p>
      <Code hl={[3,4,7,8]} code={`String a = "test";
String b = new String("test");

// ❌ FAUX : compare les références mémoire
System.out.println(a == b);       // false !!

// ✅ CORRECT : compare le contenu
System.out.println(a.equals(b));  // true

// Ignorer la casse
System.out.println("ABC".equalsIgnoreCase("abc")); // true

// Accéder à un caractère par position
char c = "Hello".charAt(0);  // 'H'
char d = "Hello".charAt(4);  // 'o'`} />
      <Code code={`// Exemple pratique : compter les voyelles
String mot = "programmation";
int voyelles = 0;
for (int i = 0; i < mot.length(); i++) {
    char c = mot.charAt(i);
    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
        voyelles++;
    }
}
System.out.println("Voyelles : " + voyelles); // 5`} />
      <Task title="À taper dans Eclipse">
        1. Écrivez un programme qui demande un mot à l'utilisateur<br/>
        2. Affichez le mot en majuscules et en minuscules<br/>
        3. Comptez le nombre de voyelles<br/>
        4. Affichez le mot à l'envers (indice : boucle de length()-1 à 0)
      </Task>
      <Quiz q='Pourquoi "test" == new String("test") retourne false ?' opts={["Bug de Java","== compare les références mémoire, pas le contenu","Les String ne supportent pas ==","Ce n'est pas false, c'est true"]} correct={1} onAns={onQ} done={done}/>
    </>)},
  ]},
  {id:"arrays",title:"Tableaux et ArrayList",icon:"📊",steps:[
    {title:"CRUD avec ArrayList",content:(onQ,done)=>(<>
      <p style={{color:C.muted,fontSize:14,lineHeight:1.7}}><strong style={{color:C.text}}>CRUD</strong> = Create, Read, Update, Delete. Les 4 opérations de base sur les données.</p>
      <Code hl={[4,7,8,11,14,17,18]} code={`import java.util.ArrayList;

// CREATE : créer et ajouter
ArrayList<String> inventions = new ArrayList<>();
inventions.add("Téléphone");       // [Téléphone]
inventions.add("Ampoule");         // [Téléphone, Ampoule]
inventions.add("Radio");           // [Téléphone, Ampoule, Radio]

// READ : lire
System.out.println(inventions.get(0));      // Téléphone
System.out.println(inventions.size());      // 3

// UPDATE : modifier
inventions.set(0, "Smartphone");   // [Smartphone, Ampoule, Radio]

// DELETE : supprimer
inventions.remove(1);              // [Smartphone, Radio]
inventions.remove("Radio");        // [Smartphone]`} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,margin:"12px 0"}}>
        <div style={{background:C.card,borderRadius:8,padding:10,border:`1px solid ${C.border}`}}>
          <div style={{fontWeight:700,color:C.accent,fontSize:12}}>Array classique</div>
          <div style={{color:C.muted,fontSize:11,marginTop:4}}>Taille FIXE<br/><code>int[] tab = new int[5];</code><br/>Rapide mais inflexible</div>
        </div>
        <div style={{background:C.card,borderRadius:8,padding:10,border:`1px solid ${C.border}`}}>
          <div style={{fontWeight:700,color:C.gold,fontSize:12}}>ArrayList</div>
          <div style={{color:C.muted,fontSize:11,marginTop:4}}>Taille DYNAMIQUE<br/><code>ArrayList{"<String>"} list = new...</code><br/>Flexible, add/remove facile</div>
        </div>
      </div>
      <Task title="À taper dans Eclipse">
        1. Créez un ArrayList de String pour stocker des noms d'inventeurs<br/>
        2. Ajoutez 5 noms avec add()<br/>
        3. Affichez le 3ème avec get(2)<br/>
        4. Modifiez le 1er avec set(0, "Nouveau nom")<br/>
        5. Supprimez le dernier avec remove(size()-1)<br/>
        6. Affichez toute la liste avec un for-each
      </Task>
      <Quiz q="Que fait inventions.set(1, 'GPS') ?" opts={["Ajoute GPS à la fin","Remplace l'élément à l'index 1 par GPS","Insère GPS à l'index 1","Supprime l'élément 1"]} correct={1} onAns={onQ} done={done}/>
    </>)},
    {title:"Recherche et filtrage",content:(onQ,done)=>(<>
      <p style={{color:C.muted,fontSize:14,lineHeight:1.7}}>Les opérations courantes sur les collections : chercher, filtrer, compter.</p>
      <Code hl={[4,5,6,7,8,12,13,14,15,16,17,18]} code={`ArrayList<String> noms = new ArrayList<>();
noms.add("Alice"); noms.add("Bob"); noms.add("Alice"); noms.add("Charlie");

// CHERCHER : est-ce que l'élément existe ?
boolean existe = noms.contains("Bob");     // true
int index = noms.indexOf("Alice");         // 0 (première occurrence)
int last = noms.lastIndexOf("Alice");      // 2 (dernière occurrence)
boolean vide = noms.isEmpty();             // false

// FILTRER : créer une sous-liste
ArrayList<String> resultat = new ArrayList<>();
for (String nom : noms) {
    if (nom.startsWith("A")) {
        resultat.add(nom);
    }
}
// resultat = [Alice, Alice]
System.out.println("Noms en A : " + resultat.size());

// COMPTER
int count = 0;
for (String nom : noms) {
    if (nom.length() > 3) count++;
}
System.out.println("Noms > 3 lettres : " + count); // 3`} />
      <Task title="À taper dans Eclipse">
        1. Créez un ArrayList de nombres entiers (ArrayList{"<Integer>"})<br/>
        2. Ajoutez 10 nombres variés<br/>
        3. Trouvez et affichez le plus grand et le plus petit<br/>
        4. Comptez combien sont pairs (n % 2 == 0)<br/>
        5. Créez un nouveau ArrayList avec seulement les nombres {">"} 50
      </Task>
      <Quiz q="Que retourne indexOf() si l'élément n'existe pas ?" opts={["0","null","-1","Une exception"]} correct={2} onAns={onQ} done={done}/>
    </>)},
  ]},
  {id:"exercice",title:"Exercice : Gestionnaire d'Inventeurs",icon:"💻",steps:[
    {title:"Énoncé",content:(onQ,done)=>(<>
      <div style={{background:C.gold+"15",borderRadius:12,padding:16,border:`1px solid ${C.gold}40`}}>
        <div style={{fontSize:16,fontWeight:700,color:C.gold,marginBottom:6}}>Exercice — 60 Crédits R&D</div>
        <div style={{color:C.text,fontSize:14,lineHeight:1.6}}>Créez un programme interactif de gestion d'inventeurs avec un menu CRUD complet.</div>
      </div>
      <div style={{color:C.text,fontSize:13,lineHeight:1.8,marginTop:12}}>
        Le programme affiche un menu en boucle :<br/>
        <strong>1.</strong> Ajouter un inventeur (nom + spécialité)<br/>
        <strong>2.</strong> Afficher tous les inventeurs<br/>
        <strong>3.</strong> Rechercher par nom (partiel, insensible à la casse)<br/>
        <strong>4.</strong> Modifier un inventeur (par index)<br/>
        <strong>5.</strong> Supprimer un inventeur (par nom)<br/>
        <strong>6.</strong> Statistiques (total, plus long nom, noms par initiale)<br/>
        <strong>0.</strong> Quitter<br/><br/>
        <strong>Concepts :</strong> ArrayList, String methods, while, switch, Scanner, if/else
      </div>
      <Tip title="Indice pour la recherche partielle">
        Utilisez <code style={{color:C.accent}}>nom.toLowerCase().contains(recherche.toLowerCase())</code> pour chercher sans tenir compte des majuscules/minuscules.
      </Tip>
      <Quiz q="Pour une recherche insensible à la casse, quelle méthode utiliser ?" opts={[".equals()",".contains() sur les deux en toLowerCase()",".compareTo()",".matches()"]} correct={1} onAns={onQ} done={done}/>
    </>)},
    {title:"Correction",content:(onQ,done)=>(<>
      <div style={{background:C.success+"12",borderRadius:10,padding:12,border:`1px solid ${C.success}40`,marginBottom:12}}>
        <div style={{fontSize:14,fontWeight:700,color:C.success}}>Correction — Pour l'enseignant</div>
      </div>
      <Code code={`import java.util.ArrayList;
import java.util.Scanner;

public class GestionInventeurs_CORRECTION {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        ArrayList<String> noms = new ArrayList<>();
        ArrayList<String> specialites = new ArrayList<>();
        int choix;
        
        do {
            System.out.println("\\n=== GESTION INVENTEURS ===");
            System.out.println("1. Ajouter");
            System.out.println("2. Afficher tous");
            System.out.println("3. Rechercher");
            System.out.println("4. Modifier");
            System.out.println("5. Supprimer");
            System.out.println("6. Statistiques");
            System.out.println("0. Quitter");
            System.out.print("Choix : ");
            choix = sc.nextInt(); sc.nextLine();
            
            switch (choix) {
                case 1: // AJOUTER
                    System.out.print("Nom : ");
                    String nom = sc.nextLine();
                    System.out.print("Spécialité : ");
                    String spec = sc.nextLine();
                    noms.add(nom);
                    specialites.add(spec);
                    System.out.println("Ajouté !");
                    break;
                    
                case 2: // AFFICHER
                    if (noms.isEmpty()) {
                        System.out.println("Aucun inventeur.");
                    } else {
                        for (int i = 0; i < noms.size(); i++) {
                            System.out.println((i+1) + ". " + noms.get(i) 
                                + " (" + specialites.get(i) + ")");
                        }
                    }
                    break;
                    
                case 3: // RECHERCHER
                    System.out.print("Recherche : ");
                    String rech = sc.nextLine().toLowerCase();
                    boolean trouve = false;
                    for (int i = 0; i < noms.size(); i++) {
                        if (noms.get(i).toLowerCase().contains(rech)) {
                            System.out.println("→ " + noms.get(i) 
                                + " (" + specialites.get(i) + ")");
                            trouve = true;
                        }
                    }
                    if (!trouve) System.out.println("Aucun résultat.");
                    break;
                    
                case 4: // MODIFIER
                    System.out.print("Index à modifier (1-" + noms.size() + ") : ");
                    int idx = sc.nextInt() - 1; sc.nextLine();
                    if (idx >= 0 && idx < noms.size()) {
                        System.out.print("Nouveau nom : ");
                        noms.set(idx, sc.nextLine());
                        System.out.print("Nouvelle spécialité : ");
                        specialites.set(idx, sc.nextLine());
                        System.out.println("Modifié !");
                    } else {
                        System.out.println("Index invalide !");
                    }
                    break;
                    
                case 5: // SUPPRIMER
                    System.out.print("Nom à supprimer : ");
                    String supp = sc.nextLine();
                    int iSupp = noms.indexOf(supp);
                    if (iSupp >= 0) {
                        noms.remove(iSupp);
                        specialites.remove(iSupp);
                        System.out.println("Supprimé !");
                    } else {
                        System.out.println("Non trouvé !");
                    }
                    break;
                    
                case 6: // STATS
                    System.out.println("Total : " + noms.size());
                    if (!noms.isEmpty()) {
                        String plusLong = noms.get(0);
                        for (String n : noms) {
                            if (n.length() > plusLong.length()) plusLong = n;
                        }
                        System.out.println("Plus long nom : " + plusLong);
                    }
                    break;
            }
        } while (choix != 0);
        
        System.out.println("Au revoir !");
        sc.close();
    }
}`} />
      <Quiz q="Pourquoi fait-on sc.nextLine() juste après sc.nextInt() ?" opts={["Pour lire le prochain mot","Pour consommer le '\\n' resté dans le buffer après nextInt()","C'est optionnel","Pour fermer le Scanner"]} correct={1} onAns={onQ} done={done}/>
    </>)},
  ]},
];

export default function Module04Data(){
  const[mod,setMod]=useState(0);const[step,setStep]=useState(0);const[completed,setCompleted]=useState({});const[score,setScore]=useState(0);const[total,setTotal]=useState(0);const[credits,setCredits]=useState(0);const[ready,setReady]=useState(false);
  const allSteps=MODULES.reduce((a,m)=>a+m.steps.length,0);const doneCount=Object.keys(completed).length;const key=`${mod}-${step}`;const isDone=!!completed[key];
  useEffect(()=>{load().then(d=>{if(d){setCompleted(d.completed||{});setScore(d.score||0);setTotal(d.total||0);setCredits(d.credits||0);if(d.mod!==undefined)setMod(d.mod);if(d.step!==undefined)setStep(d.step);}setReady(true);});},[]);
  const persist=useCallback((c,s,t,cr,m,st)=>{save({completed:c,score:s,total:t,credits:cr,mod:m,step:st});},[]);
  const handleQuiz=(ok)=>{const nT=total+1,nS=score+(ok?1:0),nCr=credits+(ok?5:0),nC={...completed,[key]:true};setTotal(nT);setScore(nS);setCredits(nCr);setCompleted(nC);persist(nC,nS,nT,nCr,mod,step);};
  const goNext=()=>{const m=MODULES[mod];if(step<m.steps.length-1){setStep(step+1);persist(completed,score,total,credits,mod,step+1);}else if(mod<MODULES.length-1){setMod(mod+1);setStep(0);persist(completed,score,total,credits,mod+1,0);}};
  const goPrev=()=>{if(step>0){setStep(step-1);persist(completed,score,total,credits,mod,step-1);}else if(mod>0){const p=MODULES[mod-1];setMod(mod-1);setStep(p.steps.length-1);persist(completed,score,total,credits,mod-1,p.steps.length-1);}};
  if(!ready)return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>Chargement...</div>;
  const isFirst=mod===0&&step===0,isLast=mod===MODULES.length-1&&step===MODULES[MODULES.length-1].steps.length-1;const curMod=MODULES[mod],curStep=curMod.steps[step];
  return(<div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif"}}><style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style><div style={{padding:"10px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",background:C.card,flexWrap:"wrap",gap:6}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:11,letterSpacing:2,color:C.dimmed}}>CODEQUEST</span><span style={{color:C.border}}>|</span><span style={{fontSize:13,fontWeight:600,color:C.accent}}>Module 04 : Manipulation de Données</span></div><div style={{display:"flex",gap:12,fontSize:12}}><span style={{color:C.muted}}>Quiz: <strong style={{color:C.success}}>{score}/{total}</strong></span><span style={{color:C.muted}}>CR: <strong style={{color:C.gold}}>{credits}</strong></span></div></div><div style={{display:"flex",maxWidth:1100,margin:"0 auto",minHeight:"calc(100vh - 46px)"}}><div style={{width:220,borderRight:`1px solid ${C.border}`,padding:"12px 0",flexShrink:0,overflowY:"auto"}}>{MODULES.map((m,mi)=>(<div key={m.id}><div style={{padding:"6px 14px",fontSize:10,letterSpacing:1,color:C.dimmed,fontWeight:600}}>{m.icon} {m.title.toUpperCase()}</div>{m.steps.map((s,si)=>{const k=`${mi}-${si}`,cur=mi===mod&&si===step,dn=!!completed[k];return(<button key={k} onClick={()=>{setMod(mi);setStep(si);}} style={{display:"flex",alignItems:"center",gap:6,width:"100%",padding:"6px 14px 6px 24px",border:"none",background:cur?C.accent+"15":"transparent",borderLeft:cur?`3px solid ${C.accent}`:"3px solid transparent",cursor:"pointer",fontFamily:"inherit",fontSize:12,color:cur?C.accent:dn?C.success:C.muted,textAlign:"left"}}><span style={{fontSize:9}}>{dn?"✓":"○"}</span>{s.title}</button>);})}</div>))}<div style={{padding:14,marginTop:"auto"}}><div style={{height:4,background:C.border,borderRadius:2,overflow:"hidden"}}><div style={{width:`${(doneCount/allSteps)*100}%`,height:"100%",background:`linear-gradient(90deg,${C.primary},${C.accent})`,borderRadius:2,transition:"width .5s"}}/></div></div></div><div style={{flex:1,padding:"20px 28px",overflowY:"auto",maxHeight:"calc(100vh - 46px)"}}><div key={key} style={{animation:"fadeIn .3s ease-out"}}><div style={{fontSize:11,color:C.dimmed,letterSpacing:1,marginBottom:4}}>{curMod.icon} {curMod.title}</div><h2 style={{fontSize:20,fontWeight:700,marginBottom:16}}>{curStep.title}</h2>{curStep.content(handleQuiz,isDone)}<div style={{display:"flex",justifyContent:"space-between",marginTop:28,paddingTop:14,borderTop:`1px solid ${C.border}`}}><button onClick={goPrev} disabled={isFirst} style={{padding:"8px 18px",borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:isFirst?C.border:C.muted,cursor:isFirst?"default":"pointer",fontFamily:"inherit",fontSize:13}}>← Précédent</button><button onClick={goNext} disabled={isLast} style={{padding:"8px 18px",borderRadius:8,border:"none",background:isLast?C.border:C.accent,color:isLast?C.muted:C.bg,cursor:isLast?"default":"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600}}>{isLast?"Terminé !":"Suivant →"}</button></div></div></div></div></div>);
}
