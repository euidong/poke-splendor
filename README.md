# Pokémon Splendor

<div align="center">
  
  ![nodeJS](https://img.shields.io/badge/nodeJS-20.17.0-brightgreen)
  ![typescript](https://img.shields.io/badge/typescript-4.4.2-blueviolet)
  ![react](https://img.shields.io/badge/react-18.3.1-orange)
  ![peerjs](https://img.shields.io/badge/peerjs-1.5.4-blue)
  
</div>

<div align="center">

  ![thumbnail](/images/simple-ui.png)

</div>


## TODO

Target Device is mobile (base size: iPhone SE2), and I also have plan to deploy as a chrome extension.

- [x] Base Setup (Typescript, ReactJS, MobX)
- [x] Base Logic (Poke Splender)
  - [x] Create test codes
  - [x] Implement Logic
- [x] Base Moderator (Document Event Subscription)
- [x] Base UI
  - [x] Collect Image files (Poke Ball, Pokemon, Background, Character, etc.)
  - [x] Implement Card UI (Back, and Front)
    - [x] Front
    - [x] Back
  - [x] Implement Ball Token UI
  - [x] Implement Board UI
  - [x] Implement Player Stat UI
  - [x] Implement Controller UI
  - [x] Winner View UI
  - [x] Implement Summarized Version
    - [x] Card Front
    - [x] Player Stat
  - [ ] Select Font, size, etc.
  - [ ] Re-design Lobby UI
  - [ ] Re-design Winner UI
  - [ ] Go to Lobby button
- [x] Local Game setup
  - [x] Implement Controller logic
  - [x] Fix Capture detail logic
  - [x] Implement Finalization of Game
- [ ] WebRTC setup
  - [x] Select STUN Server - peerJS use google free stun server
  - [x] Implement WebRTC Moderator
  - [x] Implement Matching System  (OnlineLobby, OnlinePlay)
  - [ ] Implement Disconnection / Reconnection
    - [ ] Implement uuid per device (IP? deviceID? login system? - db? localStorage? sessionStorage?)
  - [ ] Implement Observing system
    - [ ] Inner Player Observing
    - [ ] Outer Player Observing
  - [ ] Implement Lobby Loading UI
  - [ ] Deploy Own Signaling server (now can be conflic with other system)
- [ ] New features
  - [x] Implement Timer for automatical turn changing
  - [ ] Implement Animation for card selection, turn change, etc.
