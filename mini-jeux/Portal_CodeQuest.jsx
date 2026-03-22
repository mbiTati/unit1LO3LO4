import { useState, useEffect } from "react";

const C = {
  bg: "#0a0f1a", card: "#111827", primary: "#0D7377", secondary: "#14A3C7",
  accent: "#32E0C4", gold: "#F59E0B", text: "#e2e8f0", muted: "#94a3b8",
  dimmed: "#64748b", border: "#1e293b", success: "#10B981", danger: "#EF4444",
};

const PHASES = [
  {
    id: "phase1", title: "Phase 1 — Rattrapage", subtitle: "Les fondamentaux Java", color: C.accent,
    modules: [
      { id: "m01", title: "Conditions", desc: "if/else, switch, &&, ||", icon: "🔀", status: "ready",
        steps: ["Théorie conditions", "Jeu: Détecteur de Vérité", "Code guidé: AnalyseAge", "Exercice: Distributeur", "Correction + Mémo"] },
      { id: "m02", title: "Boucles", desc: "for, while, break, continue", icon: "🔄", status: "ready",
        steps: ["Théorie boucles", "Jeu: Simulateur de Boucles", "Code guidé: Stats", "Exercice: LaboStats", "Correction + Mémo"] },
      { id: "m03", title: "POO Fondamentaux", desc: "Classes, constructeur, getter/setter", icon: "🏗️", status: "ready",
        steps: ["Théorie OOP", "Jeu: Constructeur de Classes", "Code guidé: Invention", "Exercice: Catalogue", "Correction + Mémo"] },
      { id: "m04", title: "Manipulation Data", desc: "String, ArrayList, CRUD", icon: "📊", status: "ready",
        steps: ["Théorie String + ArrayList", "Jeu: Terminal CRUD", "Code guidé: Menu CRUD", "Exercice: Gestionnaire", "Correction + Mémo"] },
    ],
  },
  {
    id: "phase2", title: "Phase 2 — LO3 Implémentation", subtitle: "Construire un vrai projet", color: "#7C3AED",
    modules: [
      { id: "m05", title: "Héritage", desc: "extends, super, protected, polymorphisme", icon: "🧬", status: "coming" },
      { id: "m06", title: "Projet en équipe", desc: "Git, sprints, code reviews", icon: "👥", status: "coming" },
      { id: "m07", title: "Sécurité", desc: "Validation, exceptions, null safety", icon: "🔒", status: "coming" },
      { id: "m08", title: "Build & Deploy", desc: "JAR, GitHub release", icon: "🚀", status: "coming" },
    ],
  },
  {
    id: "phase3", title: "Phase 3 — LO4 Debugging", subtitle: "Qualité et standards", color: C.danger,
    modules: [
      { id: "m09", title: "Debugging IDE", desc: "Breakpoints, watch, tracing", icon: "🔍", status: "coming" },
      { id: "m10", title: "Standards", desc: "Conventions, Javadoc, code propre", icon: "📏", status: "coming" },
      { id: "m11", title: "Escape Room", desc: "Chasse aux bugs gamifiée", icon: "🏃", status: "coming" },
      { id: "m12", title: "Fichiers & Crypto", desc: "SHA, lecture/écriture fichiers", icon: "📁", status: "coming" },
      { id: "m13", title: "Base de données", desc: "JDBC, MySQL, CSV", icon: "🗄️", status: "coming" },
    ],
  },
];

const HOW_TO = [
  { title: "1. Ouvrez un module", desc: "Cliquez sur un module ci-dessous. Il s'ouvre directement dans Claude.ai comme un cours interactif.", icon: "👆" },
  { title: "2. Suivez les étapes", desc: "Théorie → Quiz → Jeu → Code guidé (à taper dans Eclipse) → Exercice autonome → Correction.", icon: "📖" },
  { title: "3. Codez dans Eclipse", desc: "Quand le cours dit 'À faire dans Eclipse', ouvrez Eclipse et tapez le code. Ne copiez pas — tapez !", icon: "💻" },
  { title: "4. Faites l'exercice seul", desc: "L'exercice autonome est à faire AVANT de regarder la correction. Testez votre code avec les cas de test.", icon: "✍️" },
  { title: "5. Débloquez le mémo", desc: "Quand toutes les étapes sont terminées, le mémo récapitulatif se débloque. Gardez-le comme aide-mémoire.", icon: "📋" },
  { title: "6. Soumettez votre travail", desc: "Exportez votre projet Eclipse et envoyez-le à votre enseignant, ou poussez sur GitHub.", icon: "📤" },
];

