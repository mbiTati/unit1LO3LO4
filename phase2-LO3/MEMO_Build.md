# Mémo M08 — Build & Deploy

## Pipeline
`.java` → javac → `.class` → jar → `.jar`

## Commandes
```bash
javac -d bin src/*.java            # compiler
echo "Main-Class: Main" > MANIFEST.MF
jar cfm App.jar MANIFEST.MF -C bin .  # packager
java -jar App.jar                  # exécuter
```

## Eclipse
File → Export → Runnable JAR file → sélectionner la classe Main
