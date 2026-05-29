export type LoginStep = {
  id: string;
  imageSrc: string;
  copyKey: string;
};

export const loginSteps: LoginStep[] = [
  {
    id: "draft",
    imageSrc: "/steps/step1.png",
    copyKey: "draft",
  },
  {
    id: "earn-points",
    imageSrc: "/steps/step2.png",
    copyKey: "earnPoints",
  },
  {
    id: "world-cup",
    imageSrc: "/steps/step3.png",
    copyKey: "worldCup",
  },
];
