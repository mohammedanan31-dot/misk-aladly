"use client"

/**
 * MISK ALADLY scroll hero.
 *
 * Built on the "serum dive" scroll hero: the same scroll timeline (T), camera
 * keys, easing, word choreography, fog etching, rising reveal line, beat copy and
 * docking CTA pill, re-dressed for the brand:
 *  - dry/wet wall  -> unlit / gold-lit burgundy alcove with drifting mist
 *  - water line    -> a rising band of golden light
 *  - serum bottle  -> the real Velvet Kiss bottle; the dropper becomes its cap,
 *                     which lifts (with a slight tilt) to reveal the gold atomiser,
 *                     followed by a soft puff of fragrance mist
 */

import * as React from "react"
import { formatPrice, getPerfume, orderMessage, whatsappLink } from "@/data/site"

export interface DiveBeat { title: string; sub: string }

const HERO = getPerfume("velvet-kiss")!
const IMG = "/hero/"

const INTRO = {
  title: "حين يصبح العطر",
  accent: "توقيعًا لا يُنسى",
  sub: "أربعة عطور مستوردة، لكل منها حضورٌ يسبقك ويبقى بعدك.",
  cta: "اطلب Velvet Kiss",
}
const BEATS: DiveBeat[] = [
  { title: "يمرّ اليوم…\nويتلاشى العطر.", sub: "معظم العطور تختفي قبل أن ينتهي يومك." },
  { title: "أما هذا،\nفيبقى حتى منتصف الليل.", sub: "تركيبة مستوردة بتركيز عالٍ تدوم لساعات طويلة." },
  { title: "رشّتان على النبض،\nصباحًا ومساءً.", sub: "عبوة 100 مل ترافقك لأشهر." },
  { title: "فانيلا · عسل · كراميل", sub: "Velvet Kiss — عطر نسائي حلو، دافئ، وجذّاب." },
  { title: "اجعله توقيعك.", sub: "شحن لجميع المحافظات خلال 3–5 أيام عمل، و50 نقطة مع كل عبوة." },
]

/* ---------- timeline & maths (unchanged from the reference) ---------- */
export const T = {
  introOut: [0.05, 0.09], fog: [0.06, 0.13], wordIn: [0.08, 0.15], water: [0.18, 0.34], prefixOut: [0.24, 0.35],
  cam1: [0.38, 0.54], wordOut: [0.57, 0.71], cam2: [0.57, 0.71], cam3: [0.74, 0.86],
  beats: [[0.12, 0.17, 0.26, 0.3], [0.31, 0.36, 0.44, 0.48], [0.49, 0.54, 0.58, 0.62], [0.63, 0.68, 0.73, 0.76], [0.79, 0.85, 2, 2]],
  stops: [0.17, 0.37, 0.555, 0.72, 0.88],
}
export function clamp01(v: number) { return v < 0 ? 0 : v > 1 ? 1 : v }
export function span(p: number, w: number[]) { return w[1] === w[0] ? (p >= w[0] ? 1 : 0) : clamp01((p - w[0]) / (w[1] - w[0])) }
export function easeInOut(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 }
export function easeOut(t: number) { return 1 - Math.pow(1 - t, 3) }
export function mix(a: number, b: number, t: number) { return a + (b - a) * t }
export function beatState(p: number, w: number[]) {
  const enter = easeOut(span(p, [w[0], w[1]])), exit = easeInOut(span(p, [w[2], w[3]]))
  return { o: enter * (1 - exit), y: (1 - enter) * 14 - exit * 14, blur: (1 - enter) * 6 + exit * 6 }
}
/** Sheet geometry of the Velvet Kiss cut-outs (px in /hero/*.webp). */
export const SHEET = { total: 791, bottle: { w: 398, h: 707 }, cap: { w: 398, h: 217 }, lift: 330 }
export const SHADOW = { w: 1.4, h: 0.74 }
export interface CamKey { z: number; x: number; by: number }
export function camAt(p: number, keys: CamKey[], word1X: number, word3X: number): CamKey {
  const k0 = { ...keys[0], x: word1X }, k1 = { ...keys[1], x: word3X }
  const a = easeInOut(span(p, T.cam1)), b = easeInOut(span(p, T.cam2)), c = easeInOut(span(p, T.cam3))
  let z = mix(k0.z, k1.z, a), x = mix(k0.x, k1.x, a), by = mix(k0.by, k1.by, a)
  z = mix(z, keys[2].z, b); x = mix(x, keys[2].x, b); by = mix(by, keys[2].by, b)
  z = mix(z, keys[3].z, c); x = mix(x, keys[3].x, c); by = mix(by, keys[3].by, c)
  return { z, x, by }
}
export function autoAt(ms: number, total: number) {
  const n = T.stops.length, lead = .01, hold = .02, move = (1 - lead - hold * (n - 1)) / n
  let t = clamp01(ms / total) - lead, from = 0
  for (let i = 0; i < n; i++) { if (t <= 0) return from; if (t < move) return mix(from, T.stops[i], .5 - .5 * Math.cos(Math.PI * t / move)); t -= move + hold; from = T.stops[i] }
  return from
}
export function pillY(slotY: number, scrolledAway: number, navY: number) { return Math.max(navY, slotY - scrolledAway) }

