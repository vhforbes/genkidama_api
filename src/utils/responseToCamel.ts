import _ from 'lodash';

export const arrayToCamel = (array: Array<any>) => {
  const camelizedArray = array.map((element: any) => {
    const camelized = _.mapKeys(element, (value, key) => _.camelCase(key));
    return camelized;
  });

  return camelizedArray;
};

export const objToCamel = (object: any) => {
  const camelized = _.mapKeys(object, (value, key) => _.camelCase(key));

  return camelized;
};
