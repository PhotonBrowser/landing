# Design and asset provenance

This note records provenance evidence available in this repository as of 2026-10-04. It does not change the website or establish a legal conclusion. Dates below are the Git commit dates recorded in this checkout; they are not deployment timestamps.

## Photon design history

| Commit | Recorded date (+01:00) | Evidence in the commit |
| --- | --- | --- |
| [`ac1bb245b1ce8cc47527ba599e88044f97842677`](https://github.com/PhotonBrowser/landing/commit/ac1bb245b1ce8cc47527ba599e88044f97842677) | 2026-09-22 11:51 | Adds the Photon landing page with a centered cloud card, brand, hero heading and copy, and waitlist control. The control already changes width between states. |
| [`05fc686cf023d10cc661378eee7b7773114697c8`](https://github.com/PhotonBrowser/landing/commit/05fc686cf023d10cc661378eee7b7773114697c8) | 2026-09-22 14:10 | Adds the morphing waitlist button. `WaitlistButton.tsx` animates its width between idle, input, loading, and joined states with a spring transition. |
| [`e5a31ed42644e3cce243135601abcc2a0b1a92c6`](https://github.com/PhotonBrowser/landing/commit/e5a31ed42644e3cce243135601abcc2a0b1a92c6) | 2026-09-22 15:53 | Adds the animated weather background. |
| [`4a25de39b34b42e4fefb94c4cebc2984390fc4a7`](https://github.com/PhotonBrowser/landing/commit/4a25de39b34b42e4fefb94c4cebc2984390fc4a7) | 2026-10-03 20:18 | Removes the earlier Astro landing implementation while resetting the project to Vite, React, Biome, and shadcn. |
| [`7b353559ecb895964a313bbc6f6eca3b110f6e06`](https://github.com/PhotonBrowser/landing/commit/7b353559ecb895964a313bbc6f6eca3b110f6e06) | 2026-10-03 23:28 | Adds the current brand asset bundle and landing styles. |
| [`d7294e943c8bda29e2f46480efd0c321b3ee98f2`](https://github.com/PhotonBrowser/landing/commit/d7294e943c8bda29e2f46480efd0c321b3ee98f2) | 2026-10-03 23:28 | Builds the current React landing and waitlist flow. |

The repository has no Git tags. Its history supports that Photon had the centered hero and animated/morphing waitlist concepts in its own code by September 22, 2026. The owner reports that this earlier design was deployed before the other browser project's announcement. This checkout contains no deployment records or dated external announcement with which to independently verify that relative timing.

The [previous Photon deployment on Vercel](https://photonapp-3wbvfdw3v-theoslaters-projects.vercel.app/) is recorded in the authenticated Vercel dashboard as production deployment `D77bQxjQFno4xTFwWXYPyhR9adME` for project `theoslaters-projects/photonapp`. The dashboard shows it was created on 2026-09-23 at 22:11:56 BST from branch `main`, commit [`3c5b97fca9f16f6da078381b9eef0ecee95d1705`](https://github.com/PhotonBrowser/landing/commit/3c5b97fca9f16f6da078381b9eef0ecee95d1705), and was Ready when inspected on 2026-10-04. A metadata record transcribed from that dashboard is in [`docs/provenance/deployment-records/D77bQxjQFno4xTFwWXYPyhR9adME.json`](docs/provenance/deployment-records/D77bQxjQFno4xTFwWXYPyhR9adME.json). The unauthenticated deployment URL currently redirects to Vercel SSO, so its rendered page could not be inspected in this session. The owner reports the deployment predates the other browser project's announcement; the announcement date is not in this repository, so that relative timing remains owner-reported.

The owner reports that the attribution-chip presentation was inspired by a Cirenic reference and iterated with Photon-specific text and avatar assets. The owner also reports that Cirenic source code, branding, written content, and assets were not copied. The repository review did not identify copied material from that project. Git history alone cannot prove a negative or establish the provenance of every line and asset. No other specific later inspiration has been independently established here.

## Assets

### Cloud background

An original Pexels JPEG and its downloaded filename have now been recovered. A copy is preserved at [`docs/provenance/assets/pexels-ian-panelo-8726326.jpg`](docs/provenance/assets/pexels-ian-panelo-8726326.jpg); its SHA-256 matches the file in Downloads. macOS download metadata gives this source URL: [Pexels image 8726326](https://images.pexels.com/photos/8726326/pexels-photo-8726326.jpeg?cs=srgb&dl=pexels-ian-panelo-8726326.jpg&fm=jpg), with `https://www.pexels.com/` as the referring site. The filename identifies “Ian Panelo,” while the embedded macOS author field says “Nai Jose” and its copyright field says “This photos are not for sale. Contact the owner for more info.” The photographer attribution and the meaning of that conflicting metadata remain unresolved; no photographer credit has been added.

The local file creation and modification times for the Pexels download are 2026-10-03 21:10:18 +01:00. These are local filesystem metadata, not an independent timestamp. The previous ChatGPT conversation contains a Pexels source/license recommendation shortly before the download, and the generated cloud PNGs carry `chatgpt.com` in their macOS `Where From` metadata. The owner reports that the Pexels image was AI-extended. The repository and available conversation do not preserve a processing log proving the exact edit relationship between the source and each output.

The [Pexels License](https://www.pexels.com/legal-pages/license/) was consulted on 2026-10-04. No copy of the license page as it appeared at the 2026-10-03 download time was found. A historical license snapshot therefore remains **unverified**. A read-only query of local Chrome and Safari history databases was denied by macOS. See [`ASSETS.md`](ASSETS.md) for the per-file register and [`docs/provenance/asset-hashes.txt`](docs/provenance/asset-hashes.txt) for current SHA-256 values.

The current `public/clouds.webp` bytes are not the same as the earlier `public/clouds.webp` blob first committed on September 22: the earlier blob hashes to `b090ada7c32b3397c07bc8e7d411867cdb0317a9b05be326d2a1ffc9e034655a`; the current file hashes to `2511a1707e8a5437deb787be251518b516e0140b567e417209c45ddb95377edc`. The current WebP and the October 3 `clouds-low` derivatives are documented separately in the asset register.

### Photon brand assets

The logo and brand-kit files are present in the September 22, 2026 Photon landing commit. `public/brand-kit/source.json` records a vector revision (`4092643caf5e41319f9d87f31e6335bb`) and SHA-256 value. The brand-kit README says technical exports use the stored vector; the guide describes the palette as estimated from an uploaded raster. The repository does not record a separate original design file, creator history, or external source for these brand files. Their presence and revision are verifiable; authorship and full source provenance are not independently established by those records.

## Design continuity

The September 22 history establishes the following Photon design elements before the current landing-page implementation:

- centered hero composition;
- large headline with supporting copy;
- centrally positioned waitlist control;
- animated/morphing waitlist interaction;
- full-viewport cloud-card background treatment.

Later revisions changed imagery, navigation styling, attribution UI, typography details, spacing, and other presentation choices. This note does not claim that every element of the current design existed in the September 22 version.

Two existing October 3 screen captures are preserved byte-for-byte in [`docs/design-history/`](docs/design-history/README.md). They show intermediate local states; neither embeds a source commit or deployment ID. No September 22 screenshot was found in the reviewed local screenshot folder, so the September 22 evidence remains Git history plus the later Vercel deployment record, not a contemporaneous screenshot.

## Notices and scope

The repository contains a root MIT `LICENSE`, added in commit [`bdb1024ed6945a1be2eb9c1d48a38d3a78a10709`](https://github.com/PhotonBrowser/landing/commit/bdb1024ed6945a1be2eb9c1d48a38d3a78a10709) on 2026-10-04. A scope note now directs readers to `ASSETS.md`: Photon names, logos, and brand assets are not granted under the MIT License, and third-party assets retain their listed terms. No application source files or public asset paths were changed for this provenance work; the Pexels original has an additional byte-identical copy under `docs/provenance/assets/`.
