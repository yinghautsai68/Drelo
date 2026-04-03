export interface ListType {
    id: number,
    user_id: number,
    position: number,
    label: string,
    color: string,
    cards?: CardType[]
}

export interface TagType {
    id: number,
    user_id: number,
    color: string,
    label: string,
}
export interface createTagType {
    user_id: number,
    color: string,
    label: string
}

export interface CardType {
    id: number,
    list_id: number,
    position: number,
    label: string,
    color: string,
    status: string,
    due_date: string,
    tags: TagType[],
}
