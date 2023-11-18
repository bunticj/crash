import { BetPlacedInfoData } from "./BetPlacedInfoData";
export class BetUserData {
    public betInfo: BetPlacedInfoData;
    public ticketId: number;
    constructor(username: string, betAmount: number, ticketId: number, autoCashMultiplier?: number) {
        this.betInfo = { username, betAmount, autoCashMultiplier };
        this.ticketId = ticketId;
    }
} 