"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { userDashboard } from "@/data/dashboard-seed";
import { LoginHeroPrompt } from "@/components/auth/LoginHeroPrompt";
import { LoginModal } from "@/components/auth/LoginModal";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { LoginSiteFooter } from "@/components/dashboard/LoginSiteFooter";
import { LoginStoryPromos } from "@/components/dashboard/LoginStoryPromos";
import { LoginUpcomingMatches } from "@/components/dashboard/LoginUpcomingMatches";
import { SiteHeader } from "@/components/dashboard/SiteHeader";
import { t } from "@/lib/i18n/t";
import styles from "./Login.module.scss";

export function Login() {
  const [loginOpen, setLoginOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const heroArtRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const heroArt = heroArtRef.current;
    if (!page || !heroArt) return;

    const syncHeroHeight = () => {
      const height = Math.round(heroArt.getBoundingClientRect().height);
      if (height > 0) {
        page.style.setProperty("--hero-photo-rendered-height", `${height}px`);
      }
    };

    syncHeroHeight();
    const observer = new ResizeObserver(syncHeroHeight);
    observer.observe(heroArt);
    window.addEventListener("resize", syncHeroHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeroHeight);
    };
  }, []);

  return (
    <div ref={pageRef} className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.heroBand} aria-label={t("login.heroRegion")}>
          <div className={styles.heroHeader}>
            <SiteHeader brand="login" className={styles.shellHeader} />
          </div>
          <div ref={heroArtRef} className={styles.heroArtWrap}>
            <HeroSection
              user={userDashboard}
              showLiveFeed={false}
              loginHero
              className={styles.heroPhoto}
            />
          </div>
          <div className={styles.heroContentShell}>
            <div className={styles.heroContent}>
              <LoginHeroPrompt onSignIn={() => setLoginOpen(true)} />
            </div>
          </div>
        </section>

        <LoginUpcomingMatches />

        <div className={styles.contentRail}>
          <LoginStoryPromos />
        </div>

        <LoginSiteFooter />
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
