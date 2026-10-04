# Layer8 Orientation Games

Two operator-run games for the Layer8 cybersecurity club orientation:

- **Password Cracker** (`cracker.html`): solve the clues and enter the 4-digit vault code before the 2-minute timer runs out.
- **Real or Fake** (`realfake.html`): pick the real logo or the real website link within 10 seconds. There is no score, because it runs as one station of the Hopscotch game.

All content comes from the two source PDFs: `password cracker.docx.pdf` and `logos.pdf`.

## Running it

No install, no server, no internet. On each laptop:

1. Copy or clone this folder.
2. Double-click `index.html`. It works from `file://` in Chrome, Edge or Firefox.
3. Use full screen (F11) so the player can read it from across the table.

Each laptop runs its own copy, and its own vault and round order is saved in the browser. If the browser blocks storage, the game still works; it just doesn't remember the order.

## Hub controls

On the hub, use ←/→ (or the mouse) to pick a game and press Enter, or press 1 or 2 to jump straight to one.

## Effects

- Effects are switched off automatically if the laptop has "reduce motion" turned on in its accessibility settings.
- Sounds are simple chiptune beeps made in the browser, so there are no audio files. The speaker icon mutes them.
- The game screens skip the scanline overlay, so logos and clue text always show cleanly.

## Operating the games

The team member drives the laptop and the participant answers out loud.

### Password Cracker
| Action | How |
|---|---|
| Start a vault | **Start Vault**, or press Enter. The clues stay hidden until then, and the 2:00 timer starts. |
| Enter the code | Type the digits. The cursor moves to the next box on its own. Backspace goes back. |
| Submit | **Crack Vault**, or press Enter in a box. |
| Hint | Give the hint verbally, then click **Hint**. This takes 10 seconds off the timer. |
| Next vault | Shown after a crack or when time runs out. It picks a random vault this laptop hasn't shown yet. |
| Hints | Each vault has a written hint in the operator panel. Read it out, then click **Hint**. |
| Operator panel | Gear icon, top right. **Hold to reveal** shows the answer only while the button is held. You can also restart the vault, jump to a specific vault, or reshuffle the rotation. |

### Real or Fake
| Action | How |
|---|---|
| Choose | Click a card, or press **1** / **←** for left and **2** / **→** for right. |
| Next round | **Next**, or press Enter / N. |

Each round is randomly a logo or a URL challenge. The real option's side is also random. When the 10 seconds run out, the options lock and the real one is highlighted.

## Project layout

```
index.html          hub page
cracker.html        Password Cracker
realfake.html       Real or Fake
css/style.css       shared arcade theme
js/fx.js            effects: animated starfield + neon grid, CRT power-on, READY/GO countdown,
                    pixel confetti, screen flashes, shake, card tilt
fonts/              bundled Press Start 2P, Doto, Geist and Geist Mono (SIL OFL), so it works offline
img/brand/          Layer8 wordmark + "8" mark, PES University logo, favicon
js/common.js        shared helpers (shuffled decks, storage, sounds)
js/vaults.js        all 76 vaults, verbatim, plus the flagged list
js/cracker.js       Password Cracker logic
js/logos.js         60 logo pairs
js/urls.js          20 URL pairs
js/realfake.js      Real or Fake logic
img/logos/          120 logo images (<slug>_real.png / <slug>_fake.png)
```

## Vault content and corrections

`js/vaults.js` holds all 76 vaults (Vault Lock 01–75 plus 37 Part 2), and **all 76 are playable**. Each vault also has an operator hint.

The vaults below were corrected because the original sheet's answer didn't match its clues, or more than one code fitted. Every vault's clues were brute-force checked against all 10,000 codes: each one now has exactly one valid code, and it's the listed answer. Each change is logged in the `CORRECTED` object at the top of `js/vaults.js`.

