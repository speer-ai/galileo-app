# Galileo Tracker

![titleLogo](public/galileoLogo.png)

Galileo is a satellite tracker inspired by sites such as [SatelliteTracker3D](https://satellitetracker3d.com/), [StarlinkMap](https://satellitemap.space/), and [KeepTrack](https://github.com/thkruz/keeptrack.space). Galileo currently uses [satellite.js](https://github.com/shashwatak/satellite-js) and its SGP4 calculations for forward and backward object propogation. It is designed for flexibility with the code, and a smooth user experience in mind.

![demoPicture](public/demoPic.png)

Galileo is built using ES2020 and Vite. To run locally, install git and node first. Then run the following at the cli

## Set up a Local Copy

```bash
git clone https://github.com/speer-ai/galileo-app         # Clone files to local
cd ./galileo-app/                                         # Switch into the directory
npm install                                               # Install dependencies
```

then either

```bash
npm run dev                                               # Run a hot dev version
```

or 

```bash
npm run build                                             # Build the project
npm start                                                 # Start the server
```

to start a copy.

## Interface and Usage
Galileo displays a fullscreen rendering of earth and sattelites using [@react-three-fiber](https://github.com/pmndrs/react-three-fiber) and [Tailwind.css](https://tailwindcss.com/) to style the page. Galileo allows for dynamic date manipulation and provides many keyboard shortcuts for users to quickly navigate between objects. Galileo may be updated at a later point for use with live sensors and data and/or the ability to control radio antenna or communication devices.

- Hook up live feed (camera maybe)
- Control physical antenna
- Detect, track, and predict trajectories of objects (not necessary satellites)

## Version
Galileo Tracker v1.3

## Bugs
- At certain angles, all objects will disappear from view (likely not in frustrum)
