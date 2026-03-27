export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  company: string
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Wir haben kurzfristig Verstärkung für zwei Festival-Wochenenden gebraucht – die Kommunikation war klar, die Teams waren pünktlich.",
    name: "Lea M.",
    role: "Produktionsleitung",
    company: "Eventagentur (Berlin)",
  },
  {
    id: "2",
    quote:
      "Besonders hilfreich: ein Ansprechpartner, der operative Abläufe versteht – nicht nur „Personal stellen“, sondern mitdenken.",
    name: "Jonas K.",
    role: "Operations",
    company: "Messe- & Projektgeschäft",
  },
  {
    id: "3",
    quote:
      "Ich suche flexible Einsätze neben dem Studium – die Abstimmung war unkompliziert, die Schichten transparent.",
    name: "Amina S.",
    role: "Studentin",
    company: "Pool-Mitarbeitende",
  },
]
