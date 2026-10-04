# Asset register

This register covers non-code files shipped from `public/` and the provenance records archived under `docs/`. SHA-256 values for the current copies are in [`docs/provenance/asset-hashes.txt`](docs/provenance/asset-hashes.txt). Dates from Finder/macOS file metadata are labeled as local file timestamps; they are not independent third-party timestamps.

The root MIT License applies to software code. It does not grant permission to use Photon names, logos, or brand assets. Third-party files retain their own terms. This register records available evidence and unresolved provenance; it does not make a legal determination.

## Cloud imagery

| Repository file(s) | Source and original filename | License/source status | Date obtained or added | Modification status |
| --- | --- | --- | --- | --- |
| [`public/pexels-ian-panelo-8726326.jpg`](public/pexels-ian-panelo-8726326.jpg) and byte-identical archive copy [`docs/provenance/assets/pexels-ian-panelo-8726326.jpg`](docs/provenance/assets/pexels-ian-panelo-8726326.jpg) | Original local filename: `pexels-ian-panelo-8726326.jpg`. macOS `Where From` metadata records [the Pexels CDN URL](https://images.pexels.com/photos/8726326/pexels-photo-8726326.jpeg?cs=srgb&dl=pexels-ian-panelo-8726326.jpg&fm=jpg) and `https://www.pexels.com/`. Photo ID: `8726326`. | Pexels source indicated by download metadata. The filename says “Ian Panelo”; the embedded macOS author metadata says “Nai Jose” and contains the copyright note “This photos are not for sale. Contact the owner for more info.” Photographer identity and the conflict are unresolved. Pexels License page: [official license](https://www.pexels.com/legal-pages/license/), consulted 2026-10-04. No copy of its terms from the 2026-10-03 download date was found. | Local file creation and modification timestamps: 2026-10-03 21:10:18 +01:00. These dates are recorded from filesystem metadata. | Preserved as downloaded. The archive copy's SHA-256 matches both the file in `~/Downloads/` and the existing `public/` copy; no image bytes were changed. |
| [`docs/provenance/assets/clouds.png`](docs/provenance/assets/clouds.png) | Original local filename: `clouds.png`; macOS `Where From` metadata says `chatgpt.com`. | AI-generated/edited cloud output according to its metadata and the owner’s account. Whether this exact file was extended from photo ID `8726326` is not established by an edit record. | Local file creation and modification timestamps: 2026-10-03 21:11:28 +01:00. | Preserved output copy; not the unmodified Pexels original. |
| [`public/clouds.webp`](public/clouds.webp) | Original filename: `clouds.webp`. Its current bytes were added in the 2026-10-03 brand-and-styles commit. The file at the same path in the 2026-09-22 commit has a different SHA-256. | Owner reports the current cloud artwork is based on the Pexels image and AI-extended. That exact edit chain is not encoded in the file or Git history. | Current file local timestamps: 2026-10-03 21:13:07 +01:00. Current byte version in commit [`7b353559ecb895964a313bbc6f6eca3b110f6e06`](https://github.com/PhotonBrowser/landing/commit/7b353559ecb895964a313bbc6f6eca3b110f6e06), 2026-10-03 23:28 +01:00. | WebP image file. Exact conversion and edit steps are not recorded. |
| [`public/clouds-low.png`](public/clouds-low.png) | Original filename: `clouds-low.png`; macOS `Where From` metadata says `chatgpt.com`. | Owner reports this cloud artwork is based on the Pexels image and AI-extended. The file itself does not prove the relationship. | Local file creation and modification timestamps: 2026-10-03 21:16:35 +01:00. | AI-generated/edited PNG output according to owner report and local source metadata. |
| [`public/clouds-low.webp`](public/clouds-low.webp) | Original filename: `clouds-low.webp`. | Same owner-reported background source as `clouds-low.png`; exact conversion process not recorded. | Local file creation and modification timestamps: 2026-10-03 21:17:01 +01:00. | WebP derivative; exact conversion steps are not recorded. |

The current [Pexels License](https://www.pexels.com/legal-pages/license/) page, consulted on 2026-10-04, says Pexels photos may be used for free and modified, and that credit is not required. It also lists limits on selling unaltered copies, redistributing through stock or wallpaper platforms, and using a photo as a trademark. This is a description of the page on the consultation date, not a copy of the page as it appeared at the download time. The exact historical license page remains unavailable. A ChatGPT conversation shortly before the download contains a Pexels source/license recommendation, but no copy of the license text. A read-only attempt to query the local Chrome and Safari history databases was denied by macOS, so no Pexels history entries were recovered through that route. The direct CDN URL, photo ID, original filename, local download metadata, conflicting photographer fields, current license link, and hashes are preserved here for follow-up.

## Photon branding and exported brand kit

The repository does not record a separate original design file, creator history, or external source for the brand assets. `public/brand-kit/source.json` records vector revision `4092643caf5e41319f9d87f31e6335bb` and a SHA-256 value. The brand-kit README says technical exports use the stored vector; the guide describes the palette as estimated from an uploaded raster. The current bundle is present in the October 3, 2026 brand-and-styles commit; some brand-kit files also appeared in the September 22 commit. They are not granted under the root MIT License.

The files in the brand-kit group are:

- `public/favicon.svg`
- `public/brand-kit/monotone-planet.svg`
- `public/brand-kit/logo/`: `logo.svg`, `logo-black.svg`, `logo-color.svg`, `logo-cropped.svg`, `logo-white.svg`, and the 512, 1024, and 2048 PNG exports for black, color, and white variants.
- `public/brand-kit/generated/favicons/`: `monotone-planet-16.png`, `monotone-planet-32.png`, and `monotone-planet-48.png`.
- `public/brand-kit/web/`: `apple-touch-icon.png`, `favicons/favicon.svg`, `favicon.ico`, `favicon-16.png`, `favicon-32.png`, `favicon-48.png`, `favicon-64.png`, `icons/icon-192.png`, `icon-512.png`, `icon-maskable-192.png`, `icon-maskable-512.png`, `manifest.webmanifest`, and `metadata.html`.
- `public/brand-kit/social/`: `og-image.svg`, `og-image.png`, `profile-image.svg`, and `profile-image.png`.
- `public/brand-kit/native-app/android/manifest-snippet.xml`; `public/brand-kit/native-app/android/res/drawable/ic_launcher_foreground.xml`; `public/brand-kit/native-app/android/res/drawable/ic_launcher_monochrome.xml`; `public/brand-kit/native-app/android/res/mipmap-anydpi-v26/ic_launcher.xml`; `public/brand-kit/native-app/android/res/mipmap-anydpi-v33/ic_launcher.xml`; `public/brand-kit/native-app/android/res/mipmap-hdpi/ic_launcher.png`; `public/brand-kit/native-app/android/res/mipmap-mdpi/ic_launcher.png`; `public/brand-kit/native-app/android/res/mipmap-xhdpi/ic_launcher.png`; `public/brand-kit/native-app/android/res/mipmap-xxhdpi/ic_launcher.png`; `public/brand-kit/native-app/android/res/mipmap-xxxhdpi/ic_launcher.png`; and `public/brand-kit/native-app/android/res/values/colors.xml`.
- `public/brand-kit/native-app/ios/AppIcon.appiconset/AppIcon-1024.png` and `Contents.json`.
- `public/brand-kit/mockups/cap.png`.
- `public/brand-kit/source.json` records the vector revision and checksum.
- `public/brand-kit/README.md`, `public/brand-kit/brand-guide/brand.css`, `guide.md`, and `palette.json` document the included kit and its exports.

Source provenance for the brand-kit files beyond the records above remains unverified. Individual file hashes appear in `docs/provenance/asset-hashes.txt`.

## Design-history screenshots

| Repository file | Original filename and source | License/source status | Capture date | Modification status |
| --- | --- | --- | --- | --- |
| `docs/design-history/Snapzy_2026-10-03_20-53-34_226.png` | Same as the original screenshot filename in `~/Desktop/Snapzy/`; local screen capture of an intermediate Photon page. | Composite of Photon page content and its page assets; rights follow the listed underlying assets. Exact source commit is not embedded. | Original local file timestamps: 2026-10-03 20:53:34 +01:00. | Byte-identical copy; not edited, cropped, or retimed. |
| `docs/design-history/Snapzy_2026-10-03_23-03-46_563.png` | Same as the original screenshot filename in `~/Desktop/Snapzy/`; local screen capture of the cloud-background hero and waitlist. | Composite of Photon page content and its page assets; rights follow the listed underlying assets. Exact source commit is not embedded. | Original local file timestamps: 2026-10-03 23:03:46 +01:00. | Byte-identical copy; not edited, cropped, or retimed. |

Their hashes are included in the asset hash list.
