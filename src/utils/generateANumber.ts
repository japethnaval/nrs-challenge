export const generateANumber = (exclude: number): number => {
    let num;
    do {
      num = Math.floor(Math.random() * 10) + 1;
    } while (num === exclude);
    return num;
  };
  