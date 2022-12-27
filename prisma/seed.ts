import { contractsSchema } from "./../src/server/schemas/contracts.schemas";
import { faker } from "@faker-js/faker";
import {
  HouseType,
  KeyType,
  MaritalStatus,
  PrismaClient,
  Tenant,
} from "@prisma/client";
import type { CreateTenantSchema } from "../src/server/schemas/tenant.schema";
import type { CreateHouseSchema } from "../src/server/schemas/house.schema";
import type { FormWitnessSchema } from "../src/server/schemas/witnesses.schema";
import { ContractsSchema } from "../src/server/schemas/contracts.schemas";

const prisma = new PrismaClient();

const maritalStatuses = Object.values(MaritalStatus);
const houseTypes = Object.values(HouseType);
const keyTypes = Object.values(KeyType);

const generateFakeHousesData = (amount: number): CreateHouseSchema[] =>
  Array.from({
    length: amount,
  }).map(() => ({
    number: faker.address.buildingNumber(),
    street: faker.address.street(),
    complement: faker.address.secondaryAddress(),
    neighborhood: faker.address.state(),
    city: faker.address.cityName(),
    iptu: faker.random.numeric(8),
    type: faker.helpers.arrayElement(houseTypes),
    waterId: faker.helpers.unique(faker.random.alphaNumeric, [25]),
    electricityId: faker.helpers.unique(faker.random.alphaNumeric, [25]),
    description: faker.helpers.maybe(
      faker.lorem.paragraphs.bind(
        faker,
        faker.datatype.number({ min: 1, max: 10 })
      )
    ),
  }));

const generateFakePixKeysData = (tenants: Tenant[]) =>
  tenants.map(({ id }) => ({
    keyType: faker.helpers.arrayElement(keyTypes),
    key: faker.internet.email(),
    clientId: id,
  }));

const generateFakeTenantsData = (amount: number): CreateTenantSchema[] =>
  Array.from({
    length: amount,
  }).map(() => ({
    name: faker.name.fullName(),
    rg: faker.helpers.unique(faker.random.numeric, [
      15,
      { allowLeadingZeros: true },
    ]),
    rgEmitter: faker.random.word(),
    cpf: faker.helpers.unique(faker.random.numeric, [
      11,
      { allowLeadingZeros: true },
    ]),
    maritalStatus: faker.helpers.arrayElement(maritalStatuses),
    profession: faker.name.jobTitle(),
    primaryPhone: faker.phone.number(),
    secondaryPhone: faker.helpers.maybe(faker.phone.number),
    email: faker.helpers.maybe(faker.internet.email),
    debit: faker.helpers.maybe(faker.datatype.float, { probability: 0.3 }),
    waterId: faker.helpers.unique(faker.random.alphaNumeric, [25]),
    electricityId: faker.helpers.unique(faker.random.alphaNumeric, [25]),
    lastPayment: faker.date.between(
      new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    ),
    obs: faker.helpers.maybe(faker.lorem.sentences, { probability: 0.2 }),
  }));

const generateFakeWitnessData = (
  amount: number
): Omit<FormWitnessSchema, "id">[] =>
  Array.from({ length: amount }).map(() => ({
    name: faker.name.fullName(),
    rg: faker.helpers.unique(faker.random.numeric, [
      15,
      { allowLeadingZeros: true },
    ]),
    rgEmitter: faker.random.word(),
    cpf: faker.helpers.unique(faker.random.numeric, [
      11,
      { allowLeadingZeros: true },
    ]),
    primaryPhone: faker.phone.number(),
    secondaryPhone: faker.helpers.maybe(faker.phone.number),
    email: faker.helpers.maybe(faker.internet.email),
  }));

const generateFakeContractsData = () => ({
  dueDay: faker.datatype.number({ min: 0, max: 31 }),
  initialDate: faker.date.between(faker.date.recent(15), faker.date.soon(15)),
  rent: faker.datatype.number({ min: 400, max: 1200, precision: 2 }),
  bail: faker.datatype.number({ min: 400, max: 1200, precision: 2 }),
  duration:
    faker.helpers.maybe(
      faker.datatype.number.bind(faker, { min: 12, max: 30 }),
      { probability: 0.1 }
    ) || 12,
  interest: 1,
  arrears: 10,
});

async function main() {
  await prisma.contract.deleteMany();
  await prisma.house.deleteMany();
  await prisma.pixKey.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.witness.deleteMany();
  await prisma.house.createMany({
    data: generateFakeHousesData(80),
    skipDuplicates: true,
  });
  await prisma.tenant.createMany({
    data: generateFakeTenantsData(70),
    skipDuplicates: true,
  });
  const tenants = await prisma.tenant.findMany();
  await prisma.pixKey.createMany({
    data: generateFakePixKeysData(tenants),
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
