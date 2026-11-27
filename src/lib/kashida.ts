/**
 * Kashida (tatweel "ـ") for Arabic display type: stretches one joint per word so headings
 * breathe and line up more evenly. Only inserted where the two letters actually join:
 * never after a right-joining letter (ا د ذ ر ز و …), never inside the lam-alef ligature,
 * never before hamza, and never in short words.
 */
const NO_JOIN_AFTER = new Set("اأإآٱدذرزوؤةىءـ");
const LETTER = /[ؠ-يٱ-ۓ]/;
const MARK = /[ً-ٰٟ]/;
const ALEFS = new Set("اأإآٱ");

export function kashidaWord(word: string, minLetters = 4): string {
  if (word.includes("ـ")) return word;
  // base letters with their index in the string
  const base: { ch: string; i: number }[] = [];
  for (let i = 0; i < word.length; i++) if (LETTER.test(word[i])) base.push({ ch: word[i], i });
  if (base.length < minLetters) return word;

  const spots: { at: number; k: number }[] = [];
  for (let k = 0; k < base.length - 1; k++) {
    const cur = base[k], next = base[k + 1];
    if (NO_JOIN_AFTER.has(cur.ch) || next.ch === "ء") continue;
    if (cur.ch === "ل" && ALEFS.has(next.ch)) continue;
    if (k === 1 && cur.ch === "ل" && ALEFS.has(base[0].ch)) continue; // not right after the article "ال"
    if (next.i !== cur.i + 1 && !word.slice(cur.i + 1, next.i).split("").every((c) => MARK.test(c))) continue;
    // insert after the letter and any marks it carries
    let at = cur.i + 1;
    while (at < word.length && MARK.test(word[at])) at++;
    spots.push({ at, k });
  }
  if (!spots.length) return word;
  // the joint nearest the middle of the word reads most naturally
  const mid = (base.length - 1) * 0.55;
  const best = spots.reduce((a, b) => (Math.abs(b.k - mid) < Math.abs(a.k - mid) ? b : a));
  return word.slice(0, best.at) + "ـ" + word.slice(best.at);
}

/** Applies kashida to every long-enough word of a phrase. */
export function kashida(text: string, minLetters = 4): string {
  return text
    .split(" ")
    .map((w) => kashidaWord(w, minLetters))
    .join(" ");
}
