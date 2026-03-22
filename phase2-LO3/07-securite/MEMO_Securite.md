# Mémo M07 — Sécurité

## try / catch / finally
```java
try {
    int n = Integer.parseInt(input);
} catch (NumberFormatException e) {
    System.out.println("Pas un nombre !");
} finally {
    System.out.println("Toujours exécuté");
}
```

## 3 niveaux de validation
1. **Pas null / pas vide** : `if (nom == null || nom.trim().isEmpty())`
2. **Bon type** : try-catch sur parseInt, parseDouble
3. **Valeur réaliste** : `if (age < 0 || age > 150)`

## Attention
- **NullPointerException** = erreur #1. Toujours vérifier `!= null` AVANT
- **Ne jamais stocker un mot de passe en clair** → SHA-256
- **throw** pour signaler une erreur : `throw new IllegalArgumentException("msg")`
