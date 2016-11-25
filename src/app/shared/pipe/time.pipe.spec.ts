import {async} from '@angular/core/testing';
import {UtilsService} from '../utils/utils';
import {TimeFormaterPipe, TimeToPipe, DurationFormaterPipe, FromNowPipe} from './time.pipe';

(<any>window).moment = require('moment');

describe('TimeFormaterPipe test', () => {
  let now = 0;
  let timeFormaterPipe: TimeFormaterPipe;

  beforeEach(() => {
    now = UtilsService.now;
    timeFormaterPipe = new TimeFormaterPipe();
  });

  it('now should return number', async(() => {
    expect(typeof now === 'number').toBeTruthy();
  }));

  it('transforms "Date String"', () => {
    let value = '2016-10-01 12:00';
    let arg = 'YYYY-MM-DD HH:mm';
    expect(timeFormaterPipe.transform(value, arg)).toEqual('2016-10-01 12:00');
  });

  it('transforms "invalid time"', () => {
    let value = 'ss';
    let arg = 'YYYY-MM-DD HH:mm';
    timeFormaterPipe = new TimeFormaterPipe();
    expect(timeFormaterPipe.transform(value, arg)).toEqual('无效时间');
  });
})

describe('TimeToPipe test', () => {
  let timeToPipe: TimeToPipe;

  beforeEach(() => {
    timeToPipe = new TimeToPipe();
  });

  it('should return 2hr seconds', () => {
    let fromTime = '2016-10-01 12:00';
    let endTime = '2016-10-01 14:00';

    expect(timeToPipe.transform(fromTime, endTime)).toEqual(7200);
  });

  it('invalid format should return 0', () => {
    let fromTime = '2016-1x00';
    let endTime = '2016-1x 14:00';

    expect(timeToPipe.transform(fromTime, endTime)).toEqual(0);
  });
});

describe('DurationFormaterPipe test', () => {
  let now = 0;
  let timeToPipe: TimeToPipe;
  let durationPipe: DurationFormaterPipe;


  beforeEach(() => {
    now = UtilsService.now;
    durationPipe = new DurationFormaterPipe();
    timeToPipe = new TimeToPipe();
  });
  it('invalid duration should return 00', () => {
    expect(durationPipe.transform(-403, 1)).toEqual('00');
  });

  // format DD:HH:MM:SS
  it('left days', () => {
    let value = timeToPipe.transform('2016-10-01 12:00', '2016-10-02 14:22');
    expect(durationPipe.transform(value, 0)).toEqual('01');
  });

  it('left hours', () => {
    let value = timeToPipe.transform('2016-10-01 12:00', '2016-10-02 14:22');
    expect(durationPipe.transform(value, 1)).toEqual('02');
  });
  it('left mins', () => {
    let value = timeToPipe.transform('2016-10-01 12:00', '2016-10-02 14:22');
    expect(durationPipe.transform(value, 2)).toEqual('22');
  });
  it('left seconds', () => {
    let value = timeToPipe.transform('2016-10-01 12:00', '2016-10-02 14:22');
    expect(durationPipe.transform(value, 3)).toEqual('00');
  });

  // format HH:MM:SS
  it('left hours', () => {
    let value = timeToPipe.transform('2016-10-01 12:00', '2016-10-02 14:22');
    expect(durationPipe.transform(value, 4)).toEqual('26');
  });
  it('left mins', () => {
    let value = timeToPipe.transform('2016-10-01 12:00', '2016-10-02 14:22');
    expect(durationPipe.transform(value, 5)).toEqual('22');
  });
  it('left seconds', () => {
    let value = timeToPipe.transform('2016-10-01 12:00', '2016-10-02 14:22');
    expect(durationPipe.transform(value, 6)).toEqual('00');
  });
});

describe('fromNow test', () => {
  let pipe: FromNowPipe;

  beforeEach(() => {
    pipe = new FromNowPipe();
  });

  it('fromNow should return string', async(() => {
    let now = UtilsService.now.toString();
    let pipeNow = pipe.transform(now);
    expect(typeof pipeNow === 'string').toBeTruthy();
  }));

})
