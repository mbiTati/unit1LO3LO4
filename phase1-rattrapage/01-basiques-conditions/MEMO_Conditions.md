# 📋 Mémo Module 01 — Conditions en Java

## Opérateurs de comparaison

| Opérateur | Signification | Exemple | Résultat |
|-----------|--------------|---------|----------|
| `==` | Égal | `5 == 5` | `true` |
| `!=` | Différent | `5 != 3` | `true` |
| `>` | Plus grand | `5 > 3` | `true` |
| `<` | Plus petit | `5 < 3` | `false` |
| `>=` | Plus grand ou égal | `5 >= 5` | `true` |
| `<=` | Plus petit ou égal | `3 <= 5` | `true` |

## if / else if / else

```java
if (condition1) {
    // Si condition1 est true
} else if (condition2) {
    // Si condition1 est false ET condition2 est true
} else {
    // Si aucune condition n'est true
}
```

## Opérateurs logiques

| Opérateur | Nom | Règle | Exemple |
|-----------|-----|-------|---------|
| `&&` | ET (AND) | Les DEUX doivent être true | `age >= 18 && aPermis` |
| `\|\|` | OU (OR) | AU MOINS UN doit être true | `age < 12 \|\| age > 65` |
| `!` | NON (NOT) | Inverse la valeur | `!estFerme` |

### Table de vérité

| A | B | A && B | A \|\| B | !A |
|---|---|--------|----------|----|
| true | true | **true** | **true** | false |
| true | false | false | **true** | false |
| false | true | false | **true** | true |
| false | false | false | false | true |

## switch / case

```java
switch (variable) {
    case valeur1:
        // code
        break;      // ⚠️ OBLIGATOIRE !
    case valeur2:
        // code
        break;
    default:
        // si aucun case ne correspond
}
```

**⚠️ Sans `break`, le programme continue dans le case suivant ! (fall-through)**

## Pièges fréquents

| Piège | ❌ Faux | ✅ Correct |
|-------|---------|-----------|
| Comparer des String | `nom == "Alice"` | `nom.equals("Alice")` |
| Oublier le break | `case 1: code` | `case 1: code; break;` |
| = vs == | `if (x = 5)` | `if (x == 5)` |
| Accolades oubliées | `if (x>0) a(); b();` | `if (x>0) { a(); b(); }` |

## Scanner : lire les entrées utilisateur

```java
import java.util.Scanner;

Scanner sc = new Scanner(System.in);
int nombre = sc.nextInt();       // Lire un entier
double decimal = sc.nextDouble(); // Lire un décimal
String texte = sc.next();        // Lire un mot
String ligne = sc.nextLine();    // Lire une ligne entière
sc.close();                      // Toujours fermer !
```

---
*CodeQuest — Le Labo de l'Inventeur — Module 01*
