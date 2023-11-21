import { RecentEventsPipe } from './recent-events.pipe';
import { Workflow } from 'app/shared/openapi';

describe('Pipe: recentEvents', () => {
  const entryFields = ['tool', 'workflow', 'apptool', 'service', 'notebook'];

  function instantiate(): RecentEventsPipe {
    return new RecentEventsPipe(undefined);
  }

  it('Should instantiate', () => {
    expect(instantiate()).toBeTruthy();
  });

  it('Should calculate the correct "entryType"', () => {
    const pipe = instantiate();
    entryFields.forEach((field) => {
      const term = `${field}-term`;
      const event = { [field]: { entryTypeMetadata: { term: term } } };
      expect(pipe.transform(event, 'entryType')).toBe(term);
    });
  });

  it('Should calculate the correct "entryLink"', () => {
    const pipe = instantiate();
    entryFields.forEach((field) => {
      const sitePath = `${field}-site-path`;
      const entryPath = `${field}-entry-path`;
      const event = {
        [field]: { entryTypeMetadata: { sitePath: sitePath }, [field === 'tool' ? 'tool_path' : 'full_workflow_path']: entryPath },
      };
      expect(pipe.transform(event, 'entryLink')).toBe(`/${sitePath}/${entryPath}`);
    });
  });
});
