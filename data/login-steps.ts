export type LoginStep = {
  id: string;
  imageSrc: string;
  copyKey: string;
};

export const loginSteps: LoginStep[] = [
  {
    id: "draft",
    imageSrc: "/steps/Step1-flush.png",
    copyKey: "draft",
  },
  {
    id: "earn-points",
    imageSrc: "/steps/Step2-points.png",
    copyKey: "earnPoints",
  },
  {
    id: "world-cup",
    imageSrc: "/steps/Step3-champion.png",
    copyKey: "worldCup",
  },
];
