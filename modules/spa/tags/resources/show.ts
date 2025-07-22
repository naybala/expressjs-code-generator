import { Tag } from "@prisma/client";

    export interface ShowTagInterface {
    id: number,
    name: string,
    }

    export function showTagResource(tag: Tag): ShowTagInterface {
    return {
        id: tag.id,
        name: tag.name ?? '',
    };
    }