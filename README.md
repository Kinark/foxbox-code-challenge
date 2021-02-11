# FoxBox Cocktail Test

![Demo GIF](./demo.gif)

This is the test from Igor Marcossi.

## How to run
1. [Download and install Node.js](https://nodejs.org/en/download/).
2. Clone/download the project.
3. Run `npm install` or `yarn` inside the project's root.
4. Run `npm run ios` or `npm run android`.
5. Enjoy!
## Extra libs used
- `react-native-svg`: To enable svg use.
- `react-native-svg-transformer`: To enable svg file importing.
- `styled-components`: To enable easy styling, clean code and awesome props control over simple components.
- `react-native-gesture-handler`: To enable drag control for the SearchPanel.
- `axios`: The standart request lib in dev world.
- `axios-cache-plugin`: Little middleware to enable cache in `axios`.
- `debounce`: Little helper lib to apply debounce technique.

## Design
I've decided use the provided wireframes to make a beautiful and enjoyable UI, with a nice UX. It has animations, drag and drop and other gimmicks that make apps way more fun and pleasant to use.

## Big amount of data
I'm already caching the GET results, however, if we had a bigger data, I'd suggest to use some good search engine like Elasticsearch or even Algolia.