type Layout = { wide: boolean; bottle: number; cams: CamKey[]; word1W: number; word3W: number; word3Shift: number; word1Y: number; word3Y: number }
const WIDE: Layout = { wide: true, bottle: .55, cams: [{ z: 1, x: .525, by: 0 }, { z: 1.25, x: .4, by: .07 }, { z: 1.6, x: .56, by: 1.25 }, { z: 1.6, x: .6, by: 1.375 }], word1W: .86, word3W: .88, word3Shift: .03, word1Y: .43, word3Y: .39 }
const TALL: Layout = { wide: false, bottle: .4, cams: [{ z: 1, x: .5, by: 0 }, { z: 1.15, x: .5, by: .04 }, { z: 1.45, x: .5, by: 1.18 }, { z: 1.45, x: .5, by: 1.3 }], word1W: .9, word3W: .9, word3Shift: 0, word1Y: .5, word3Y: .48 }
const WALL_W = 1672, WALL_H = 821, FOOT = .855
/** Where the pill docks: just under the site's floating nav. */
const DOCK_Y = 96

function prefersReduced() { return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches }

/* Brand name etched into the misted glass, with slow perfume droplets running down. */
function fogArt(w: number, h: number, wide: boolean, brand: string, ledge: number, ink: boolean) {
  const fs = wide ? Math.min(w * .34 / (.74 * Math.max(4, brand.length)), h * .2) : Math.min(w * .8 / (.74 * Math.max(4, brand.length)), h * .12)
  const x = wide ? w * .09 : w * .5, y = wide ? h * .485 + fs * .36 : h * .6 + fs * .36, anchor = wide ? "start" : "middle", tracking = fs * .05, col = ink ? "rgb(214,178,104)" : "black"
  let drips = ""; const seeds = [.07, .29, .47, .68, .86], textW = fs * .72 * brand.length, left = wide ? x : x - textW / 2
  for (let i = 0; i < seeds.length; i++) {
    const dx = left + textW * seeds[i], len = fs * (.35 + ((i * 37) % 5) * .16)
    drips += `<path d='M${dx.toFixed(1)} ${(y - fs * .04).toFixed(1)} q 1.5 ${(len * .5).toFixed(1)} 0 ${len.toFixed(1)}' stroke='${col}' stroke-opacity='${ink ? ".3" : ".75"}' stroke-width='${(fs * .022).toFixed(1)}' stroke-linecap='round' fill='none'/><circle cx='${dx.toFixed(1)}' cy='${(y + len - fs * .04).toFixed(1)}' r='${(fs * .024).toFixed(1)}' fill='${col}' fill-opacity='${ink ? ".34" : ".8"}'/>`
  }
  const glyphs = `<g filter='url(#f)'><text x='${x.toFixed(1)}' y='${y.toFixed(1)}' text-anchor='${anchor}' font-family='Cormorant Garamond, Georgia, Times New Roman, serif' font-weight='500' font-size='${fs.toFixed(1)}' letter-spacing='${tracking.toFixed(1)}' fill='${ink ? "none" : "black"}' fill-opacity='.72' stroke='${col}' stroke-opacity='${ink ? ".32" : ".5"}' stroke-width='${(fs * (ink ? .03 : .02)).toFixed(1)}' stroke-linejoin='round'>${brand.replace(/[<&>]/g, "")}</text>${drips}</g>`
  const filter = `<filter id='f' x='-5%' y='-5%' width='110%' height='110%'><feTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='2' seed='4'/><feDisplacementMap in='SourceGraphic' scale='${(fs * .05).toFixed(1)}'/><feGaussianBlur stdDeviation='${(fs * .012).toFixed(1)}'/></filter>`
  const head = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>`
  const svg = ink ? `${head}<defs>${filter}</defs>${glyphs}</svg>` : `${head}<defs>${filter}<linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='${Math.max(0, (ledge - h * .04) / Math.max(1, ledge)).toFixed(3)}' stop-color='white'/><stop offset='1' stop-color='white' stop-opacity='0'/></linearGradient><mask id='m' maskUnits='userSpaceOnUse' x='0' y='0' width='${w}' height='${h}'><rect width='${w}' height='${h}' fill='white'/>${glyphs}</mask></defs><rect width='${w}' height='${ledge.toFixed(1)}' fill='url(#g)' mask='url(#m)'/></svg>`
  return `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}")`
}

