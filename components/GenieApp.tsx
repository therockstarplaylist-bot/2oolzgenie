"use client";

import { ArcadeDeck } from "./arcade/ArcadeDeck";
import { CasinoDeck } from "./casino/CasinoDeck";
import { formatCount } from "@/lib/coins";
import { PAGES } from "./constants";
import { ForgePage, MarketPage, ProfilePage, ShopPage, ToolsPage } from "./GeniePages";
import { useCloudLampStandalone } from "./useCloudLampStandalone";
import { useGenie } from "./useGenie";

export default function GenieApp() {
  const g = useGenie();
  const syncStatus = useCloudLampStandalone();

  if (!g.ready) return <p className="lede">Opening the lamp…</p>;

  const {
    S,
    msg,
    setMsg,
    payNote,
    lastDrip,
    need,
    setNeed,
    tick,
    hourly,
    go,
    patch,
    onForge,
    onMarketBuy,
    claimLamp,
    deleteTool,
    addFreeTool,
  } = g;

  return (
    <div className="lamp">
      <p className="balance">
        {formatCount(S.coins)} TC
        {S.page === "casino" ? ` · ${formatCount(S.chips)} chips` : ""} · +{hourly}/h
      </p>
      <nav className="lamp-nav" aria-label="Lamp">
        {PAGES.map((p) => (
          <button key={p} type="button" className={S.page === p ? "on" : ""} onClick={() => go(p)}>
            {p}
          </button>
        ))}
      </nav>
      <div className="lamp-block">
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
        {S.page === "casino" && <CasinoDeck S={S} patch={patch} setMsg={setMsg} msg={msg} />}
        {S.page === "arcade" && <ArcadeDeck />}
        {S.page === "tools" && (
          <ToolsPage
            S={S}
            msg={msg}
            go={go}
            onDelete={deleteTool}
            addFreeTool={addFreeTool}
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
      </div>
    </div>
  );
}
