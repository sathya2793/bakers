import { OktaAuth } from '@okta/okta-auth-js';

export const oktaAuth = new OktaAuth({
  issuer: 'https://dev-27474017.okta.com/oauth2/default',
  clientId: '0oapncv5uyXO4NPGe5d7',
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email', 'groups'], 
  pkce: true,
});