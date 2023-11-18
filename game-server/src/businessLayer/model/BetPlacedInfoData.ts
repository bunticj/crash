import { IBetPlacedEvent } from "../interface/HelperInterfaces";

export class BetPlacedInfoData implements IBetPlacedEvent {
    public username: string;
    public betAmount: number;
    public autoCashMultiplier?: number;
    constructor(username: string, betAmount: number, autoCashMultiplier?: number) {
        this.username = username;
        this.betAmount = betAmount;
        this.autoCashMultiplier = autoCashMultiplier;
    }
}

