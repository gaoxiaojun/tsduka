export type AggregateInput = {
  data: number[][];
  fromTimeframe: TimeframeType;
  toTimeframe: TimeframeType;
  priceType: PriceType;
  ignoreFlats: boolean;
};

export enum Timeframe {
  /**
   * Every single price change. No aggregation of OHLC price data
   */
  tick = 'tick',
  /**
   *  minutely `(1 minute)` aggregation of OHLC price data
   */
  m1 = 'm1',
  /**
   *  15-minute `(15 minutes)` aggregation of OHLC price data
   */
  m15 = 'm15',
  /**
   *  half-hour `(30 minutes)` aggregation of OHLC price data
   */
  m30 = 'm30',
  /**
   *  hourly `(1 hour)` aggregation of OHLC price data
   */
  h1 = 'h1',
  /**
   *  daily `(1 day)` aggregation of OHLC price data
   */
  d1 = 'd1',
  /**
   *  monthly `(1 month)` aggregation of OHLC price data
   */
  mn1 = 'mn1'
}

export type TimeframeType = keyof typeof Timeframe;

export enum Price {
  /**
   * A `bid` is an offer made by an investor, trader, or dealer in an effort to buy a security, commodity, or currency.
   */
  bid = 'bid',
  /**
   * The `ask` is the price a seller is willing to accept for a security, commodity, or currency, which is often referred to as the offer price
   */
  ask = 'ask',

  /**
   * The `mid` is the price a seller is willing to accept for a security, commodity, or currency, which is often referred to as the offer price
   */
  mid = 'mid'
}

export type PriceType = keyof typeof Price;
