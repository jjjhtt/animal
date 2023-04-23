import { gentweet } from './card';

export function gettweetsList(baseID = 0, length = 10) {
  return new Array(length).fill(0).map((_, idx) => gentweet(idx + baseID));
}

export const tweetsList = gettweetsList();
