import { checkPaginatedResp } from './paginate';

describe('check response is paginate object', () => {
  let mockData = [];
  beforeEach(() => {
    mockData = [1, 2, 3, 4];
  });
  it('data is paginate object', () => {
    const res = checkPaginatedResp<number>({ data: mockData, count: 0, total: 0 });
    expect(res).toBeTruthy();
  });

  it('data is not paginate object', () => {
    const res = checkPaginatedResp<number>({ data: mockData });
    expect(res).toBeFalsy();
  });
});
