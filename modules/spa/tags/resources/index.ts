import { Tag } from "@prisma/client";

    export interface IndexTagInterface {
    id: number,
    name: string,
    }

    export function indexTagResource(tag: Tag): IndexTagInterface {
    return {
        id: tag.id,
        name: tag.name ?? '',
    };
    }