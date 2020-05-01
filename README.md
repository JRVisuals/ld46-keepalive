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

- Additional shop items: other potions, weapons, armor, etc
  - Potion ideas:
    - Invisibility - enemies do not attack the hero
- Real enemy artwork and enemy variety (~~slime~~, skeleton, giant head)
- Refactor enemy manamgement system to make it more dynamic
- Refactor Component Type definitions to use a base type and extend as needed
- ~~A time survived clock~~
- Title and instructions along with a ~real game loop~ lol
- More music and sound (~~main theme~~, ~~menu theme~~, longer main theme w/ melody)
- Post effects like glows and sparks
- Additional animation frames for all the things
- Ground block variety
- Background parallax layer variety
- Finish a run (sorry the princes is in another castle), get bonus/buff, next level (?)
- Custom bitmap fonts (big one for time and coins, small one for menus)

### Next Up : Getting Enemy Waves Working

- A wave system and increasing difficulty over time
  - Wave manager
  - Wave timer
  - Data structure to define waves
  - Refactor existing enemy manager to work with wave system

### (Pause) : Getting the Shop Working

- Get haste potion working
- Tooltips for potions
- ~~Get armor potion workin~~
- ~~Have the heart be mask based rather than frames based to show 0-100 HP~~
- ~~Tweak potions so they can't be purchased until they respawn~~
- ~~Get spritesheets working~~
- ~~Add cooldown to potions~~
- ~~Add cooldown visual~~
- ~~Further refactoring of shop inventory to make it more dynamic~~

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
