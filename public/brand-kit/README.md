# Digital brand kit

- logo/: SVG master, cropped SVG, black/white variants and transparent PNGs.
- web/: favicons, Apple touch icon, web-app icons, manifest and HTML metadata.
- native-app/: iOS asset catalog, Android adaptive/monochrome and legacy icons.
- social/: OG image (1200×630) and profile image (1024×1024), PNG and SVG.
- mockups/: cap and T-shirt digital presentation images.
- brand-guide/: palette, CSS variables and usage notes.

## Website
Copy web/ contents into your site's /brand/ public directory, and social/ to /brand/social/. Adapt metadata.html to your framework. Replace example.com and description placeholders; adjust start_url if needed. A manifest alone does not create an installable PWA.

## Native apps
Import AppIcon.appiconset into Xcode Assets.xcassets; select it as the app icon. The default source is opaque and square. Merge Android res/ into your app resources and the icon attribute into your existing manifest, resolving naming conflicts. Adaptive artwork fits inside the 66dp safe circle. Native resources have not been compiled in Xcode/Android Studio: preview them on device before release.

## Source
All technical files use the same stored vector revision. Kit logo exports remain transparent even if you preview the SVG on white. Mockups are illustrative; no physical merchandise is included. This local edition has no payment or order processing.
