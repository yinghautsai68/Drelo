export interface ListType {
    id: number,
    user_id: number,
    position: number,
    label: string,
    cards: CardType[],
    color: string
}
export interface CardType {
    id: number,
    list_id: number,
    position: number,
    label: string,
    color: string,
    status: string,
    due_date: string
}
