# 📋 Mémo Module 04 — Manipulation de Données

## String : méthodes essentielles

| Méthode | Retour | Exemple | Résultat |
|---------|--------|---------|----------|
| `.length()` | int | `"Hello".length()` | 5 |
| `.toUpperCase()` | String | `"abc".toUpperCase()` | "ABC" |
| `.toLowerCase()` | String | `"ABC".toLowerCase()` | "abc" |
| `.substring(d, f)` | String | `"Hello".substring(1,4)` | "ell" |
| `.contains(s)` | boolean | `"Hello".contains("ell")` | true |
| `.indexOf(s)` | int | `"Hello".indexOf("l")` | 2 |
| `.startsWith(s)` | boolean | `"Hello".startsWith("He")` | true |
| `.replace(a, b)` | String | `"abc".replace("a","x")` | "xbc" |
| `.split(sep)` | String[] | `"a,b,c".split(",")` | ["a","b","c"] |
| `.charAt(i)` | char | `"Hello".charAt(0)` | 'H' |
| `.equals(s)` | boolean | `"abc".equals("abc")` | true |
| `.trim()` | String | `" abc ".trim()` | "abc" |

⚠️ **Les String sont immuables** : `.toUpperCase()` retourne un NOUVEAU String, ne modifie pas l'original.

⚠️ **Comparer des String** : toujours `.equals()`, JAMAIS `==`

## ArrayList CRUD

```java
import java.util.ArrayList;
ArrayList<String> list = new ArrayList<>();
```

| Opération | Méthode | Exemple |
|-----------|---------|---------|
| **C**reate | `.add(elem)` | `list.add("Tesla")` |
| **R**ead | `.get(index)` | `list.get(0)` → "Tesla" |
| **U**pdate | `.set(index, elem)` | `list.set(0, "Curie")` |
| **D**elete | `.remove(index)` ou `.remove(elem)` | `list.remove("Tesla")` |

| Utilitaire | Méthode |
|-----------|---------|
| Taille | `.size()` |
| Est vide ? | `.isEmpty()` |
| Contient ? | `.contains("Tesla")` |
| Index de | `.indexOf("Tesla")` → -1 si absent |

## Scanner : le piège nextInt/nextLine

```java
int choix = sc.nextInt();
sc.nextLine();  // ← OBLIGATOIRE pour consommer le \n
String nom = sc.nextLine();  // Maintenant ça marche
```

Sans le `sc.nextLine()` après `nextInt()`, la lecture suivante sera vide !

---
*CodeQuest — Module 04*
