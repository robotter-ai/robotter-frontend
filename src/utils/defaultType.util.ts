export const defaultType = (type: string) => {
  let result;
  switch (type) {
    case 'str':
      result = '';
      break;
    case 'int':
      result = 0;
      break;
    case 'float':
      result = 0.0;
      break;
    case 'Decimal':
      result = 0.0;
      break;
    case 'bool':
      result = false;
      break;
    case 'ConstrainedIntValue':
      result = 0;
      break;
    case 'ConstrainedDecimalValue':
      result = 0.0;
      break;
    default:
      result = '';
      break;
  }

  return result;
};