| Vault | Answer | What changed |
|---|---|---|
| 04 | 5621 | Added the rule to use only the last digit of two-digit results (the answer already relied on it). |
| 10 | 8056 | 4th-digit sequence changed from 25, 7, 20, 2, 15 to 25, 16, 20, 11, 15 so it really continues to 6. |
| 14 | 4875 | 'First two digits multiply to 24' changed to 32; added 'third digit greater than fourth' so the code is unique. |
| 24 | 8514 | Added 'first digit greater than 5' (4952 also fitted). |
| 25 | 3467 | Added 'digits increase left to right' and 'first digit is prime' (7 other codes also fitted). |
| 38 | 5843 | 'Third digit greater than second' changed to 'less than'; added four clues so 5843 is the only code. |
| 39 | 2971 | Feedback for 4927 and 2751 rewritten to match 2971; added 'first digit is even' so the code is unique. |
| 40 | 1000 | Last step changed from Add 100 to Add 220 so the steps give 1000. |
| 42 | 8640 | 'First = sum of last two' changed to 'first = 2 × third'; 'last digit is prime' changed to 'last digit is even' (0 is not prime). |
| 43 | 1350 | Last step changed from Add 60 to Multiply by 6; answer is now 1350 (old answer 510 was wrong and only 3 digits). |
| 44 | 5867 | Added a fifth guess (9687) so 5867 is the only code (5697 and 5796 also fitted). |
| 48 | 4725 | Added four clues so 4725 is the only code (44 other codes also fitted). |
| 52 | 1680 | Second step changed from Add 400 to Add 2600 so the steps give 1680. |
| 54 | 1340 | Fourth step changed from Multiply by 5 to Multiply by 25; answer is now 1340 (old answer 270 was wrong and only 3 digits). |
| 56 | 8352 | Answer changed from 7353 (repeats the 3) to 8352; added two clues so it is the only code. |
| 60 | 7305 | Added what Hot / Warm mean. |
| 61 | 2914 | Added what Hot / Warm / Cold mean. |
| 72 | 5493 | Intro said 'the sum of each pair', but the lines also subtract and divide; reworded. |

**If you find a new problem:** add the vault's id to the `FLAGGED` object in `js/vaults.js` and the game will skip it until it's fixed.

The full corrected question sheet, with answers and hints, is in `docs/Password-Cracker-Answer-Key.pdf`. The logo and URL answer key is in `docs/Real-or-Fake-Answer-Key.pdf`.

## Logo images

The images were extracted from `logos.pdf` at their native embedded resolution. No redrawing or upscaling was done.

- Five images that the PDF crops on the page were cut to exactly the region the PDF shows: Netflix fake, Nintendo Switch real, NBC fake, Wikipedia fake and Oral-B real.
- MTV and John Deere are single side-by-side screenshots in the PDF, so each was split down the middle.
- **Fake logos are kept exactly as they appear in the PDF.**

Brand names are copied as printed in the PDF, including "Coco cola", "Red bull", "crocs" and "intel". Pairs 52–60 have no name in the PDF, so they were named from the logo.

If an image file is missing, the game shows a red **MISSING IMAGE: <path>** box instead of a broken image.

### Required image files (`img/logos/`)