const css = `
.mdh-root{position:relative;width:100%;isolation:isolate;font-family:var(--font-sans);color:#f2e4d0}
.mdh-root img{max-width:none;user-select:none;-webkit-user-drag:none}
.mdh-nav{position:sticky;top:0;z-index:20;height:var(--mdh-nav);margin-bottom:calc(var(--mdh-nav) * -1);pointer-events:none}
.mdh-stage{position:sticky;top:0;width:100%;overflow:hidden;background:#14070c;contain:paint}
.mdh-scene{position:absolute;inset:0;transition:opacity .6s cubic-bezier(.32,.72,0,1)}
.mdh-layer{position:absolute;inset:0;overflow:hidden}
.mdh-wall{position:absolute;left:0;top:0;display:block}
.mdh-wet{will-change:clip-path}
.mdh-shimmer{position:absolute;left:0;top:0;display:block;mix-blend-mode:screen;opacity:.34}
.mdh-shim{position:absolute;inset:0;animation:mdh-drift 14s ease-in-out infinite alternate}
@keyframes mdh-drift{0%{transform:translate3d(-1.2%,-.6%,0)}100%{transform:translate3d(1.2%,.8%,0)}}
.mdh-line{position:absolute;left:0;right:0;height:2px;background:rgba(255,236,190,.9);box-shadow:0 0 16px 5px rgba(232,196,120,.55),0 10px 40px 14px rgba(198,161,91,.35)}
.mdh-obj{position:absolute;left:0;top:0;display:block;transform-origin:50% 100%}
.mdh-shadow{position:absolute;left:0;top:0;display:block;opacity:.38;filter:blur(7px)}
.mdh-puff{position:absolute;left:0;top:0;border-radius:50%;pointer-events:none;background:radial-gradient(closest-side,rgba(255,240,205,.55),rgba(230,195,120,.28) 45%,rgba(198,161,91,0) 75%);filter:blur(6px);mix-blend-mode:screen}
.mdh-word{position:absolute;left:0;top:0;white-space:nowrap;font-family:var(--font-cormorant),'Cormorant Garamond',Georgia,serif;font-weight:600;line-height:1;letter-spacing:.035em;color:#e9cf98;text-shadow:0 2px 30px rgba(198,161,91,.22)}
.mdh-word span{display:inline-block}
.mdh-fog{position:absolute;inset:0;background:rgba(58,18,30,.5);-webkit-backdrop-filter:blur(16px) saturate(.9);backdrop-filter:blur(16px) saturate(.9);-webkit-mask-size:100% 100%;mask-size:100% 100%}
.mdh-ink{position:absolute;inset:0;background-size:100% 100%;background-repeat:no-repeat;pointer-events:none}
.mdh-copy{position:absolute;inset:0;display:grid;pointer-events:none}
.mdh-block{grid-area:1/1;text-align:center;justify-self:center;max-width:min(30em,88vw)}
.mdh-block h1,.mdh-block h2{margin:0;font-family:var(--font-display);font-weight:700;line-height:1.35;white-space:pre-line;color:#f2e4d0;text-shadow:0 2px 24px rgba(20,7,12,.6)}
.mdh-block p{margin:.6em 0 0;font-size:17px;line-height:1.6;color:rgba(242,228,208,.78);text-shadow:0 1px 14px rgba(20,7,12,.7)}
.mdh-accent{background:linear-gradient(170deg,#f8e7bd 0%,#d9b673 40%,#c6a15b 60%,#8a6a32 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.mdh-btn{pointer-events:auto;display:inline-flex;align-items:center;justify-content:space-between;gap:24px;height:52px;padding:0 26px;border:0;border-radius:999px;background:linear-gradient(135deg,#f6e4b4 0%,#d4b06c 40%,#b38c48 70%,#ecd49d 100%);color:#2a1018;font:700 15px/1 var(--font-sans);cursor:pointer;text-decoration:none;box-shadow:0 14px 34px -14px rgba(198,161,91,.8),inset 0 1px 0 rgba(255,255,255,.55);transition:transform .5s cubic-bezier(.32,.72,0,1),box-shadow .5s cubic-bezier(.32,.72,0,1)}
.mdh-btn:hover{transform:translateY(-2px);box-shadow:0 20px 44px -14px rgba(198,161,91,.95),inset 0 1px 0 rgba(255,255,255,.55)}
.mdh-btn:active{transform:scale(.98)}
.mdh-btn:focus-visible{outline:2px solid #e3c78e;outline-offset:3px}
.mdh-btn .mdh-price{font-family:var(--font-cormorant),serif;font-size:18px;font-weight:600;opacity:.85}
.mdh-slot{visibility:hidden}
.mdh-pill{position:absolute;left:0;top:0;z-index:21}
.mdh-root:not([data-ready=true]) .mdh-word,.mdh-root:not([data-ready=true]) .mdh-scene,.mdh-root:not([data-ready=true]) .mdh-beat,.mdh-root:not([data-ready=true]) .mdh-pill,.mdh-root:not([data-sized=true]) .mdh-copy{opacity:0}
@media(max-width:520px){.mdh-btn{height:46px;padding:0 18px;gap:14px;font-size:14px}.mdh-block p{font-size:15px}}
@media(max-width:380px){.mdh-btn{padding:0 14px;gap:10px;font-size:13px}}
@media(prefers-reduced-motion:reduce){.mdh-shim{animation:none}.mdh-btn,.mdh-scene{transition:none}.mdh-root:not([data-ready=true]) .mdh-copy{opacity:0}}
`

