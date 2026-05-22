export type LoginStoryPromo = {
  id: string;
  imageSrc: string;
  /** Crop focus for composite or wide assets (e.g. Scotland card screenshot). */
  imagePosition?: string;
  href: string;
  eyebrowKey: string;
  titleKey: string;
};

export const loginStoryPromos: LoginStoryPromo[] = [
  {
    id: "danilo",
    imageSrc: "/stories/danilo-brazil.png",
    href: "https://www.fifa.com/en/articles/danilo-brazil-interview",
    eyebrowKey: "danilo",
    titleKey: "danilo",
  },
  {
    id: "match-schedule",
    imageSrc: "/stories/match-schedule.png",
    href: "https://www.fifa.com/en/articles/match-schedule-fixtures-results-teams-stadiums",
    eyebrowKey: "matchSchedule",
    titleKey: "matchSchedule",
  },
  {
    id: "steve-clarke",
    imageSrc: "/stories/steve-clarke.png",
    imagePosition: "85% center",
    href: "https://www.fifa.com/en/articles/steve-clarke-scotland-interview",
    eyebrowKey: "steveClarke",
    titleKey: "steveClarke",
  },
  {
    id: "squad-announcements",
    imageSrc: "/stories/squad-announcements.png",
    href: "https://www.fifa.com/en/articles/all-world-cup-squad-announcements",
    eyebrowKey: "squadAnnouncements",
    titleKey: "squadAnnouncements",
  },
  {
    id: "panini",
    imageSrc: "/stories/panini-app.png",
    href: "https://www.fifa.com/en/articles/fifa-panini-collection-app",
    eyebrowKey: "panini",
    titleKey: "panini",
  },
  {
    id: "england-squad",
    imageSrc: "/stories/england-squad.png",
    href: "https://www.fifa.com/en/articles/england-squad-named-thomas-tuchel",
    eyebrowKey: "englandSquad",
    titleKey: "englandSquad",
  },
] as const;
