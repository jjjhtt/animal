const res = {
  avatarUrl:
    'https://img.doooor.com/img/forum/202003/18/093128z1i26y7z052thv9h.jpg',
  nickName: '张三',
  phoneNumber: '15558308101',
  bio: '三人行，必有我师焉',
};

export const genSimpleUserInfo = () => ({ ...res });

export const genUsercenter = () => ({
  res,
});
