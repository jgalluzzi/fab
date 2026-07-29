# FAB — F*** Amazon Basics

A browser extension that hides Amazon Basics and other Amazon private-label
products (Amazon Essentials, Amazon Elements, Solimo, etc.) from search
results and listings on amazon.com — so you actually see third-party
sellers instead of Amazon quietly competing against everyone on its own
platform.

## Features

- Hides matching product cards on search results, sponsored strips, and
  carousels
- Live toolbar badge showing how many products were hidden on the current
  page
- Editable keyword list — add or remove brands from the popup
- On/off toggle
- Runs entirely locally: no network requests, no tracking, no data
  collection (see [`PRIVACY.md`](./PRIVACY.md))

## Install (unpacked, for development)

1. Clone this repo
2. Go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select this folder

## How it works

`content.js` scans product cards on amazon.com for brand text matches
(configurable in the popup) and hides matches with a CSS class. A
`MutationObserver` keeps re-scanning as Amazon lazy-loads more results
while you scroll or paginate. `background.js` keeps the toolbar badge in
sync with the current tab's hidden count.

## Known limitations

- Text-match based, so it can occasionally hide something that just
  mentions a blocked brand in passing (e.g. a comparison note) — edit the
  keyword list in the popup to tune this
- Amazon's DOM changes periodically; if filtering stops working after a
  redesign, `CARD_SELECTORS` in `content.js` is the first place to check
- Currently scoped to `www.amazon.com` only

## Contributing

Issues and PRs welcome.

## Contact

fuckamazonbasics@jgalluzzi.com

## License

MIT — see [`LICENSE`](./LICENSE).
