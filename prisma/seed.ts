import { faker } from '@faker-js/faker';
import {
  HouseType,
  KeyType,
  MaritalStatus,
  PrismaClient,
} from '@prisma/client';
import type { Tenant, House } from '@prisma/client';
import type { CreateTenant } from '../src/server/schemas/tenant.schema';
import type { CreateHouseSchema } from '../src/server/schemas/house.schema';
import { generateCpf } from '../src/utils/function/dev';

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
    iptu: faker.random.numeric(14),
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

const generateFakeTenantsData = (amount: number): CreateTenant[] =>
  Array.from({
    length: amount,
  }).map(() => ({
    name: faker.name.fullName(),
    rg: faker.helpers.unique(faker.random.numeric, [
      15,
      { allowLeadingZeros: true },
    ]),
    rgEmitter: faker.lorem.word({ length: { min: 2, max: 10 } }),
    cpf: generateCpf(faker),
    maritalStatus: faker.helpers.arrayElement(maritalStatuses),
    profession: faker.name.jobTitle(),
    primaryPhone: faker.phone.number('(##) #####-####'),
    hasWpp: faker.datatype.boolean(),
    secondaryPhone: faker.helpers.maybe(
      faker.phone.number.bind(this, '(##) #####-####')
    ),
    email: faker.helpers.maybe(faker.internet.email),
    obs: faker.helpers.maybe(faker.lorem.sentences, { probability: 0.2 }),
  }));

const generateFakeWitnessData = () => ({
  name: faker.name.fullName(),
  rg: faker.helpers.unique(faker.random.numeric, [
    15,
    { allowLeadingZeros: true },
  ]),
  rgEmitter: faker.lorem.word({ length: { min: 2, max: 10 } }),
  cpf: generateCpf(faker),
  primaryPhone: faker.phone.number('(##) #####-####'),
  secondaryPhone: faker.helpers.maybe(
    faker.phone.number.bind(this, '(##) #####-####')
  ),
  email: faker.helpers.maybe(faker.internet.email),
});

const generateFakeContractsData = (tenants: Tenant[], houses: House[]) =>
  tenants.map(({ id }, i) => {
    return {
      dueDay: faker.datatype.number({ min: 1, max: 31 }),
      initialDate: faker.date.between(
        faker.date.recent(15),
        faker.date.soon(15)
      ),
      rent: faker.datatype.number({ min: 400, max: 1200, precision: 2 }),
      bail: faker.datatype.number({ min: 400, max: 1200, precision: 2 }),
      duration:
        faker.helpers.maybe(
          faker.datatype.number.bind(faker, { min: 12, max: 30 }),
          { probability: 0.1 }
        ) || 12,
      interest: 1,
      arrears: 10,
      waterId: faker.random.alphaNumeric(25),
      electricityId: faker.random.alphaNumeric(25),
      tenantId: id,
      houseId: houses[i]!.id,
    };
  });

async function main() {
  prisma.account.deleteMany();
  prisma.session.deleteMany();
  prisma.user.deleteMany();
  prisma.verificationToken.deleteMany();
  await prisma.debit.deleteMany();
  console.log('Debits deleted');
  await prisma.contract.deleteMany();
  console.log('Contracts deleted');
  await prisma.house.deleteMany();
  console.log('Houses deleted');
  await prisma.pixKey.deleteMany();
  console.log('Pixkeys deleted');
  await prisma.tenant.deleteMany();
  console.log('Tenants deleted');
  await prisma.witness.deleteMany();
  console.log('Witnesses deleted');

  await prisma.house.createMany({
    data: generateFakeHousesData(80),
    skipDuplicates: true,
  });

  console.log('Created houses');

  await prisma.tenant.createMany({
    data: generateFakeTenantsData(70),
    skipDuplicates: true,
  });
  console.log('Created tenants');
  const tenants = await prisma.tenant.findMany();
  console.log('Got all tenants');
  const houses = await prisma.house.findMany();
  console.log('Got all houses');
  await prisma.pixKey.createMany({
    data: generateFakePixKeysData(tenants),
    skipDuplicates: true,
  });
  console.log('Created pixKeys');
  const someTenants = tenants.slice(0, 40);

  await prisma.contract.createMany({
    data: generateFakeContractsData(someTenants, houses),
  });
  console.log('Created contracts');

  const contracts = await prisma.contract.findMany();

  contracts.forEach(async ({ id }) => {
    await prisma.witness.create({
      data: {
        ...generateFakeWitnessData(),
        contractId: id,
      },
    });
    await prisma.witness.create({
      data: {
        ...generateFakeWitnessData(),
        contractId: id,
      },
    });
  });
  console.log('Created witnesses');
  console.log("That's it");
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
