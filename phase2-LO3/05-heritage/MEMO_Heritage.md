# Mémo M05 — Héritage

## extends
```java
public class InvLogicielle extends Invention { ... }
```

## super() — OBLIGATOIRE en 1ère ligne du constructeur
```java
public InvLogicielle(String nom, int annee, String lang) {
    super(nom, annee); // appelle le constructeur parent
    this.langage = lang;
}
```

## protected — visible par les classes enfants
## @Override — redéfinir une méthode du parent
```java
@Override
public String decrire() {
    return nom + " en " + langage; // comportement spécialisé
}
```

## Polymorphisme
Même méthode `decrire()`, comportement différent selon le type réel de l'objet.