export default function Portal() {
  const [expanded, setExpanded] = useState(null);

  const launch = (moduleId) => {
    const names = {
      m01: "M01_Unified_Conditions", m02: "M02_Unified_Boucles",
      m03: "M03_Unified_OOP", m04: "M04_Unified_Data",
    };
    if (names[moduleId]) {
      sendPrompt(`Ouvre le module ${names[moduleId]} s'il te plaît`);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* HEADER */}
      <div style={{ padding: "24px 20px 16px", textAlign: "center", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.dimmed, marginBottom: 4 }}>BTEC HND UNIT 1 · PROGRAMMING</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.accent }}>CODEQUEST</div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>Le Labo de l'Inventeur — LO3 & LO4</div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px" }}>

        {/* HOW TO */}
        <div style={{ marginBottom: 28, animation: "fadeIn .4s ease-out" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, letterSpacing: 1, marginBottom: 12 }}>COMMENT ÇA MARCHE ?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
            {HOW_TO.map((h, i) => (
              <div key={i} style={{
                background: C.card, borderRadius: 10, padding: "12px 14px",
                border: `1px solid ${C.border}`, animation: `fadeIn .4s ease-out ${i * 60}ms both`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{h.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{h.title}</span>
                </div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{h.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PRÉREQUIS */}
        <div style={{
          background: C.primary + "15", borderRadius: 10, padding: "12px 16px",
          border: `1px solid ${C.primary}40`, marginBottom: 24,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 6 }}>PRÉREQUIS</div>
          <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>
            <strong>JDK 17+</strong> installé (adoptium.net) · <strong>Eclipse IDE</strong> for Java Developers (eclipse.org) · Un compte GitHub (github.com)
          </div>
        </div>

        {/* PHASES & MODULES */}
        {PHASES.map((phase, pi) => (
          <div key={phase.id} style={{ marginBottom: 24, animation: `fadeIn .4s ease-out ${pi * 100}ms both` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 4, height: 28, borderRadius: 2, background: phase.color }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: phase.color }}>{phase.title}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{phase.subtitle}</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 14 }}>
              {phase.modules.map((mod, mi) => {
                const isReady = mod.status === "ready";
                const isExpanded = expanded === mod.id;
                return (
                  <div key={mod.id}>
                    <div
                      onClick={() => setExpanded(isExpanded ? null : mod.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "12px 14px", borderRadius: 10,
                        background: C.card, border: `1px solid ${isReady ? phase.color + "30" : C.border}`,
                        cursor: "pointer", transition: "all .2s",
                        opacity: isReady ? 1 : 0.5,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{mod.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isReady ? C.text : C.dimmed }}>{mod.title}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{mod.desc}</div>
                      </div>
                      {isReady ? (
                        <button onClick={(e) => { e.stopPropagation(); launch(mod.id); }} style={{
                          padding: "6px 14px", borderRadius: 7, border: "none",
                          background: phase.color, color: C.bg, cursor: "pointer",
                          fontFamily: "inherit", fontSize: 11, fontWeight: 700,
                        }}>Lancer</button>
                      ) : (
                        <span style={{ fontSize: 10, color: C.dimmed, padding: "4px 10px", borderRadius: 10, background: C.border }}>Bientôt</span>
                      )}
                    </div>
                    {isExpanded && mod.steps && (
                      <div style={{ paddingLeft: 44, paddingTop: 6, animation: "fadeIn .2s" }}>
                        {mod.steps.map((step, si) => (
                          <div key={si} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", fontSize: 11, color: C.muted }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.border, flexShrink: 0 }} />
                            {step}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* FOOTER */}
        <div style={{ textAlign: "center", padding: "20px 0", borderTop: `1px solid ${C.border}`, marginTop: 20 }}>
          <div style={{ fontSize: 11, color: C.dimmed }}>CodeQuest — Le Labo de l'Inventeur</div>
          <div style={{ fontSize: 10, color: C.dimmed, marginTop: 4 }}>BTEC HND Unit 1: Programming · Java · Eclipse</div>
        </div>
      </div>
    </div>
  );
}
