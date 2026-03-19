export interface ListType {
    id?: number,
    user_id?: number,
    label: string,
    cards: CardType[],
    color: string,
    position: number,
    isEditing?: boolean
}
export interface CardType {
    id?: number,
    list_id?: number,
    position: number,
    color: string,
    label: string
    status: string,
    due_date: string
}