| # | Brand | Real | Fake |
|---|---|---|---|
| 1 | Netflix | `netflix_real.png` | `netflix_fake.png` |
| 2 | Cartoon Network | `cartoon-network_real.png` | `cartoon-network_fake.png` |
| 3 | Starbucks | `starbucks_real.png` | `starbucks_fake.png` |
| 4 | Dominos | `dominos_real.png` | `dominos_fake.png` |
| 5 | Baskin Robbins | `baskin-robbins_real.png` | `baskin-robbins_fake.png` |
| 6 | Mastercard | `mastercard_real.png` | `mastercard_fake.png` |
| 7 | Rolex | `rolex_real.png` | `rolex_fake.png` |
| 8 | Microsoft | `microsoft_real.png` | `microsoft_fake.png` |
| 9 | Nestle | `nestle_real.png` | `nestle_fake.png` |
| 10 | Porsche | `porsche_real.png` | `porsche_fake.png` |
| 11 | Red bull | `red-bull_real.png` | `red-bull_fake.png` |
| 12 | Shell | `shell_real.png` | `shell_fake.png` |
| 13 | Xiaomi | `xiaomi_real.png` | `xiaomi_fake.png` |
| 14 | Google play | `google-play_real.png` | `google-play_fake.png` |
| 15 | Pringles | `pringles_real.png` | `pringles_fake.png` |
| 16 | Tesla | `tesla_real.png` | `tesla_fake.png` |
| 17 | Kappa | `kappa_real.png` | `kappa_fake.png` |
| 18 | BMW | `bmw_real.png` | `bmw_fake.png` |
| 19 | Subway | `subway_real.png` | `subway_fake.png` |
| 20 | Huawei | `huawei_real.png` | `huawei_fake.png` |
| 21 | Twix | `twix_real.png` | `twix_fake.png` |
| 22 | Visa | `visa_real.png` | `visa_fake.png` |
| 23 | PayPal | `paypal_real.png` | `paypal_fake.png` |
| 24 | Nintendo Switch | `nintendo-switch_real.png` | `nintendo-switch_fake.png` |
| 25 | Spotify | `spotify_real.png` | `spotify_fake.png` |
| 26 | NBC | `nbc_real.png` | `nbc_fake.png` |
| 27 | Coco cola | `coca-cola_real.png` | `coca-cola_fake.png` |
| 28 | Pepsi | `pepsi_real.png` | `pepsi_fake.png` |
| 29 | Walt Disney | `walt-disney_real.png` | `walt-disney_fake.png` |
| 30 | Discord | `discord_real.png` | `discord_fake.png` |
| 31 | Opera | `opera_real.png` | `opera_fake.png` |
| 32 | Wikipedia | `wikipedia_real.png` | `wikipedia_fake.png` |
| 33 | Olympics | `olympics_real.png` | `olympics_fake.png` |
| 34 | Skype | `skype_real.png` | `skype_fake.png` |
| 35 | Tommy Hilfiger | `tommy-hilfiger_real.png` | `tommy-hilfiger_fake.png` |
| 36 | Puma | `puma_real.png` | `puma_fake.png` |
| 37 | Walmart | `walmart_real.png` | `walmart_fake.png` |
| 38 | crocs | `crocs_real.png` | `crocs_fake.png` |
| 39 | Subaru | `subaru_real.png` | `subaru_fake.png` |
| 40 | Firefox | `firefox_real.png` | `firefox_fake.png` |
| 41 | Taco bell | `taco-bell_real.png` | `taco-bell_fake.png` |
| 42 | Cheetos | `cheetos_real.png` | `cheetos_fake.png` |
| 43 | Ikea | `ikea_real.png` | `ikea_fake.png` |
| 44 | Oral-B | `oral-b_real.png` | `oral-b_fake.png` |
| 45 | Maybelline | `maybelline_real.png` | `maybelline_fake.png` |
| 46 | Hershey’s kisses | `hersheys-kisses_real.png` | `hersheys-kisses_fake.png` |
| 47 | Ford | `ford_real.png` | `ford_fake.png` |
| 48 | Adidas | `adidas_real.png` | `adidas_fake.png` |
| 49 | Drive | `drive_real.png` | `drive_fake.png` |
| 50 | intel | `intel_real.png` | `intel_fake.png` |
| 51 | Jaguar | `jaguar_real.png` | `jaguar_fake.png` |
| 52 | Airbnb | `airbnb_real.png` | `airbnb_fake.png` |
| 53 | Android | `android_real.png` | `android_fake.png` |
| 54 | Ariel | `ariel_real.png` | `ariel_fake.png` |
| 55 | Shell | `shell-2_real.png` | `shell-2_fake.png` |
| 56 | LG | `lg_real.png` | `lg_fake.png` |
| 57 | Google Photos | `google-photos_real.png` | `google-photos_fake.png` |
| 58 | Ray-Ban | `ray-ban_real.png` | `ray-ban_fake.png` |
| 59 | MTV | `mtv_real.png` | `mtv_fake.png` |
| 60 | John Deere | `john-deere_real.png` | `john-deere_fake.png` |

## URL pairs

`js/urls.js` holds the 20 "Right" and 20 "Wrong" URLs verbatim from `logos.pdf`, paired by position in the two lists. They are shown the way links look in a document (blue and underlined), but they are text only and never open a website.
