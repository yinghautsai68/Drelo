export interface CardType {
    id: number,
    list_id: number,
    position: number,
    label: string,
    color: string,
    status: string,
    due_date: string,
}
export interface ListCardsType {
    id: number,
    position: number,
    label: string,
    color: string,
    cards: CardType[]
}