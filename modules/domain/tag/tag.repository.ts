import { TagRepositoryInterface } from './tagRepository.interface';
    import { baseRepository } from '../base/base.repository';
    import prisma from '../../../config/db';
    import { Tag } from '@prisma/client';

    const base = baseRepository<Tag>(prisma.tag);

    export const tagRepository: TagRepositoryInterface = {
    ...base,
    };
