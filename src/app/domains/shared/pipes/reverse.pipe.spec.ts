import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  let spectator: SpectatorPipe<ReversePipe>;
  const createPipe = createPipeFactory(ReversePipe);

  it('should reverse a string', () => {
    spectator = createPipe(`{{ 'Hello!' | reverse}}`);
    expect(spectator.element).toHaveText('!olleH');
  });

  it('should return empty string when input is empty', () => {
    spectator = createPipe(`{{ '' | reverse}}`);
    expect(spectator.element).toHaveText('');
  });

  it('should handle single character strings', () => {
    spectator = createPipe(`{{ 'a' | reverse}}`);
    expect(spectator.element).toHaveText('a');
  });

  it('should handle strings with spaces', () => {
    spectator = createPipe(`{{ 'hello world' | reverse}}`);
    expect(spectator.element).toHaveText('dlrow olleh');
  });

  it('should handle special characters', () => {
    spectator = createPipe(`{{ 'Hello@World!' | reverse}}`);
    expect(spectator.element).toHaveText('!dlroW@olleH');
  });

  it('should handle numbers as strings', () => {
    spectator = createPipe(`{{ '12345' | reverse}}`);
    expect(spectator.element).toHaveText('54321');
  });

  it('should handle null input', () => {
    spectator = createPipe(`{{ null | reverse}}`);
    expect(spectator.element).toHaveText('');
  });

  it('should handle undefined input', () => {
    spectator = createPipe(`{{ undefined | reverse}}`);
    expect(spectator.element).toHaveText('');
  });
});
