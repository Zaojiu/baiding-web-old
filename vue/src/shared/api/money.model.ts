export class Money {
  value: number;
  ratioToYuan = 1000;

  constructor(value: number, ratioToYuan = 1000) {
    this.value = value;
    this.ratioToYuan = ratioToYuan;
  }

  toYuan(symbol = '￥', seperator = true, float = 2) {
    const yuan = this.value / this.ratioToYuan;
    let yuanString = yuan.toFixed(float);

    if (seperator) {
      const yuanArr = yuanString.split('.');
      const int = yuanArr[0];
      yuanArr[0] = int.split('').reverse().map((value, i) => !(i % 3) ? `,${value}` : value).reverse().join('');
      yuanString = yuanArr.join('.');
    }

    if (symbol) {
      yuanString = `${symbol} ${yuanString}`;
    }

    return yuanString;
  }
}
