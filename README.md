# Compress Image to KB

Compress JPG, PNG or WebP images to an exact file size (20KB, 50KB, 100KB, 200KB or any custom target) without uploading them to a server.

Live: <https://crusher-labs.github.io/compress-image-to-kb/>

## What it does

Give it a target size in KB and it finds the highest quality that fits under it: binary search over the encoder's quality setting, with proportional downscaling when quality alone cannot reach the target. Batch-friendly; downloads are named after the target size.

## Privacy

This tool runs entirely in your browser. There is no server. No data is uploaded, no telemetry, no analytics. The only network requests fired are the page-load fetches for the framework's CSS / JS (from `cdn.jsdelivr.net` and `fonts.googleapis.com` / `fonts.gstatic.com`); your inputs and outputs never leave the tab.

## Framework / hosting

- Static HTML / CSS / JS deployed via GitHub Pages from this repo's `main` branch.
- UI chrome is the published `crusher-ui-kit` static contract; the pinned version and its SRI hashes are managed fleet-wide by `tools-hub/scripts/bump-kit.mjs`.

## Development

- Open `index.html` directly in a browser. No build, no dependencies.
- Or serve the parent workspace via the hub's preview server: `cd ../../tools-hub && npm run preview` then visit `http://127.0.0.1:8723/utility-tools/compress-image-to-kb/`.

## License

MIT.
