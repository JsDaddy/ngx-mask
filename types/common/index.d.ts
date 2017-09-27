type Config = {
  clearIfNotMatch: boolean,
  dropSpecialCharacters: boolean,
  specialCharacters: string[],
  patterns: { [key: string]: RegExp }
};