### Bootstrapped with DCollage (Digital Collage Boilerplate w/ PIXIJS)

The goal of DCollage is to facilitate the creation of multi-layered, interactive, collages similar to those I created back in the days of Flash. Surprise it works for simple games too!

# Ludum Dare #46 - Theme: Keep it Alive

**Keep Ye Alive** is a game began as a [Ludum Dare](https://ldjam.com/events/ludum-dare/46) compo submission. It was created alone, and from scratch (boilerplate aside) in 24 hours. The first commit and tag are the state in which the game was submitted. Future commits are my efforts to flesh it out into the game I conceptualized.

![Cover Image](https://jrvisuals.com/games/ld46-latest/github-images/keepyealivecover.jpg)

- [My Ludum Dare Submission Page](https://ldjam.com/events/ludum-dare/46/keep-ye-alive) - Please take a moment to vote and leave feedback if you're a participant
- [Play the Original Here](https://www.jrvisuals.com/games/ld46/) - This is the product of 24 hours as it was submitted for the Compo
- [Play the Most Recent Build](https://www.jrvisuals.com/games/ld46-latest/) - This is where I'm posting progress made outside of the bounds of the Compo

## Concept and Mechanics

The concept is simple. It's your classic warrior versus the world side-scroller except that it isn't. The Hero fights on his own earning coin for enemies slain and taking his lumps if he doesn't land the critical hit precisely. Your role is to manage The Heroes purchasing habits in order to keep ye alive. By clicking items in Ye Shoppe, for example a health potion, you purchase it and The Hero will quaf it immediately; replenishing their hitpoints and expending coin.

The initial build only had a single red potion which cost one coin and a single enemy which was placeholder art.

## Roadmap

Given the opportunity I'll keep working on this on and off until the next LD in October of 2020. These are some things I would like to add:

- [ ] Additional shop items: other potions, weapons, armor, etc
  - Potion ideas:
    - Invisibility - enemies do not attack the hero
    - Coin magnet - all couns are automatically gatherd for X seconds
- Real enemy artwork and enemy variety
  - [x] slime
  - [ ] skeleton
  - [ ] giant head (final boss 1)
- End of level SHOP/CHEST: at the end of the level, before the boss there will be

  - [ ] a SHOP which allows The Hero to purchase ONE of TWO types of items

    - [ ] give a permanent DODGE abilities ( dash, roll, jump, back-step )
    - [ ] new WEAPON ( bow, pole axe, better swort)

  - [ ] a CHEST which spawns an item that permanently buffs The Hero
    - [ ] rezilience - reduce damage taken by 1% - stacks
    - [ ] strength - increase damage done by 1% - stacks
    - [ ] health - increase max health by 1% - stacks
    - [ ] metabolizm - increase potion duration by 1% - stacks
    - [ ] luck - increase chance for gem drop (gem is worth 10 coins) - stacks

- End of level BOSS
- [ ] Refactor enemy manamgement system to make it more dynamic
- [ ] Refactor Component Type definitions to use a base type and extend as needed
- [x] A time survived clock
- [ ] Title and instructions
- [ ]More music and sound
  - [x] main theme
  - [x] menu theme
  - [ ] longer main theme w/ melody
  - [ ] fanfare for wave complete
- [ ] Post effects like glows and sparks
- [ ] Additional animation frames for all the things
- [x] Ground block variety
  - [x] Fix up tiling
- [ ] Background parallax layer variety
  - [x] updated backgrounds with perfect tiling
  - [x] first biome backgrounds
  - [ ] second biome backgrounds
  - [ ] third biome backgrounds
- [ ] Finish a run (sorry the princes is in another castle), get bonus/buff, next level (?)
- [ ] Custom bitmap fonts
  - [ ] Small font (for menus and tool tips)
  - [ ] Large font (big one for time and coins)
- [ ] Finish the first iteration of the shop
  - [x] Fix up shop panel graphics
  - [ ] Get haste potion working
  - [ ] Tooltips for potions
- [ ] Add a proper preloader
- [ ] Options Panel
  - [ ] Adjust Music Volume
  - [ ] Adjust SFX Volume
  - [ ] Pause button or keyboard command
  - [ ] Other game options...
- [ ] Balance Audio - some sounds effects are much louder than others
- [ ] High scores
  - [ ] Online leaderboard w/ database (later)
- [ ] Tooltips for potions

### Up Next : Round of Polish / Odds and Ends

- [ ] ** Get haste potion working -> switch this to be a coin magnet potion **
- [ ] Tint-friendly enemy sprites (can we use a single gray sprite set and tint it to make any color cubes?)
- [ ] add gem drop (rarely, 0 to 1 times per wave based on luck attribute)
  - [ ] make gem sprite
  - [ ] add drop mechanic and luck chance (gem is worth 10 coin)

### Completed!

#### General Polish / Odds and Ends

- [x] Get all "oldschool" sprite sheets into main sprite sheet
  - [x] Hero
  - [x] Others?
- [x] Make PIXI stop updating when window is unfocused
- [x] REFACTOR: Use enums for particle keys (heroParticles)
- [x] TEMPFIX: Reset wave counter when on final wave
- [x] TEMPFIX: When on final wave, reduce spawn time by 250 each time you clear the final wave
- [x] High scores
  - [x] Store personal best
- [x] Tweak Hero attack animation
  - [x] Add a glint/shine to the sword to indicate "kill frame"
- [x] Dynamic coin drops
  - [x] Enemies drop different number of coins
  - [x] Coin drop functionality
  - [x] Coin drop animation
  - [x] Spinning coin animation
  - [x] Design and add SFX for coins
- [x] Fix up ground tiling (more subtle variation, perfect tiling)
- [x] Fix Background/Sky (perfect tiling)
- [x] Faded effect when hero is dead (now w/ godrays)

- [x] Potion effects on hero
  - [x] Hand animated effect layer / tintable swirl animation
  - [x] Particle effect layer
  - [x] Filters or post effects
  - [x] Bonus: Try something with PIXI particle container
  - [x] Bonus: Magic sound for potion
  - [x] Bonus 2X: Get particles working for potion effects

#### Getting Enemy Waves Working

- A wave system and increasing difficulty over time
  - [x] Wave manager
  - [x] Wave display
  - [x] Data structure to define waves
    - [x] Allowing for variation in enemy speed
    - [x] Allowing for multiple enemy types within a single wave
    - [x] Wave enemies should be weighted
  - [x] Refactor existing enemy manager to work with wave system

#### Getting the Shop Working

- [x] Get armor potion workin
- [x] Have the heart be mask based rather than frames based to show 0-100 HP
- [x] Tweak potions so they can't be purchased until they respawn
- [x] Get spritesheets working
- [x] Add cooldown to potions
- [x] Add cooldown visual
- [x] Further refactoring of shop inventory to make it more dynamic

## Libraries Used

- PIXIJS - WebGL renderer with Canvas fallback and so much more [https://github.com/pixijs/pixi.js](https://github.com/pixijs/pixi.js)
- pixi-filters - Collection of community-authored custom display filters for PixiJS [https://github.com/pixijs/pixi-filters](https://github.com/pixijs/pixi-filters) Currently yarn linked to a local version of the repo in order to use the as of yet un-merged changes to the godray filter which add alpha functionality.
- GSAP - tween animation library [https://greensock.com/docs/v2/Plugins/PixiPlugin](https://greensock.com/docs/v2/Plugins/PixiPlugin)

## Tools Used

- Visual Studio Code
- Sublime Text
- Aesprite
- Audacity
- Reason

# Build Scripts

- `yarn start` to go into development mode with live reload
- `yarn clean` to clean the `/dist` directory
- `yarn build` to create a distributable bundle in `/dist`
- `yarn docs` to generate markdown documentation in `/docs`

# The Stack

- Pixi.JS
- TypeScript
- Prettier
- Rollup
- TSDoc / TypeDoc
