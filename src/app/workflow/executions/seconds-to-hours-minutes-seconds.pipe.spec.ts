import { SecondsToHoursMinutesSecondsPipe } from './seconds-to-hours-minutes-seconds.pipe';

describe('Pipe: SecondsToHoursMinutesSecondsPipe', () => {
  it('create an instance and convert seconds to hours minutes seconds', () => {
    const pipe = new SecondsToHoursMinutesSecondsPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(0)).toBe('00:00:00');
    expect(pipe.transform(60)).toBe('00:01:00');
    expect(pipe.transform(3600)).toBe('01:00:00');
    expect(pipe.transform(3661)).toBe('01:01:01');
    expect(pipe.transform(null)).toBe('');
  });
});
