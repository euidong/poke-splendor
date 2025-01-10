# Pokémon Splendor

## TODO

Target Device is mobile (base size: iPhone SE2), and I also have plan to deploy as a chrome extension.

- [x] Base Setup (Typescript, ReactJS, MobX)
- [x] Base Logic (Poke Splender)
  - [x] Create test codes
  - [x] Implement Logic
- [x] Base Moderator (Document Event Subscription)
- [ ] Base UI
  - [x] Collect Image files (Poke Ball, Pokemon, Background, Character, etc.)
  - [x] Implement Card UI (Back, and Front)
    - [x] Front
    - [x] Back
  - [x] Implement Ball Token UI
  - [x] Implement Board UI
  - [x] Implement Player Stat UI
  - [x] Implement Controller UI
  - [x] Winner View UI
  - [ ] Implement Summarized Version
    - [ ] Card Front
    - [ ] Player Stat
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
  - [ ] Implement Observing system
    - [ ] Inner Player Observing
    - [ ] Outer Player Observing
  - [ ] Implement Disconnection / Reconnection
    - [ ] Implement uuid per device (IP? deviceID? login system? - db??)
  - [ ] Deploy Own Signaling server (now can be conflic with other system)
- [ ] New features
  - [ ] Implement Timer for automatical turn changing
  - [ ] Implement Animation for card selection, turn change, etc.

## Signaling Server

Image: debian-12-bookworm-v20241210

```bash
sudo apt update
sudo apt install git nodejs npm
sudo npm install -g yarn
yarn install
```
