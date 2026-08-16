"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [dark, setDark] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("relay-theme") === "dark");
  const [compact, setCompact] = useState(() => typeof window !== "undefined" && window.localStorage.getItem("relay-layout") === "compact");
  function updateTheme(value: boolean) { setDark(value); document.documentElement.dataset.theme = value ? "dark" : "light"; window.localStorage.setItem("relay-theme", value ? "dark" : "light"); }
  function updateLayout(value: boolean) { setCompact(value); window.localStorage.setItem("relay-layout", value ? "compact" : "comfortable"); document.documentElement.dataset.layout = value ? "compact" : "comfortable"; }
  return <main className="subpage shell"><p className="eyebrow">PREFERENCES</p><h1>Settings</h1><p className="subpage-lede">Tune the reading experience. Preferences are saved in this browser.</p><section className="settings-list"><label className="setting-row"><span><strong>Dark theme</strong><small>Reduce glare in low-light study spaces.</small></span><input type="checkbox" checked={dark} onChange={(event) => updateTheme(event.target.checked)} /></label><label className="setting-row"><span><strong>Compact feed layout</strong><small>Fit more posts on screen for quick scanning.</small></span><input type="checkbox" checked={compact} onChange={(event) => updateLayout(event.target.checked)} /></label></section></main>;
}
