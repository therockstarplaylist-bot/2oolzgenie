"use client";

import { AuthControls } from "./AuthControls";
import { PAGES } from "./constants";
import {
  ArcadePage,
  CasinoPage,
  ForgePage,
  MarketPage,
  ProfilePage,
  ShopPage,
  ToolsPage,
} from "./GeniePages";
import { useCloudLampStandalone } from "./useCloudLampStandalone";
import { useGenie } from "./useGenie";
import { getWishPack, getWishTool } from "./wishCatalog";
import { load, normalize, save } from "./constants";
import { WanderingLamp } from "./WanderingLamp";

export default function GenieApp() {
  const g = useGenie();
  // Client-side wish market (load/save) — works even if useGenie lacks handlers yet.
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
        onOpenWish={(id) => {
          try {
            sessionStorage.setItem("tg_scout_wish", id);
          } catch {}
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
          <MarketPage S={S} msg={msg} tick={tick} onMarketBuy={onMarketBuy} onWishBuy={onWishBuy} onWishPackBuy={onWishPackBuy} />
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
          />
        )}
      </main>
    </>
  );
}
