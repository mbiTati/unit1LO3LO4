# Mémo M14 — Swing & Events

## Composants
- **JFrame** : fenêtre principale
- **JButton** : bouton cliquable
- **JLabel** : texte non éditable
- **JTextField** : champ de saisie
- **JComboBox** : liste déroulante
- **JPanel** : sous-conteneur

## ActionListener
```java
btnOk.addActionListener(e -> {
    String nom = champNom.getText();
    lblResultat.setText("Bonjour " + nom);
});
```

## Layouts
- **FlowLayout** : gauche → droite (défaut JPanel)
- **BorderLayout** : 5 zones N/S/E/W/C (défaut JFrame)
- **GridLayout** : grille régulière

## Event-driven
Le programme ATTEND. L'utilisateur CLIQUE. Le Listener RÉAGIT.
