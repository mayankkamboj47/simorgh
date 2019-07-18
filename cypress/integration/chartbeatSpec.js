import envConfig from '../support/config/envs';
import services from '../support/config/services';
import { describeForLocalAndTest } from '../support/limitEnvRuns';

const hasScriptWithChartbeatSrc = charbeatSource => {
  cy.get(`script`)
    .eq(0)
    .should('have.attr', 'src', `${charbeatSource}`);
};

const hasGlobalChartbeatConfig = () => {
  cy.window().should('have.property', '_sf_async_config');
};

const hasAmpChartbeatConfigUid = chartbeatUID => {
  cy.get('amp-analytics script[type="application/json"]')
    .eq(1)
    .should('contain', `${chartbeatUID}`);
};

describeForLocalAndTest('Chartbeats Analytics for News Article', () => {
  describe('Canonical page', () => {
    before(() => {
      cy.visit(`/news/articles/${services.news.pageTypes.articles.asset}`);
    });
    it('should have a script with src value set to chartbeat source', () => {
      hasScriptWithChartbeatSrc(envConfig.charbeatSource);
    });
    it('should have chartbeat config set to window object', () => {
      hasGlobalChartbeatConfig();
    });
  });
  describe('AMP page', () => {
    it('should have chartbeat config UID', () => {
      cy.visit(`/news/articles/${services.news.pageTypes.articles.asset}.amp`);
      hasAmpChartbeatConfigUid(envConfig.chartbeatUID);
    });
  });
});

describeForLocalAndTest('Chartbeats Analytics for Persian Articles', () => {
  describe('Canonical page', () => {
    before(() => {
      cy.visit(`/news/articles/${services.news.pageTypes.articles.asset}`);
    });
    it('should have a script with src value set to chartbeat source', () => {
      hasScriptWithChartbeatSrc(envConfig.charbeatSource);
    });
    it('should have chartbeat config set to window object', () => {
      hasGlobalChartbeatConfig();
    });
  });
  describe('AMP page', () => {
    it('should have chartbeat config UID', () => {
      cy.visit(
        `/persian/articles/${services.persian.pageTypes.articles.asset}.amp`,
      );
      hasAmpChartbeatConfigUid(envConfig.chartbeatUID);
    });
  });
});
