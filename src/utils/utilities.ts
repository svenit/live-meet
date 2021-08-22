export default {
  strRandom(length: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  pickByKey(key: string[], object: any) {
    const newObject = {};
    Object.keys(object).map((k: string) => {
      if (key.includes(k)) {
        newObject[k] = object[k];
      }
    });
    return newObject;
  },
};
