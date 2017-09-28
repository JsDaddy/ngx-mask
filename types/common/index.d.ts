type Config = {
  clearIfNotMatch: boolean,
  dropSpecialCharacters: boolean,
  specialCharacters: string[],
  patterns: {
    [character: string]: {
      pattern: RegExp,
      optional?: boolean
    }
  }
};