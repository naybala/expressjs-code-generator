export default function repositoryTemplate(name) {
  const pascal = capitalize(name);
  return `import { ${pascal}RepositoryInterface } from './${name}Repository.interface';
    import { baseRepository } from '@domain/base/base.repository';
    import { BaseRepositoryInterface } from "@domain/base/baseRepository.interface";
    import prisma from '../../../config/db';
    import { ${pascal} } from '@prisma/client';

    export const ${name}Repository = (): ${pascal}RepositoryInterface => {
      const builder: BaseRepositoryInterface<${pascal}> = baseRepository<${pascal}>(prisma.${pascal});
      return new Proxy({} as ${pascal}RepositoryInterface, {
        get(target, prop: string) {
          const method = builder[prop as keyof BaseRepositoryInterface<${pascal}>]; 
          return typeof method === 'function' ? method.bind(builder) : method;
        },
      });
    };

`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
