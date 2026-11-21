import { publicPages, SITE_ORIGIN } from "../lib/seo-content";
async function main() {
const key = process.env.INDEXNOW_KEY;
if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error("Configure a valid INDEXNOW_KEY and deploy its generated public key file first.");
const keyLocation = `${SITE_ORIGIN}/${key}.txt`;
const liveKey = await fetch(keyLocation);
if (!liveKey.ok || (await liveKey.text()).trim() !== key) throw new Error("The public key URL must return the configured key before submission.");
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ host: new URL(SITE_ORIGIN).hostname, key, keyLocation, urlList: publicPages.map(page => SITE_ORIGIN + page.path) }),
});
if (![200, 202].includes(response.status)) throw new Error(`IndexNow rejected submission: HTTP ${response.status}`);
console.log(`IndexNow accepted ${publicPages.length} URLs (HTTP ${response.status}); acceptance does not guarantee indexing.`);

}
main().catch(error => { console.error(error); process.exitCode = 1; });
