export abstract class PayBridge {
  abstract pay(liveId: string): Promise<string>;
}
