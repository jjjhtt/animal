import { cdnBase } from '../config/index';
const imgPrefix = cdnBase;

const defaultDesc = [`${imgPrefix}/tweets/details-1.png`];

const allCards = [
  {
    title: '猫猫狗狗猫猫狗狗猫猫狗狗',
    image: 'https://thumbs.dreamstime.com/z/cat-dog-together-close-up-portrait-white-78726397.jpg',
  },
];

/**
 * @param {string} id
 * @param {number} [available] 
 */
export function gentweet(id, available = 1) {
  const specID = ['135681624', '135681628'];
  if (specID.indexOf(id) > -1) {
    return allCards.filter((tweet) => tweet.spuId === id)[0];
  }
  const item = allCards[id % allCards.length];
  return {
    ...item,
    spuId: `${id}`,
    available: available,
    desc: item?.desc || defaultDesc,
    images: item?.images || [item?.primaryImage],
  };
}
