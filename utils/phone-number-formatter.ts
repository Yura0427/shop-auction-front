export const phoneNumberFormatter = (phoneNumber: string) => {
  if (phoneNumber?.split(' ').length === 1) {
    return `+${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 5)} ${phoneNumber.slice(
      5,
      8
    )} ${phoneNumber.slice(8, 10)} ${phoneNumber.slice(10, 12)}`;
  }
  return phoneNumber;
};
