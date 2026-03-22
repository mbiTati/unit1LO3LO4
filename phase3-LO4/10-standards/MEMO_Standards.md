# Mémo M10 — Standards de Codage

## Conventions Java
- **Classe** : PascalCase → `InventionManager`
- **Méthode / variable** : camelCase → `calculerPrix`
- **Constante** : UPPER_SNAKE_CASE → `MAX_SIZE`
- **Package** : minuscules → `com.labo.inventions`

## Javadoc
```java
/**
 * Description courte.
 * @param nom le paramètre
 * @return la valeur retournée
 * @throws Exception si erreur
 */
```

## Bonnes pratiques
- Méthodes courtes (< 20 lignes)
- Noms descriptifs (pas de x, n, tmp)
- **Ctrl+Shift+F** = formatage automatique Eclipse
- Commenter POURQUOI, pas QUOI
