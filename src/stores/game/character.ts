const CharacterTypes = [
  "Ash", // 지우 (지우 & 피카츄)
  "Misty", // 이슬 (이슬 & 고라파덕)
  "Brock", // 웅 (웅 & 롱스톤)
  "Rocket", // 로켓단 (로사 & 로이 & 나옹)
] as const;

type CharacterType = (typeof CharacterTypes)[number];

export type { CharacterType };
export { CharacterTypes };
