"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthControls } from "./AuthControls";
import { PAGES, load, normalize, save } from "./constants";
import {
  ArcadePage,
  CasinoPage,
  ForgePage,
  MarketPage,
  ProfilePage,
  ShopPage,
  ToolsPage,
} from "./GeniePages";
import {
  fridayWeekKey,
  getDailySpotlight,
  getFridayWishId,
  isFridayLA,
} from "./dailySpotlight";
import {
  INVITE_TC,
  ensureInviteCode,
  inviteUrl,
  readInviteFromUrl,
  stripInviteFromUrl,
} from "./inviteLoop";
import { useCloudLampStandalone } from "./useCloudLampStandalone";
import { useGenie } from "./useGenie";
import { WanderingLamp } from "./WanderingLamp";
import { getWishPack, getWishTool } from "./wishCatalog";

export default function GenieApp() {
  const g = useGenie();
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  const dailyId = useMemo(() => getDailySpotlight().id, []);

  // Invite redeem + scout deep-link once ready
  useEffect(() => {
    if (!g.ready) return;
    // Ensure invite code exists on this lamp
    try {
      const code = ensureInviteCode();
      let state = normalize(load());
      if (!state.inviteCode) {
        state = { ...state, inviteCode: code };
        save(state);
      }
    } catch {}

    const invite = readInviteFromUrl();
    if (invite) {
      let state = normalize(load());
      const mine = (state.inviteCode || ensureInviteCode()).toUpperCase();
      if (state.inviteClaimed) {
        g.setMsg("Invite already claimed on this lamp.");
      } else if (invite === mine) {
        g.setMsg("Cannot redeem your own invite.");
      } else {
        state = {
          ...state,
          coins: state.coins + INVITE_TC,
          referredBy: invite,
          inviteClaimed: true,
          freeForge: (state.freeForge || 0) + 1,
          inviteCode: state.inviteCode || ensureInviteCode(),
        };
        save(state);
        g.setMsg(
          `Invite redeemed · +${INVITE_TC} TC · +1 free forge. Refreshing…`
        );
        stripInviteFromUrl();
        setTimeout(() => location.reload(), 400);
        return;
      }
      stripInviteFromUrl();
    }

    try {
      const scout = sessionStorage.getItem("tg_scout_wish");
      if (scout) {
        sessionStorage.removeItem("tg_scout_wish");
        setSpotlightId(scout);
      }
    } catch {}
  }, [g.ready]);

  const onWishBuy = (wishId: string) => {
    const wish = getWishTool(wishId);
    if (!wish) {
      g.setMsg("Unknown wish.");
      return;
    }
    let state = normalize(load());
    if (state.tools.some((t) => t.freeId === wish.id)) {
      g.setMsg("Already unlocked.");
      return;
    }
    if (state.coins < wish.cost) {
      g.setMsg("Need " + wish.cost + " TC.");
      return;
    }
    state = {
      ...state,
      coins: state.coins - wish.cost,
      tools: [
        {
          n: wish.n,
          r: wish.tier === "djinn" ? "djinn" : "wish",
          t: Date.now(),
          freeId: wish.id,
        },
        ...state.tools,
      ],
      page: "tools",
    };
    save(state);
    g.setMsg("Unlocked · " + wish.n + " · " + wish.cost + " TC.");
    location.reload();
  };

  const onFridayClaim = () => {
    if (!isFridayLA()) {
      g.setMsg("Free Wish Friday only runs Friday in America/Los_Angeles.");
      return;
    }
    const wishId = getFridayWishId();
    const wish = getWishTool(wishId);
    if (!wish) {
      g.setMsg("Friday wish missing.");
      return;
    }
    let state = normalize(load());
    const week = fridayWeekKey();
    if (state.fridayClaimWeek === week) {
      g.setMsg("Already claimed this Friday week (" + week + ").");
      return;
    }
    if (state.tools.some((t) => t.freeId === wish.id)) {
      // Still mark claimed so they don't double-dip another Friday tool? Spec: one unlock per Friday.
      state = { ...state, fridayClaimWeek: week };
      save(state);
      g.setMsg("You already own " + wish.n + ". Friday claim marked.");
      location.reload();
      return;
    }
    state = {
      ...state,
      fridayClaimWeek: week,
      tools: [
        {
          n: wish.n,
          r: "wish",
          t: Date.now(),
          freeId: wish.id,
        },
        ...state.tools,
      ],
      page: "tools",
    };
    save(state);
    g.setMsg("Free Wish Friday · unlocked " + wish.n + " · 0 TC.");
    location.reload();
  };

  const onWishPackBuy = (packId: string) => {
    const pack = getWishPack(packId);
    if (!pack) {
      g.setMsg("Unknown pack.");
      return;
    }
    let state = normalize(load());
    if ((state.ownedPacks || []).includes(pack.id)) {
      g.setMsg("Already own this pack.");
      return;
    }
    if (state.coins < pack.cost) {
      g.setMsg("Need " + pack.cost + " TC.");
      return;
    }
    state = {
      ...state,
      coins: state.coins - pack.cost,
      ownedPacks: [...(state.ownedPacks || []), pack.id],
      page: "tools",
    };
    save(state);
    g.setMsg("Pack sealed · " + pack.n);
    location.reload();
  };

  const installWishPackTool = (packId: string, toolId: string) => {
    const pack = getWishPack(packId);
    if (!pack || !pack.toolIds.includes(toolId)) {
      g.setMsg("Tool not in this pack.");
      return;
    }
    let state = normalize(load());
    if (!(state.ownedPacks || []).includes(packId)) {
      g.setMsg("Buy the pack first.");
      return;
    }
    if (state.tools.some((t) => t.freeId === toolId)) {
      g.setMsg("Already installed.");
      return;
    }
    const meta = getWishTool(toolId);
    if (!meta) {
      g.setMsg("Unknown tool.");
      return;
    }
    state = {
      ...state,
      tools: [
        { n: meta.n, r: "wish", t: Date.now(), freeId: toolId, packId },
        ...state.tools,
      ],
    };
    save(state);
    g.setMsg("Installed · " + meta.n);
    location.reload();
  };

  const syncStatus = useCloudLampStandalone();

  if (!g.ready) {
    return (
      <>
        <header>
          <div className="brand">2oolz Genie</div>
          <div className="right">
            <div className="coins">...</div>
          </div>
        </header>
        <main />
      </>
    );
  }

  const {
    S,
    msg,
    setMsg,
    payNote,
    lastDrip,
    need,
    setNeed,
    tick,
    wheelDeg,
    showSlots,
    reels,
    showDrop,
    dropBits,
    arcadeMode,
    hangWord,
    hangGuessed,
    hourly,
    free,
    hangMiss,
    hangShown,
    go,
    onForge,
    onMarketBuy,
    play,
    onDropClick,
    startHang,
    startTap,
    onTapHit,
    onHangGuess,
    claimLamp,
    deleteTool,
    addFreeTool,
    buyProcessPack,
    buyNudge,
    dismissBuyNudge,
    hilo,
    face52,
    extra,
  } = g;

  const myInvite = S.inviteCode || ensureInviteCode();

  return (
    <>
      <header>
        <div className="brand">2oolz Genie</div>
        <div className="right">
          <div className="coins">
            {Math.floor(S.coins)} TC . +{hourly}/h
          </div>
          {S.tools.length > 0 && (
            <button
              className="buy tools-shortcut"
              type="button"
              onClick={() => go("tools")}
            >
              Tools
            </button>
          )}
          <button className="buy" type="button" onClick={() => go("shop")}>
            Buy
          </button>
          <AuthControls syncStatus={syncStatus} />
        </div>
      </header>
      <nav>
        {PAGES.map((p) => (
          <button
            key={p}
            type="button"
            className={S.page === p ? "on" : ""}
            onClick={() => go(p)}
          >
            {p}
          </button>
        ))}
      </nav>
      <main>
        {buyNudge && (
          <div className="buy-nudge" role="status">
            <p>{buyNudge}</p>
            <div className="tool-actions">
              <button className="btn ghost" type="button" onClick={dismissBuyNudge}>
                Dismiss
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  dismissBuyNudge();
                  go("shop");
                }}
              >
                Open Shop
              </button>
              <button
                className="btn ghost"
                type="button"
                onClick={() => {
                  dismissBuyNudge();
                  go("tools");
                }}
              >
                Process packs
              </button>
            </div>
          </div>
        )}

        <WanderingLamp
          dailyFreeId={dailyId}
          fridayActive={isFridayLA()}
          onOpenWish={(id) => {
            try {
              sessionStorage.setItem("tg_scout_wish", id);
            } catch {}
            setSpotlightId(id);
            go("market");
            setMsg("Scout pointed at Market · " + id);
          }}
        />
        {S.page === "forge" && (
          <ForgePage
            S={S}
            msg={msg}
            setMsg={setMsg}
            hourly={hourly}
            lastDrip={lastDrip}
            need={need}
            setNeed={setNeed}
            tick={tick}
            onForge={onForge}
          />
        )}
        {S.page === "market" && (
          <MarketPage
            S={S}
            msg={msg}
            tick={tick}
            onMarketBuy={onMarketBuy}
            onWishBuy={onWishBuy}
            onWishPackBuy={onWishPackBuy}
            onFridayClaim={onFridayClaim}
            spotlightId={spotlightId || dailyId}
          />
        )}
        {S.page === "casino" && (
          <CasinoPage
            S={S}
            msg={msg}
            free={free}
            wheelDeg={wheelDeg}
            showSlots={showSlots}
            reels={reels}
            showDrop={showDrop}
            dropBits={dropBits}
            onPlay={play}
            onDropClick={onDropClick}
            hilo={hilo}
            face52={face52}
            extra={extra}
          />
        )}
        {S.page === "arcade" && (
          <ArcadePage
            msg={msg}
            arcadeMode={arcadeMode}
            hangWord={hangWord}
            hangGuessed={hangGuessed}
            hangMiss={hangMiss}
            hangShown={hangShown}
            startHang={startHang}
            startTap={startTap}
            onTapHit={onTapHit}
            onHangGuess={onHangGuess}
          />
        )}
        {S.page === "tools" && (
          <ToolsPage
            S={S}
            msg={msg}
            go={go}
            onDelete={deleteTool}
            addFreeTool={addFreeTool}
            buyProcessPack={buyProcessPack}
            installWishPackTool={installWishPackTool}
            onWishBuy={onWishBuy}
          />
        )}
        {S.page === "shop" && (
          <ShopPage S={S} msg={msg} setMsg={setMsg} payNote={payNote} />
        )}
        {S.page === "profile" && (
          <ProfilePage
            S={S}
            hourly={hourly}
            goShop={() => go("shop")}
            claimLamp={claimLamp}
            syncStatus={syncStatus}
            inviteCode={myInvite}
            inviteLink={inviteUrl(myInvite)}
          />
        )}
      </main>
    </>
  );
}
