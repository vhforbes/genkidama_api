interface MyObject {
  [key: string]: any;
}

export function replaceCommasWithDots(obj: MyObject): MyObject {
  const newObj: MyObject = {};

  Object.keys(obj).forEach(key => {
    const value = obj[key];

    if (typeof value === 'string') {
      newObj[key] = value.replace(/,/g, '.');
    } else if (typeof value === 'object' && value !== null) {
      newObj[key] = replaceCommasWithDots(value);
    } else {
      newObj[key] = value;
    }
  });

  return newObj;
}
