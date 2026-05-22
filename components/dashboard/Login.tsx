"use client";

import { useState } from "react";
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

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.shellTop}>
          <SiteHeader className={styles.shellHeader} />
        </div>

        <section className={styles.heroBand} aria-label={t("login.heroRegion")}>
          <HeroSection
            user={userDashboard}
            showLiveFeed={false}
            loginHero
            className={styles.heroPhoto}
          />
          <div className={styles.formOverlay}>
            <LoginHeroPrompt onSignIn={() => setLoginOpen(true)} />
          </div>
        </section>

        <LoginUpcomingMatches />

        <LoginStoryPromos />

        <LoginSiteFooter />
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
