import { DateService } from '../shared/date.service';
import { TimeAgoMsgPipe } from './organization/time-ago-msg.pipe';

describe('Pipe: TimeAgoMsgPipe', () => {
  it('Create instance', () => {
    const dateService = new DateService();
    const pipe = new TimeAgoMsgPipe(dateService);
    const date = new Date();
    date.setDate(date.getDate() - 1);

    expect(pipe).toBeTruthy();
    expect(pipe.transform(date)).toEqual('1 day ago');

    date.setDate(date.getDate() - 1);
    expect(pipe.transform(date)).toEqual('2 days ago');
  });
});
