/* eslint-disable @next/next/no-html-link-for-pages -- Home is a full-document HTML route handler. */
export default function NotFound() {
  return (
    <main style={{ padding: "15vh 7vw", maxWidth: 900 }}>
      <p style={{ color: "#ff4864" }}>404 / PAGE NOT FOUND</p>
      <h1 style={{ fontSize: "clamp(40px,8vw,80px)", lineHeight: 1 }}>
        Let’s get you back.
      </h1>
      <p>This page is unavailable.</p>
      <nav aria-label="Helpful pages">
        <a href="/services">Explore services</a>{" · "}
        <a href="/work">Published projects</a>{" · "}
        <a href="/blog">Planning guides</a>{" · "}
        <a href="/contact">Contact the studio</a>
      </nav>
      <a
        href="/"
        style={{ color: "#ff4864", display: "inline-block", padding: "20px 0" }}
      >
        Return to TheBenzzCreations →
      </a>
    </main>
  );
}
