describe('sample test', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the main heading', () => {
    cy.get('h1').contains('Your Name');
  })

  it('renders at least one image', () => {
    cy.get('img')
      .should('be.visible')
      .and(($img) => {
        expect($img[0].naturalWidth).to.be.greaterThan(0);
      })
  })
})
