export const onPage = () => cy.get('h1').should('contain', 'Welcome to public');
export const notFound = () => cy.contains('Page not found');
