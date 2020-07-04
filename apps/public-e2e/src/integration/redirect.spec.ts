import { notFound, onPage } from '../support/app.po';

// Use timeout to detect infinite reloads
const visitOpt = { failOnStatusCode: false, timeout: 2000 };

describe('404 Redirect', () => {
    it('Page not found on root', () => {
        cy.visit('/', visitOpt);
        notFound();
    });

    it('Page not found on non existing sub directory', () => {
        cy.visit('/NON_EXISTING_PATH', visitOpt);
        notFound();
    });

    it('Stay on existing sub directory', () => {
        cy.visit('/public', visitOpt);
        onPage();
        cy.url().should('contain', '/public');
    });

    it('Stay on existing sub directory including sub path', () => {
        cy.visit('/public/sub', visitOpt);
        onPage();
        cy.url().should('contain', '/public/sub');
    });
});