export default function MiskDiveHero({
  brand = "MISK ALADLY",
  word = ["UN", "FORGETTABLE"],
  junction = 3,
  height = "100svh",
  screens = 6,
  autoPlay = true,
  autoPlayDuration = 18000,
}: {
  brand?: string; word?: [string, string]; junction?: number; height?: string; screens?: number; autoPlay?: boolean; autoPlayDuration?: number
}) {
  const beats = BEATS, intro = INTRO
  const price = formatPrice(HERO.price)
  const order = whatsappLink(orderMessage(HERO, 1))
  const ctaLabel = "اطلب عبر واتساب"

  const rootRef = React.useRef<HTMLElement | null>(null), stageRef = React.useRef<HTMLDivElement | null>(null)
  const dryRef = React.useRef<HTMLImageElement | null>(null), wetLayerRef = React.useRef<HTMLDivElement | null>(null), wetRef = React.useRef<HTMLImageElement | null>(null), shimRef = React.useRef<HTMLImageElement | null>(null)
  const lineRef = React.useRef<HTMLDivElement | null>(null), fogRef = React.useRef<HTMLDivElement | null>(null), inkRef = React.useRef<HTMLDivElement | null>(null), wordRef = React.useRef<HTMLDivElement | null>(null)
  const bottleRef = React.useRef<HTMLImageElement | null>(null), capRef = React.useRef<HTMLImageElement | null>(null), puffRef = React.useRef<HTMLDivElement | null>(null), bShadowRef = React.useRef<HTMLImageElement | null>(null), cShadowRef = React.useRef<HTMLImageElement | null>(null)
  const introRef = React.useRef<HTMLDivElement | null>(null), beatRefs = React.useRef<(HTMLDivElement | null)[]>([]), slotRef = React.useRef<HTMLSpanElement | null>(null), pillRef = React.useRef<HTMLAnchorElement | null>(null)
  const [ready, setReady] = React.useState(false), [fontsRev, setFontsRev] = React.useState(0), [reduced, setReduced] = React.useState(false), [active, setActive] = React.useState(0), [size, setSize] = React.useState({ w: 0, h: 0 })
  const live = React.useRef({ cur: -1, state: 0, ms: 0, lead: 0, hold: -1 })
  const wordText = word[0] + word[1], letters = React.useMemo(() => wordText.split(""), [wordText]), pre = word[0].length

  React.useEffect(() => { setReduced(prefersReduced()) }, [])
  React.useEffect(() => {
    let alive = true; const done = () => { if (alive) setReady(true) }, fonts = document.fonts
    const pics = Array.from(stageRef.current?.querySelectorAll("img") ?? [])
    const seen = pics.map(im => new Promise<unknown>(res => { if (im.complete) return res(null); im.addEventListener("load", res, { once: true }); im.addEventListener("error", res, { once: true }) }))
    Promise.all([fonts ? fonts.ready : null, ...seen]).then(done, done)
    const t = window.setTimeout(done, 2500), bump = () => { if (alive) setFontsRev(v => v + 1) }
    fonts?.addEventListener("loadingdone", bump)
    return () => { alive = false; window.clearTimeout(t); fonts?.removeEventListener("loadingdone", bump) }
  }, [])
  React.useEffect(() => { const st = stageRef.current; if (!st) return; const ro = new ResizeObserver(() => { const r = st.getBoundingClientRect(); setSize({ w: Math.round(r.width), h: Math.round(r.height) }) }); ro.observe(st); return () => ro.disconnect() }, [])

  const L = size.w >= size.h * 1.05 ? WIDE : TALL
  const fog = React.useMemo(() => { if (!size.w) return { mask: "none", ink: "none" }; const wallH0 = WALL_H * Math.max(size.w / WALL_W, size.h / WALL_H), ledge = Math.min(size.h, (size.h - wallH0) / 2 + .875 * wallH0); return { mask: fogArt(size.w, size.h, L.wide, brand, ledge, false), ink: fogArt(size.w, size.h, L.wide, brand, ledge, true) } }, [size.w, size.h, L.wide, brand])

  React.useEffect(() => {
    const root = rootRef.current, stage = stageRef.current, wordEl = wordRef.current
    if (!root || !stage || !wordEl || !ready || size.w === 0 || !word[1]) return
    const W = size.w, H = size.h, still = reduced
    wordEl.style.fontSize = "100px"; wordEl.style.left = "0px"; wordEl.style.top = "0px"
    const spans = Array.from(wordEl.children) as HTMLSpanElement[], r0 = wordEl.getBoundingClientRect()
    const lx = spans.map(s => (s.getBoundingClientRect().left - r0.left) / 100), rx = spans.map(s => (s.getBoundingClientRect().right - r0.left) / 100)
    const fullEm = rx[rx.length - 1] - lx[0], restEm = rx[rx.length - 1] - lx[pre], jIdx = Math.max(0, Math.min(letters.length - 1, pre + junction)), jEm = lx[jIdx] - .06
    const ctx = document.createElement("canvas").getContext("2d"); let capMid = .5
    if (ctx) { ctx.font = `600 100px ${getComputedStyle(wordEl).fontFamily}`; const m = ctx.measureText("H"), fa = m.fontBoundingBoxAscent || 90, fd = m.fontBoundingBoxDescent || 22, base = (100 - (fa + fd)) / 2 + fa; capMid = (base - m.actualBoundingBoxAscent / 2) / 100 }
    const s0 = Math.max(W / WALL_W, H / WALL_H), wallH0 = WALL_H * s0, foot0 = (H - wallH0) / 2 + FOOT * wallH0, bottleH0 = L.bottle * wallH0
    const fs1 = Math.min(L.word1W * W / fullEm, H * .3), left1 = (W - fullEm * fs1) / 2 - lx[0] * fs1, word1X = (left1 + jEm * fs1) / W
    const keys = L.cams.map((k, i) => ({ z: k.z, x: k.x, by: i < 2 ? foot0 / H + k.by : k.by })), jIn = jEm - lx[pre]
    let fs3 = Math.min(L.word3W * W / restEm, H * .32), wl3 = (W - restEm * fs3) / 2 + L.word3Shift * W
    if (L.wide) {
      let copyRight = 0; const b3 = beatRefs.current[2]
      if (b3) { const rg = document.createRange(); rg.selectNodeContents(b3); const rs = rg.getClientRects(); for (let i = 0; i < rs.length; i++) if (rs[i].width > 1) copyRight = Math.max(copyRight, rs[i].right - stage.getBoundingClientRect().left) }
      const bw1 = SHEET.bottle.w * (bottleH0 * keys[1].z / SHEET.total), need = copyRight + 28 + bw1 / 2
      if (wl3 + jIn * fs3 < need) { fs3 = Math.max(1, Math.min(fs3, (.97 * W - need) / Math.max(.001, restEm - jIn))); wl3 = need - jIn * fs3 }
    }
    const word3X = (wl3 + jIn * fs3) / W
    let slotY = 0, blockTop = 0, slotCx = 0
    const measureSlot = () => {
      const sl = slotRef.current, lastBlock = beatRefs.current[beats.length - 1]; if (!sl || !lastBlock) return
      const prev = lastBlock.style.transform; lastBlock.style.transform = "none"
      const sr = sl.getBoundingClientRect(), st = stage.getBoundingClientRect(); slotY = sr.top - st.top; blockTop = lastBlock.getBoundingClientRect().top - st.top; lastBlock.style.transform = prev
      slotCx = sr.left - st.left + sr.width / 2
    }
    measureSlot()
    const dockCx = W / 2
    const navH = parseFloat(getComputedStyle(root).getPropertyValue("--mdh-nav")) || DOCK_Y, px = (v: number) => v.toFixed(2) + "px"
    const place = (el: HTMLElement | null, x: number, y: number, w: number, h: number, extra = "") => { if (!el) return; el.style.transform = `translate3d(${px(x)},${px(y)},0)${extra}`; el.style.width = px(w); el.style.height = px(h) }
    let lastActive = -1
    const render = (p: number, away: number) => {
      const cam = camAt(p, keys, word1X, word3X), z = cam.z, cx = cam.x * W, foot = cam.by * H, wallW = WALL_W * s0 * z, wallH = WALL_H * s0 * z
      let wl = cx - .5 * wallW, wt = foot - FOOT * wallH; wl = Math.min(0, Math.max(W - wallW, wl)); wt = Math.min(0, Math.max(H - wallH, wt))
      place(dryRef.current, wl, wt, wallW, wallH); place(wetRef.current, wl, wt, wallW, wallH); place(shimRef.current, wl, wt, wallW, wallH)
      const dof = mix(0, 2.2, clamp01((z - 1) / .6)), wallFilter = dof > .05 ? `blur(${dof.toFixed(2)}px)` : "none"
      if (wetRef.current) wetRef.current.style.filter = wallFilter; if (dryRef.current) dryRef.current.style.filter = wallFilter
      // the golden light rises up the wall
      const wt01 = still ? 1 : easeInOut(span(p, T.water)), lineY = mix(H + 4, -.06 * H, wt01)
      if (wetLayerRef.current) wetLayerRef.current.style.clipPath = `inset(${px(Math.max(0, lineY))} 0 0 0)`
      if (lineRef.current) { lineRef.current.style.transform = `translate3d(0,${px(lineY)},0)`; lineRef.current.style.opacity = String(wt01 > 0 && lineY > -2 ? Math.min(1, (H - lineY) / 40) : 0) }
      // bottle + cap (the cap lifts and tilts away to reveal the atomiser)
      const u = bottleH0 * z / SHEET.total, lift01 = easeInOut(span(p, T.cam3)), lift = SHEET.lift * lift01, bw = SHEET.bottle.w * u, bh = SHEET.bottle.h * u, by0 = foot - bh
      place(bottleRef.current, cx - bw / 2, by0, bw, bh)
      const cw = SHEET.cap.w * u, ch = SHEET.cap.h * u, cy = foot - SHEET.total * u - lift * u, tilt = -7 * Math.sin(Math.PI * lift01) - 3 * lift01
      place(capRef.current, cx - cw / 2, cy, cw, ch, ` rotate(${tilt.toFixed(2)}deg)`)
      // a soft breath of fragrance once the cap is off
      if (puffRef.current) {
        const pk = still ? 0 : clamp01((lift01 - .55) / .45), ps = (90 + 160 * pk) * u * 2.2
        const nozzleY = foot - SHEET.total * u + 120 * u
        place(puffRef.current, cx + 40 * u - ps / 2 + pk * 60 * u, nozzleY - ps / 2 - pk * 40 * u, ps, ps)
        puffRef.current.style.opacity = (pk * (1 - .35 * pk)).toFixed(3)
        puffRef.current.style.visibility = pk < .002 ? "hidden" : "visible"
      }
      const sx = cx + bw * 1.7, sy = foot - bh * .05
      const shadow = (el: HTMLElement | null, l: number, t: number, w: number, h: number) => place(el, sx + (l - cx) * SHADOW.w, sy - (foot - t) * SHADOW.h, w * SHADOW.w, h * SHADOW.h)
      shadow(bShadowRef.current, cx - bw / 2, by0, bw, bh); shadow(cShadowRef.current, cx - cw / 2, cy, cw, ch)
      // the word: UN·FORGETTABLE
      const wIn = still ? 1 : easeOut(span(p, T.wordIn)), pOut = still ? 1 : easeInOut(span(p, T.prefixOut)), a = easeInOut(span(p, T.cam1)), fs = mix(fs1, fs3, a), wLeft = cx - jEm * fs, wordY = mix(L.word1Y, L.word3Y, a) * H - capMid * fs
      wordEl.style.fontSize = px(fs); wordEl.style.transform = `translate3d(${px(wLeft)},${px(wordY)},0)`
      const outT = still ? 0 : span(p, T.wordOut)
      for (let i = 0; i < spans.length; i++) {
        const s = spans[i]; let o = wIn, blur = (1 - wIn) * 22, ty = 0
        if (i < pre) { o *= 1 - pOut; blur += pOut * 26; ty = -pOut * fs * .12 } else { const k = letters.length - 1 - i, t = clamp01((outT - k * .045) / .62), e = easeInOut(t); ty = -e * H * (.2 + .03 * Math.sin(i * 1.7)); blur += e * 20; o *= 1 - clamp01((t - .35) / .65) }
        s.style.opacity = o.toFixed(3); s.style.filter = blur > .05 ? `blur(${blur.toFixed(2)}px)` : "none"; s.style.transform = ty !== 0 ? `translate3d(0,${px(ty)},0)` : "none"; s.style.visibility = o < .002 ? "hidden" : "visible"
      }
      // mist clears from the glass
      const f = still ? 1 : easeInOut(span(p, T.fog))
      if (fogRef.current) { const fo = 1 - f, b = mix(16, 4, f), bf = `blur(${b.toFixed(1)}px) saturate(.9)`; fogRef.current.style.opacity = fo.toFixed(3); fogRef.current.style.backdropFilter = bf; (fogRef.current.style as unknown as Record<string, string>).webkitBackdropFilter = bf; fogRef.current.style.visibility = fo < .002 ? "hidden" : "visible" }
      if (inkRef.current) { inkRef.current.style.opacity = (1 - f).toFixed(3); inkRef.current.style.visibility = f > .998 ? "hidden" : "visible" }
      let shown = 0; const io = still ? 0 : 1 - easeInOut(span(p, T.introOut))
      if (introRef.current) { introRef.current.style.opacity = io.toFixed(3); introRef.current.style.transform = `translate3d(0,${px(-(1 - io) * 14)},0)`; introRef.current.style.filter = io < .999 ? `blur(${((1 - io) * 6).toFixed(2)}px)` : "none"; introRef.current.style.visibility = io < .002 ? "hidden" : "visible" }
      let lastO = 0, lastY = 0
      for (let i = 0; i < beatRefs.current.length; i++) {
        const el = beatRefs.current[i]; if (!el) continue
        const s = still ? (i === beats.length - 1 ? { o: 1, y: 0, blur: 0 } : { o: 0, y: 0, blur: 0 }) : beatState(p, T.beats[i] || [2, 2, 2, 2]), room = blockTop + s.y - navH - 6, o = i === beats.length - 1 ? s.o * (1 - clamp01((away - Math.max(0, room - 70)) / 70)) : s.o
        el.style.opacity = o.toFixed(3); el.style.transform = `translate3d(0,${px(s.y)},0)`; el.style.filter = s.blur > .05 && o > .002 ? `blur(${s.blur.toFixed(2)}px)` : "none"; el.style.visibility = o < .002 ? "hidden" : "visible"
        if (s.o > .5) shown = i + 1; if (i === beats.length - 1) { lastO = s.o; lastY = s.y }
      }
      if (io > .5) shown = 0; if (shown !== lastActive) { lastActive = shown; setActive(shown) }
      const pill = pillRef.current
      if (pill) { const navY = navH - pill.offsetHeight / 2 - 6, y = pillY(slotY + lastY, away, navY), k = easeInOut(clamp01(1 - (slotY + lastY - away - navY) / 90)); pill.style.transform = `translate3d(${px(mix(slotCx, dockCx, k) - pill.offsetWidth / 2)},${px(y)},0)`; pill.style.opacity = lastO.toFixed(3); pill.style.visibility = lastO < .002 ? "hidden" : "visible"; pill.tabIndex = lastO > .5 ? 0 : -1 }
    }
    const target = () => { const r = root.getBoundingClientRect(), run = r.height - H; return run > 0 ? clamp01(-r.top / run) : 0 }, awayNow = () => Math.max(0, -stage.getBoundingClientRect().top)
    if (still) { render(.36, awayNow()); root.setAttribute("data-ready", "true"); const onScroll = () => render(.36, awayNow()); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll) }
    const A = live.current; let cur = A.cur < 0 ? target() : A.cur, raf = 0, last = performance.now(), visible = true
    const total = Math.max(2000, autoPlayDuration)
    if (autoPlay && A.state === 0 && (prefersReduced() || cur > .002 || root.getBoundingClientRect().top > H * .5)) A.state = 2
    let goal = target(), setY = window.scrollY
    const over = () => { if (A.state === 1 && Math.abs(target() - goal) > .004) A.hold = goal; A.state = 2 }
    const tick = (now: number) => {
      raf = 0; const dt = Math.min(64, now - last); last = now
      if (autoPlay && A.state < 2) { const r = root.getBoundingClientRect(); if (A.state === 0) { A.state = 1; A.lead = Math.max(0, r.top) } A.ms += dt; goal = autoAt(A.ms, total); const y = window.scrollY + r.top + goal * (r.height - H) - A.lead * (1 - clamp01(goal / .03)); window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior }); setY = window.scrollY; if (A.ms >= total) over() } else goal = A.hold < 0 ? target() : A.hold
      const ease = 1 - Math.pow(1 - .12, dt / 16.67); cur += (goal - cur) * ease; if (Math.abs(goal - cur) < .00005) cur = goal; A.cur = cur; render(cur, awayNow())
      if (visible && !document.hidden && (cur !== goal || (autoPlay && A.state < 2))) raf = requestAnimationFrame(tick)
    }
    const kick = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick) } }
    render(cur, awayNow()); root.setAttribute("data-ready", "true")
    const observer = new IntersectionObserver(es => { visible = es[0] ? es[0].isIntersecting : true; if (visible) kick() }); observer.observe(root)
    const take = () => { if (autoPlay && A.state < 2) over() }
    const onScroll = () => { if (A.state === 1 && Math.abs(window.scrollY - setY) > 1) take(); else if (A.state === 2) A.hold = -1; kick() }
    const onKey = (e: KeyboardEvent) => { if (/^(Arrow(Up|Down)|Page(Up|Down)|Home|End| )$/.test(e.key)) take() }
    window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("wheel", take, { passive: true }); window.addEventListener("touchmove", take, { passive: true }); window.addEventListener("keydown", onKey); document.addEventListener("visibilitychange", kick)
    return () => { if (raf) cancelAnimationFrame(raf); observer.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("wheel", take); window.removeEventListener("touchmove", take); window.removeEventListener("keydown", onKey); document.removeEventListener("visibilitychange", kick) }
  }, [ready, fontsRev, reduced, size.w, size.h, L, beats.length, letters, pre, junction, autoPlay, autoPlayDuration, wordText])

  const rootStyle = { height: reduced ? height : `calc(${height} * ${screens + 1})`, width: "100%", "--mdh-nav": `${DOCK_Y}px` } as React.CSSProperties
  const titleSize = L.wide ? "clamp(30px, min(3.4vw, 5.4svh), 58px)" : "clamp(28px, 8.2vw, 40px)"
  const blockPos = (i: number): React.CSSProperties => { if (!L.wide) return { alignSelf: "start", marginTop: "calc(var(--mdh-nav) + 3svh)" }; const tops = [.585, .585, .635, .455, reduced ? .585 : .43]; return { alignSelf: "start", justifySelf: "start", marginTop: Math.round((tops[i] || .5) * size.h), width: "38%", marginLeft: "3.7%" } }

  return (
    <section ref={rootRef} className="mdh-root" dir="ltr" style={rootStyle} data-sized={size.w > 0} aria-label={`${intro.title} ${intro.accent}`}>
      <style>{css}</style>
      <div className="mdh-nav">
        <a ref={pillRef} href={order} target="_blank" rel="noopener noreferrer" className="mdh-btn mdh-pill" tabIndex={-1} aria-hidden={active !== beats.length} dir="rtl">
          <span>{ctaLabel}</span><span className="mdh-price">{price}</span>
        </a>
      </div>
      <div ref={stageRef} className="mdh-stage" style={{ height, width: "100%" }}>
        <div className="mdh-scene">
          <div className="mdh-layer" aria-hidden="true"><img ref={dryRef} className="mdh-wall" src={IMG + "wall-unlit.webp"} alt="" width={WALL_W} height={WALL_H} draggable={false} /></div>
          <div ref={wetLayerRef} className="mdh-layer mdh-wet" aria-hidden="true" style={{ clipPath: "inset(100% 0 0 0)" }}><img ref={wetRef} className="mdh-wall" src={IMG + "wall-lit.webp"} alt="" width={WALL_W} height={WALL_H} draggable={false} /><div className="mdh-shim"><img ref={shimRef} className="mdh-shimmer" src={IMG + "wall-lit.webp"} alt="" width={WALL_W} height={WALL_H} draggable={false} /></div></div>
          <div className="mdh-layer" aria-hidden="true">
            <img ref={bShadowRef} className="mdh-shadow" src={IMG + "bottle-shadow.webp"} alt="" width={199} height={353} draggable={false} />
            <img ref={cShadowRef} className="mdh-shadow" src={IMG + "cap-shadow.webp"} alt="" width={199} height={108} draggable={false} />
            <div ref={wordRef} className="mdh-word" aria-hidden="true">{letters.map((ch, i) => <span key={i}>{ch}</span>)}</div>
            <img ref={bottleRef} className="mdh-obj" src={IMG + "bottle.webp"} alt={HERO.name} width={SHEET.bottle.w} height={SHEET.bottle.h} draggable={false} />
            <div ref={puffRef} className="mdh-puff" style={{ visibility: "hidden" }} />
            <img ref={capRef} className="mdh-obj" src={IMG + "cap.webp"} alt="" width={SHEET.cap.w} height={SHEET.cap.h} draggable={false} />
          </div>
          <div ref={lineRef} className="mdh-line" aria-hidden="true" style={{ top: 0, opacity: 0 }} />
          <div ref={fogRef} className="mdh-fog" aria-hidden="true" style={{ WebkitMaskImage: fog.mask, maskImage: fog.mask }} />
          <div ref={inkRef} className="mdh-ink" aria-hidden="true" style={{ backgroundImage: fog.ink }} />
        </div>
        <div className="mdh-copy">
          <div ref={introRef} className="mdh-block" dir="rtl" style={L.wide ? { alignSelf: "center", justifySelf: "end", width: "38%", marginRight: "3.7%", marginTop: "-1%" } : { alignSelf: "start", marginTop: "calc(var(--mdh-nav) + 3svh)" }}>
            <h1 style={{ fontSize: titleSize }}>{intro.title}<br /><span className="mdh-accent">{intro.accent}</span></h1><p>{intro.sub}</p>
            <a href={order} target="_blank" rel="noopener noreferrer" className="mdh-btn" style={{ marginTop: 22, pointerEvents: active === 0 ? "auto" : "none" }} tabIndex={active === 0 ? 0 : -1}><span>{intro.cta}</span><span className="mdh-price">{price}</span></a>
          </div>
          {beats.map((b, i) => (
            <div key={i} ref={el => { beatRefs.current[i] = el }} className="mdh-block mdh-beat" dir="rtl" style={blockPos(i)} aria-hidden={active !== i + 1}>
              <h2 style={{ fontSize: titleSize }}>{b.title}</h2><p>{b.sub}</p>
              {i === beats.length - 1 && <span ref={slotRef} className="mdh-btn mdh-slot" aria-hidden="true" style={{ marginTop: 22 }}><span>{ctaLabel}</span><span className="mdh-price">{price}</span></span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
