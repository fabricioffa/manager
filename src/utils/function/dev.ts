import type { Faker } from '@faker-js/faker';
import { CpfValidator } from '../zodHelpers';

export const generateCpf = (faker: Faker) => {
  let cpf = faker.helpers.unique(faker.random.numeric, [
    11,
    { allowLeadingZeros: true },
  ]);
  const firstCtrlDigit = new CpfValidator(cpf).getCtrlDigit('first');
  cpf = `${cpf.slice(0, -2)}${firstCtrlDigit}0`;
  const secondCtrlDigit = new CpfValidator(cpf).getCtrlDigit('second');
  return cpf.slice(0, -1) + secondCtrlDigit;
};
