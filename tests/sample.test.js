const expect = require('chai').expect;

describe('First test', () => {
  it('Should assert true to be true', () => {
    expect(true).to.be.true;
  });
}); 

const searchResponse = require('/search/hello');

describe('Get simple search result', () => {
  beforeEach(() => {
    nock('http://ec2-52-90-72-138.compute-1.amazonaws.com:8080/search/hello')
      .get('/search/hello')
      .reply(200, response);
  });

  it('Get a search response by username', () => {
    return searchResponse.then(response => {
      expect(response).to.not.equal('')
      });
  });
});

const searchResponse = require('/search/hello');

describe('Get simple search result', () => {
  beforeEach(() => {
    nock('http://ec2-52-90-72-138.compute-1.amazonaws.com:8080/search/hello')
      .get('/search/hello')
      .reply(200, response);
  });

  it('Get a search response by username', () => {
    return searchResponse.then(response => {
      expect(response).to.not.equal('')
      });
  });
});