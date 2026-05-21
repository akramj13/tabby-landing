# tabby landing page

<p align="center">
  <img width="128" alt="tabby logo" src="https://github.com/user-attachments/assets/8a67095e-4d03-4055-8d4c-8871335152dd" />
</p>

<p align="center">
  <em>Landing page for tabby, the on-device AI autocomplete for macOS.</em>
</p>

<p align="center">
  <a href="https://tabbyapp.dev"><strong>tabbyapp.dev</strong></a> &middot;
  <a href="https://github.com/FuJacob/tabby"><strong>Product repo</strong></a>
</p>

<p align="center">
  <a href="https://github.com/FuJacob/tabby/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/FuJacob/tabby" /></a>
  <a href="https://github.com/FuJacob/tabby/releases"><img alt="Downloads" src="https://img.shields.io/github/downloads/FuJacob/tabby/total" /></a>
  <a href="https://github.com/FuJacob/tabby/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/FuJacob/tabby?style=flat" /></a>
  <a href="LICENSE"><img alt="License: AGPL v3" src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg" /></a>
</p>

<p align="center">
  <a href="https://buymeacoffee.com/tabbyapp" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;" /></a>
  <br />
  Built by <a href="https://github.com/FuJacob">@FuJacob</a> and <a href="https://github.com/jam-cai">@jam-cai</a>
</p>

---

## Tech Stack

- **Next.js 16** with the App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** for page motion and interaction details
- **Supabase** for mailing list collection
- **Vercel Analytics**

## Project Structure

```text
frontend/
  app/
    components/        Reusable landing-page sections and UI primitives
    lib/site.ts        Site-wide URLs, support email, and creator metadata
    lib/supabase.ts    Supabase client
    privacy/           Privacy policy route
    release-notes/     Release notes route
    terms/             Terms route
    page.tsx           Home page composition
  public/              Icons, app logos, and static media
  .env.example         Environment variable template
  package.json         Scripts and dependencies
```

The home page is composed from section components in `frontend/app/components/`. Each section owns its copy, layout, and motion behavior.

## Local Development

```bash
cd frontend
cp .env.example .env.local   # fill in your keys
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Description |
|----------|-------------|
| `GITHUB_TOKEN` | GitHub PAT for star count fetching |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |

## Scripts

Run these from `frontend/`:

```bash
npm run dev      # Start the local development server
npm run lint     # Run ESLint
npm run build    # Build the production site
npm run start    # Serve the production build locally
```

## Content And Links

Global links and metadata live in `frontend/app/lib/site.ts`. Update that file when the landing page needs a new canonical site URL, GitHub link, release-download URL, support email, or creator profile.

## Deployment

The app is a standard Next.js site deployed on Vercel. Before shipping:

```bash
cd frontend
npm run lint
npm run build
```

## License

AGPL-3.0 &mdash; see [LICENSE](LICENSE) for details.
