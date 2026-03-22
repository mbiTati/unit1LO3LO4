# Mémo M13 — Base de Données

## Connexion JDBC
```java
Connection conn = DriverManager.getConnection(url, user, pass);
```

## PreparedStatement (TOUJOURS !)
```java
String sql = "INSERT INTO inventions (nom, annee) VALUES (?, ?)";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, "Téléphone");
ps.setInt(2, 1876);
ps.executeUpdate();  // INSERT/UPDATE/DELETE
// ou ps.executeQuery() pour SELECT → retourne ResultSet
```

## Pattern DAO
1 classe = tout l'accès données. Le Main appelle `dao.getTout()`, jamais de SQL direct.

## ATTENTION
JAMAIS concaténer les entrées dans du SQL → **injection SQL** !
