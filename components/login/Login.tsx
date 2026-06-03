"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { userDashboard } from "@/data/dashboard-seed";
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";
import { LoginHeroPrompt } from "@/components/auth/LoginHeroPrompt";
import { LoginModal } from "@/components/auth/LoginModal";
import { SignUpModal } from "@/components/auth/SignUpModal";
import { HeroSection } from "@/components/shared/HeroSection";
import { LoginSiteFooter } from "@/components/login/LoginSiteFooter";
import { LoginSteps } from "@/components/login/LoginSteps";
import { LoginStoryPromos } from "@/components/login/LoginStoryPromos";
import { LoginUpcomingMatches } from "@/components/login/LoginUpcomingMatches";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { TodayMatchesStrip } from "@/components/shared/TodayMatchesStrip";
import { t } from "@/lib/i18n/t";
import styles from "./Login.module.scss";

export function Login() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  const openSignIn = useCallback(() => {
    setSignUpOpen(false);
    setLoginOpen(true);
  }, []);

  const openSignUp = useCallback(() => {
    setLoginOpen(false);
    setSignUpOpen(true);
  }, []);
  const pageRef = useRef<HTMLDivElement>(null);
  const heroContentShellRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroArtRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    const heroContentShell = heroContentShellRef.current;
    const heroContent = heroContentRef.current;
    const heroArt = heroArtRef.current;
    if (!page || !heroContentShell || !heroContent || !heroArt) return;

    const measurePhotoBandHeight = () => {
      const section = heroArt.firstElementChild;
      if (section instanceof HTMLElement) {
        return Math.round(section.getBoundingClientRect().height);
      }
      return Math.round(heroArt.getBoundingClientRect().height);
    };

    const syncHeroHeight = () => {
      const photoBandHeight = measurePhotoBandHeight();
      if (photoBandHeight <= 0) return;

      page.style.setProperty("--hero-photo-rendered-height", `${photoBandHeight}px`);

      const card = heroContent.firstElementChild;
      const cardHeight = card instanceof HTMLElement
        ? Math.round(card.getBoundingClientRect().height)
        : 0;

      const computedContent = window.getComputedStyle(heroContent);
      const contentBottom = Number.parseFloat(computedContent.paddingBottom) || 0;
      const topStart = Number.parseFloat(
        window.getComputedStyle(page).getPropertyValue("--login-hero-card-top-start")
      ) || 0;

      const overlayHeight = Math.max(
        photoBandHeight,
        Math.ceil(cardHeight + contentBottom + photoBandHeight * topStart)
      );

      page.style.setProperty("--hero-overlay-height", `${overlayHeight}px`);
    };

    syncHeroHeight();
    const observer = new ResizeObserver(syncHeroHeight);
    observer.observe(heroContentShell);
    observer.observe(heroContent);
    observer.observe(heroArt);
    window.addEventListener("resize", syncHeroHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeroHeight);
    };
  }, []);

  return (
    <RedirectIfAuthenticated>
    <div ref={pageRef} className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.heroBand} aria-label={t("login.heroRegion")}>
          <div className={styles.heroHeader}>
            <TodayMatchesStrip />
            <div className={styles.pageGutter}>
              <div className={styles.pageColumn}>
                <SiteHeader brand="login" className={styles.shellHeader} />
              </div>
            </div>
          </div>
          <div className={styles.heroContentWrapper}>
            <div className={styles.heroBrand} aria-hidden="true">
              <Image
                src="/wcc-words-logo.png"
                alt=""
                width={512}
                height={256}
                className={styles.heroBrandImg}
                priority
                unoptimized
              />
            </div>
            <div ref={heroContentShellRef} className={styles.heroContentShell}>
              <div className={styles.pageGutter}>
                <div className={styles.pageColumn}>
                  <div ref={heroContentRef} className={styles.heroContent}>
                    <LoginHeroPrompt
                      onSignIn={() => setLoginOpen(true)}
                      onSignUp={() => setSignUpOpen(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div ref={heroArtRef} className={styles.heroArtWrap}>
              <HeroSection
                user={userDashboard}
                showLiveFeed={false}
                loginHero
                className={styles.heroPhoto}
              />
            </div>
          </div>
        </section>

        <div className={styles.pageGutter}>
          <div className={styles.pageColumn}>
            <LoginSteps onSignIn={openSignIn} />
          </div>
        </div>

        <div className={styles.pageGutter}>
          <div className={styles.pageColumn}>
            <LoginUpcomingMatches />
          </div>
        </div>

        <div className={styles.pageGutter}>
          <div className={styles.pageColumn}>
            <LoginStoryPromos />
          </div>
        </div>

        <div className={styles.pageGutter}>
          <div className={styles.pageColumn}>
            <LoginSiteFooter />
          </div>
        </div>
      </div>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onRequestSignUp={openSignUp}
      />
      <SignUpModal
        open={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onRequestSignIn={openSignIn}
      />
    </div>
    </RedirectIfAuthenticated>
  );
}
