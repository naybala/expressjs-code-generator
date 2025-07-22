export default function repositoryTemplate(name) {
  const pascal = capitalize(name);
  return `import { ${pascal}RepositoryInterface } from './${name}Repository.interface';
    import { baseRepository } from '../base/base.repository';
    import prisma from '../../../config/db';
    import { ${pascal} } from '@prisma/client';

    const base = baseRepository<${pascal}>(prisma.${name});

    export const ${name}Repository: ${pascal}RepositoryInterface = {
    ...base,
    };
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
