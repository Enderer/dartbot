import { createRings } from './board-create';

describe('BoardCreate', () => {
  it('should create an instance', () => {
    expect(createRings(null)).toBeTruthy();
  });
});
