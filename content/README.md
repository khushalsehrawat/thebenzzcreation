# Editorial content

`blog/*.md` uses JSON-compatible YAML frontmatter between `---` lines. Required fields: title, description, date, updated, author, tags, faq, h1, intro, answer, category and service. Optional fields include related, sources, cta and steps.

Sections start with `## `. Supported Markdown includes paragraphs, links, bold, lists, H3s and tables. No executable JSX, runtime compiler or new dependency is needed. Imported existing articles use explicitly trusted authored HTML. Do not accept user-supplied HTML in this system.

Update `updated` only after an editorial change. Use the studio as author until a real person approves attribution. Prices, timelines, customer evidence and qualifications require owner confirmation. `npm run content:check` enforces the twelve starter articles' length and frontmatter. `npm run build` generates social images, AI resources and validates every rendered page.
