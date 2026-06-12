export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  company: string
  imageSrc: string
  imageAlt: string
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Wir haben kurzfristig Verstärkung für zwei Festival-Wochenenden gebraucht – die Kommunikation war klar, die Teams waren pünktlich.",
    name: "Lea M.",
    role: "Produktionsleitung",
    company: "Eventagentur (Berlin)",
    imageSrc:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Portrait einer Produktionsleiterin aus der Eventbranche",
  },
  {
    id: "2",
    quote:
      "Besonders hilfreich: ein Ansprechpartner, der operative Abläufe versteht – nicht nur „Personal stellen“, sondern mitdenken.",
    name: "Jonas K.",
    role: "Operations",
    company: "Messe- & Projektgeschäft",
    imageSrc:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Portrait eines Mitarbeiters aus dem Messe- und Projektgeschäft",
  },
  {
    id: "3",
    quote:
      "Ich suche flexible Einsätze neben dem Studium – die Abstimmung war unkompliziert, die Schichten transparent.",
    name: "Amina S.",
    role: "Studentin",
    company: "Pool-Mitarbeitende",
    imageSrc:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Portrait einer Studentin aus dem Yunity-Mitarbeiterpool",
  },
]
