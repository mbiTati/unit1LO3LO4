# 📋 Mémo Module 02 — Boucles en Java

## for (nombre de tours connu)
```java
for (int i = 0; i < 10; i++) {
    // s'exécute 10 fois (i = 0,1,2,...,9)
}
```
| Partie | Rôle | Exemple |
|--------|------|---------|
| `int i = 0` | Initialisation | Commence à 0 |
| `i < 10` | Condition | Continue tant que vrai |
| `i++` | Incrément | +1 à chaque tour |

## for-each (parcourir sans index)
```java
for (String nom : tableau) {
    System.out.println(nom);
}
```

## while (nombre de tours inconnu)
```java
while (condition) {
    // s'exécute tant que condition est true
    // ⚠️ Quelque chose doit changer pour que condition devienne false !
}
```

## do-while (au moins 1 fois)
```java
do {
    // s'exécute au moins 1 fois
} while (condition);  // ← point-virgule !
```

## break et continue
| Mot-clé | Effet |
|---------|-------|
| `break` | Sort immédiatement de la boucle |
| `continue` | Saute au tour suivant |

## Pièges fréquents

| Piège | Conséquence |
|-------|-------------|
| Oublier de modifier la variable dans while | Boucle infinie ! |
| `i <= 10` au lieu de `i < 10` | 11 tours au lieu de 10 |
| `.length` (tableau) vs `.length()` (String) | Erreur compilation |
| `.size()` (ArrayList) | Pas .length ! |

---
*CodeQuest — Module 02*
