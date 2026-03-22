# Mémo M09 — Debugging

## Outils Eclipse
- **Breakpoint** : double-clic marge gauche
- **Step Over (F6)** : ligne suivante
- **Step Into (F5)** : entrer dans la méthode
- **Step Return (F7)** : sortir de la méthode
- **Watch** : clic-droit variable → Watch

## Méthodologie
1. Lire le message d'erreur
2. Reproduire systématiquement
3. Isoler (diviser et conquérir)
4. Breakpoint AVANT le crash
5. Observer (Step + Watch)
6. Corriger et re-tester

## Types d'erreurs
- **Compilation** : syntaxe → Eclipse souligne en rouge
- **Runtime** : NullPointer, IndexOutOfBounds → plante à l'exécution
- **Logique** : résultat faux → la plus vicieuse
