export function checkIfValidDate(str: string) {
    // Regular expression to check if string is valid date
    const regexExp = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  
    return regexExp.test(str);
  }
  