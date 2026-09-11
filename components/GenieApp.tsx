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

export default function GenieApp() {
  const g = useGenie();
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
    unlockSkill,
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
          <MarketPage S={S} msg={msg} tick={tick} onMarketBuy={onMarketBuy} />
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
            unlockSkill={unlockSkill}
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
