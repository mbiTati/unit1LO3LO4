# 📋 Mémo Module 03 — POO Fondamentaux

## Classe = Plan, Objet = Instance

```java
// CLASSE (le plan — dans son propre fichier .java)
public class Invention {
    private String nom;    // attribut
    private int annee;     // attribut
}

// OBJET (une instance — dans le main)
Invention tel = new Invention("Téléphone", 1876);
//        ↑                    ↑
//   variable              constructeur appelé
```

## Structure d'une classe complète

```
1. Attributs (private)
2. Constructeur (public, même nom que la classe)
3. Getters (public, retournent une valeur)
4. Setters (public, avec validation)
5. Méthodes métier
```

## Constructeur

```java
// Même nom que la classe, PAS de type de retour
public Invention(String nom, int annee) {
    this.nom = nom;       // this = cet objet
    this.annee = annee;   // nom = le paramètre
}
```

| ❌ Sans this | ✅ Avec this |
|---|---|
| `nom = nom;` → le paramètre s'assigne à lui-même | `this.nom = nom;` → l'attribut reçoit la valeur |
| L'attribut reste **null** | L'attribut est correctement initialisé |

## Getter et Setter

```java
// GETTER : lire un attribut private
public String getNom() {
    return this.nom;
}

// SETTER : modifier avec validation
public void setNom(String nom) {
    if (nom != null && !nom.isEmpty()) {
        this.nom = nom;
    }
    // Sinon : on ne fait rien (protection)
}
```

## Visibilité

| Mot-clé | Accès | Usage |
|---------|-------|-------|
| `private` | Uniquement dans la classe | **Attributs** (toujours !) |
| `public` | Partout | Constructeur, getters, setters, méthodes |
| `protected` | Classe + sous-classes | Héritage (Module 05) |

## ArrayList (liste dynamique)

```java
import java.util.ArrayList;

ArrayList<Invention> liste = new ArrayList<>();
liste.add(inv);              // Ajouter
liste.get(0);                // Accéder par index
liste.size();                // Nombre d'éléments
liste.remove(0);             // Supprimer par index

// Parcourir
for (Invention inv : liste) {
    inv.afficher();
}
```

## Comparaison de String

| ❌ Faux | ✅ Correct |
|---------|-----------|
| `nom == "Alice"` | `nom.equals("Alice")` |
| Compare les **références mémoire** | Compare le **contenu** |

## void vs return

| `void` | Type de retour (int, String...) |
|--------|-------------------------------|
| Fait une action | Calcule et renvoie un résultat |
| Pas de return | `return valeur;` obligatoire |
| `public void afficher()` | `public int getAge()` |

---
*CodeQuest — Le Labo de l'Inventeur — Module 03*
