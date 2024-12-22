import Game from ".";
import { BallCollection } from "./ballCollection";
import { Nullable } from "../../types";

interface IModerator {
  game: Game;

  init: (numPlayers: number) => Nullable<Error>;

  modifyTokens: (userToken: string, tokens: BallCollection) => Nullable<Error>;
  // get userId from userToken

  // validate input tokens
  //   [Received Token Validation]
  //   1. if number of all tokens > 3, raise Error
  //   2. if the number of tokens of one type > 2, raise Error
  //   3. if the number of tokens of one type = 2 and number of token types (not 0) > 1, raise Error
  //   4. if the number of token types > 3, raise Error
  //   [After Action, Token Validation]
  //   1. if number of total token number > 10, raise Error

  // validate output tokens

  // apply to game state

  // publish to all user

  capturePokemonCard: (
    userToken: string,
    pokemonCardId: number
  ) => Nullable<Error>;
  // get userId from userToken

  // validate request
  //   1. validate whether board or user(in reseved pokemon card list) has the pokemon card or not
  //   2. get required tokens
  //   3. discount required tokens with user pokemon cards
  //   4. validate whether user can buy pokemon card or not

  // apply to game state
  //   1. add token to board
  //   2. remove token from user
  //   3. add pokemon card to user
  //   4. remove pokemon card from board
  //   5. add pokemon card to board from proper deck

  // publish to user
  //  1. change game and publish

  evolvePokemonCard: (
    userToken: string,
    pokemonCardId: number
  ) => Nullable<Error>;
}

export type { IModerator };
