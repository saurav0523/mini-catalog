// Simple test to verify Jest is working
describe('Simple Test Suite', () => {
  it('should pass basic arithmetic', () => {
    expect(2 + 2).toBe(4);
    expect(5 * 3).toBe(15);
  });

  it('should handle strings', () => {
    expect('hello').toBe('hello');
    expect('world').toContain('or');
  });

  it('should work with arrays', () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
    expect(arr).toContain(2);
  });
});
