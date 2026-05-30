export type LoginStep = {
  id: string;
  imageSrc: string;
  copyKey: string;
};

export const loginSteps: LoginStep[] = [
  {
    id: "draft",
    imageSrc: "/steps/step1-flush.png",
    copyKey: "draft",
  },
  {
    id: "earn-points",
    imageSrc: "/steps/step2-points.png",
    copyKey: "earnPoints",
  },
  {
    id: "world-cup",
    imageSrc: "/steps/step3-champion.png",
    copyKey: "worldCup",
  },
];
