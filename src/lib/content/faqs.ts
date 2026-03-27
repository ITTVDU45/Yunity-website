export interface FaqItem {
  id: string
  question: string
  answer: string
}

export const homeFaqs: FaqItem[] = [
  {
    id: "1",
    question: "Wie schnell kann Personal bereitstehen?",
    answer:
      "Je nach Qualifikation und Region in der Regel innerhalb weniger Werktage – bei definierten Rahmenbedingungen oft noch schneller. Für wiederkehrende Formate planen wir gemeinsam eine Vorlaufzeit, die zu Ihrem Kalender passt.",
  },
  {
    id: "2",
    question: "Welche Qualifikationen bringen die Mitarbeitenden mit?",
    answer:
      "Wir matchen nach Rolle: Erfahrung in Service, Promotion oder Logistik ist je nach Einsatz relevant – und wird transparent dokumentiert. Spezialprofile (z. B. Hygiene, Sicherheit) klären wir im Vorfeld.",
  },
  {
    id: "3",
    question: "Wie läuft die Abrechnung und Organisation?",
    answer:
      "Wir definieren Leistungsumfang, Zeiten und Ansprechpartner:innen – damit Sie planbar bleiben. Details stimmen wir im Rahmen Ihrer Anfrage individuell ab.",
  },
  {
    id: "4",
    question: "Kann ich auch nur für ein einzelnes Event buchen?",
    answer:
      "Ja. Wir sind auf kurzfristige und projektbezogene Einsätze ausgelegt – von einzelnen Tagen bis zu längeren Serien.",
  },
]

export const contactFaqs: FaqItem[] = [
  {
    id: "c1",
    question: "Wann erhalte ich Rückmeldung?",
    answer:
      "Typischerweise innerhalb von 1–2 Werktagen. Bei dringenden Einsätzen: Bitte kurz im Betreff oder Telefonnummer angeben – wir priorisieren.",
  },
  {
    id: "c2",
    question: "Einsatzgebiete – wo sind Sie aktiv?",
    answer:
      "Regionale Verfügbarkeit hängt von Projekt und Bedarf ab. Nennen Sie uns Ort und Zeitraum – dann sagen wir direkt, was realistisch ist.",
  },
]
