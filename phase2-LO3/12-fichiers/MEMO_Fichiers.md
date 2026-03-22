# Mémo M12 — Fichiers & Crypto

## Écrire
```java
try (PrintWriter pw = new PrintWriter(new FileWriter("data.txt"))) {
    pw.println("ligne");
}
```

## Lire
```java
try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    String ligne;
    while ((ligne = br.readLine()) != null) {
        System.out.println(ligne);
    }
}
```

## CSV
`split(";")` pour découper. Première ligne = en-tête.

## SHA-256
```java
MessageDigest md = MessageDigest.getInstance("SHA-256");
byte[] hash = md.digest(texte.getBytes("UTF-8"));
```
Irréversible, déterministe, effet avalanche.
