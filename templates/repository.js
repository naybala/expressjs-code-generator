export default function repositoryTemplate(
  name,
  pluralName,
  pascalName,
  camelName,
  repoName
) {
  return `import { ${camelName}RepositoryInterface } from './${pascalName}Repository.interface';
    import { baseRepository } from '@domain/base/base.repository';
    import { BaseRepositoryInterface } from "@domain/base/baseRepository.interface";
    import prisma from '../../../config/db';
    import { ${camelName} } from '@prisma/client';

    export const ${camelName}Repository = (): ${pascalName}RepositoryInterface => {
      const builder: BaseRepositoryInterface<${camelName}> = baseRepository<${camelName}>(prisma.${camelName});
      return {
        ...builder,
      };
    };

`;
}
