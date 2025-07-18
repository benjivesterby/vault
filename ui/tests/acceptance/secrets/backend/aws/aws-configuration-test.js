/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import { click, fillIn, visit, currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { v4 as uuidv4 } from 'uuid';
import { spy } from 'sinon';

import { login } from 'vault/tests/helpers/auth/auth-helpers';
import enablePage from 'vault/tests/pages/settings/mount-secret-backend';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { runCmd } from 'vault/tests/helpers/commands';
import { GENERAL } from 'vault/tests/helpers/general-selectors';
import { overrideResponse } from 'vault/tests/helpers/stubs';
import { SECRET_ENGINE_SELECTORS as SES } from 'vault/tests/helpers/secret-engine/secret-engine-selectors';
import { mountBackend } from 'vault/tests/helpers/components/mount-backend-form-helpers';
import {
  expectedConfigKeys,
  expectedValueOfConfigKeys,
  configUrl,
  fillInAwsConfig,
} from 'vault/tests/helpers/secret-engine/secret-engine-helpers';

module('Acceptance | aws | configuration', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const flash = this.owner.lookup('service:flash-messages');
    this.flashSuccessSpy = spy(flash, 'success');
    this.flashInfoSpy = spy(flash, 'info');
    this.flashDangerSpy = spy(flash, 'danger');
    this.version = this.owner.lookup('service:version');
    this.uid = uuidv4();
    this.awsRootConfigResponse = {
      data: {
        region: 'us-west-2',
        access_key: '123-key',
        iam_endpoint: 'iam-endpoint',
        sts_endpoint: 'sts-endpoint',
        max_retries: 1,
      },
    };
    return login();
  });

  module('Enterprise', function (hooks) {
    hooks.beforeEach(function () {
      this.version.type = 'enterprise';
    });

    test('it should prompt configuration after mounting the aws engine', async function (assert) {
      const path = `aws-${this.uid}`;
      // in this test go through the full mount process. Bypass this step in later tests.
      await visit('/vault/settings/mount-secret-backend');
      await mountBackend('aws', path);
      await click(SES.configTab);
      assert.dom(GENERAL.emptyStateTitle).hasText('AWS not configured');
      assert.dom(GENERAL.emptyStateActions).hasText('Configure AWS');
      // cleanup
      await runCmd(`delete sys/mounts/${path}`);
    });

    test('it should transition to configure page on click "Configure" from toolbar', async function (assert) {
      const path = `aws-${this.uid}`;
      await enablePage.enable('aws', path);
      await click(SES.configTab);
      await click(SES.configure);
      assert.strictEqual(currentURL(), `/vault/secrets/${path}/configuration/edit`);
      assert.dom(SES.configureTitle('aws')).hasText('Configure AWS');
      assert.dom(SES.configureForm).exists('it lands on the configuration form.');
      assert
        .dom(SES.additionalConfigModelTitle)
        .hasText(
          'Lease Configuration',
          'it shows the lease configuration section with the "Lease Configuration" title.'
        );
      // cleanup
      await runCmd(`delete sys/mounts/${path}`);
    });

    test('it should show error if old url is entered', async function (assert) {
      // we are intentionally not redirecting from the old url to the new one.
      const path = `aws-${this.uid}`;
      await enablePage.enable('aws', path);
      await click(SES.configTab);
      await visit(`/vault/settings/secrets/configure/${path}`);
      assert.dom(GENERAL.notFound).exists('shows page-error');
      // cleanup
      await runCmd(`delete sys/mounts/${path}`);
    });

    test('it should save root AWS—with WIF options—configuration', async function (assert) {
      const path = `aws-${this.uid}`;
      await enablePage.enable('aws', path);

      this.server.post(configUrl('aws-lease', path), () => {
        throw new Error(
          'A POST request was made to config/lease when it should not because no data was changed.'
        );
      });

      await click(SES.configTab);
      await click(SES.configure);
      await fillInAwsConfig('withWif');
      await click(GENERAL.submitButton);
      assert.dom(SES.wif.issuerWarningModal).exists('issuer warning modal exists');
      await click(SES.wif.issuerWarningSave);
      // three flash messages, the first is about mounting the engine, only care about the last two
      assert.strictEqual(
        this.flashSuccessSpy.args[1][0],
        `Successfully saved ${path}'s configuration.`,
        'first flash message about the first model config.'
      );
      assert.dom(GENERAL.infoRowValue('Issuer')).exists('Issuer has been set and is shown.');
      assert.dom(GENERAL.infoRowValue('Role ARN')).hasText('foo-role', 'Role ARN has been set.');
      assert
        .dom(GENERAL.infoRowValue('Identity token audience'))
        .hasText('foo-audience', 'Identity token audience has been set.');
      assert
        .dom(GENERAL.infoRowValue('Identity token TTL'))
        .hasText('2 hours', 'Identity token TTL has been set.');
      assert.dom(GENERAL.infoRowValue('Access key')).doesNotExist('Access key—a non-wif attr is not shown.');
      // cleanup
      await runCmd(`delete sys/mounts/${path}`);
    });

    test('it should not show issuer if no root WIF configuration data is returned', async function (assert) {
      const path = `aws-${this.uid}`;
      const type = 'aws';

      this.server.get(`${path}/config/root`, () => {
        assert.true(true, 'request made to config/root when navigating to the configuration page.');
        return this.awsRootConfigResponse;
      });
      this.server.get(`identity/oidc/config`, () => {
        throw new Error(`Request was made to return the issuer when it should not have been.`);
      });

      await enablePage.enable(type, path);
      await click(SES.configTab);
      assert.dom(GENERAL.infoRowLabel('Issuer')).doesNotExist(`Issuer does not exists on config details.`);
      assert.dom(GENERAL.infoRowLabel('Access key')).exists(`Access key does exists on config details.`);
      // cleanup
      await runCmd(`delete sys/mounts/${path}`);
    });

    test('it should save root AWS—with IAM options—configuration', async function (assert) {
      assert.expect(3);
      const path = `aws-${this.uid}`;
      await enablePage.enable('aws', path);

      this.server.post(configUrl('aws-lease', path), () => {
        throw new Error(`post request was made to config/lease when it should not have been.`);
      });

      await click(SES.configTab);
      await click(SES.configure);
      await fillInAwsConfig('withAccess');
      await click(GENERAL.submitButton);
      assert.true(
        this.flashSuccessSpy.calledWith(`Successfully saved ${path}'s configuration.`),
        'Success flash message is rendered showing the configuration was saved.'
      );
      assert.dom(GENERAL.infoRowValue('Access key')).hasText('foo', 'Access Key has been set.');
      assert
        .dom(GENERAL.infoRowValue('Secret key'))
        .doesNotExist('Secret key is not shown because it does not get returned by the api.');
      // cleanup
      await runCmd(`delete sys/mounts/${path}`);
    });

    test('it should show identity_token_ttl or maxRetries even if they have not been set', async function (assert) {
      // documenting the intention that we show fields that have not been set but are returned by the api due to defaults
      const path = `aws-${this.uid}`;
      await enablePage.enable('aws', path);

      await click(SES.configTab);
      await click(SES.configure);
      // manually fill in attrs without using helper so we can exclude identity_token_ttl and max_retries.
      await click(SES.wif.accessType('wif')); // toggle to wif
      await fillIn(GENERAL.inputByAttr('role_arn'), 'foo-role');
      await fillIn(GENERAL.inputByAttr('identity_token_audience'), 'foo-audience');
      // manually fill in non-access type specific fields on root config so we can exclude Max Retries.
      await click(GENERAL.button('Root config options'));
      await fillIn(GENERAL.inputByAttr('region'), 'eu-central-1');
      await click(GENERAL.submitButton);
      assert
        .dom(GENERAL.infoRowValue('Identity token TTL'))
        .hasText('0', 'Identity token TTL shows default.');
      assert
        .dom(GENERAL.infoRowValue('Max retries'))
        .hasText('-1', 'Max retries shows -1 indicating the default will be used.');
      // cleanup
      await runCmd(`delete sys/mounts/${path}`);
    });

    test('it shows AWS mount configuration details', async function (assert) {
      const path = `aws-${this.uid}`;
      const type = 'aws';

      this.server.get(`${path}/config/root`, () => {
        assert.true(true, 'request made to config/root when navigating to the configuration page.');
        return this.awsRootConfigResponse;
      });

      await enablePage.enable(type, path);
      await click(SES.configTab);

      for (const key of expectedConfigKeys(type)) {
        if (key === 'Secret key') continue; // secret-key is not returned by the API
        assert.dom(GENERAL.infoRowLabel(key)).exists(`${key} on the ${type} config details exists.`);
        const responseKeyAndValue = expectedValueOfConfigKeys(type, key);
        assert
          .dom(GENERAL.infoRowValue(key))
          .hasText(responseKeyAndValue, `value for ${key} on the ${type} config details exists.`);
      }
      // check mount configuration details are present and accurate.
      await click(SES.configurationToggle);
      assert
        .dom(GENERAL.infoRowValue('Path'))
        .hasText(`${path}/`, 'mount path is displayed in the configuration details');
      // cleanup
      await runCmd(`delete sys/mounts/${path}`);
    });

    test('it should update AWS configuration details after editing', async function (assert) {
      const path = `aws-${this.uid}`;
      const type = 'aws';
      await enablePage.enable(type, path);
      // create access_key with value foo and confirm it shows up in the details page.
      await click(SES.configTab);
      await click(SES.configure);
      await fillInAwsConfig('withAccess');
      await click(GENERAL.submitButton);
      assert.dom(GENERAL.infoRowValue('Access key')).hasText('foo', 'Access key is foo');
      assert
        .dom(GENERAL.infoRowValue('Region'))
        .doesNotExist('Region has not been added therefor it does not show up on the details view.');
      // edit root config details and lease config details and confirm the configuration.index page is updated.
      await click(SES.configure);
      // edit root config details
      await fillIn(GENERAL.inputByAttr('access_key'), 'not-foo');
      await click(GENERAL.button('Root config options'));
      await fillIn(GENERAL.inputByAttr('region'), 'ap-southeast-2');
      // add lease config details
      await fillInAwsConfig('withLease');
      await click(GENERAL.submitButton);
      assert
        .dom(GENERAL.infoRowValue('Access key'))
        .hasText('not-foo', 'Access key has been updated to not-foo');
      assert.dom(GENERAL.infoRowValue('Region')).hasText('ap-southeast-2', 'Region has been added');
      assert
        .dom(GENERAL.infoRowValue('Default Lease TTL'))
        .hasText('33 seconds', 'Default Lease TTL has been added');
      assert.dom(GENERAL.infoRowValue('Max Lease TTL')).hasText('44 seconds', 'Max Lease TTL has been added');
      // cleanup
      await runCmd(`delete sys/mounts/${path}`);
    });

    test('it saves lease configuration if root configuration was not changed', async function (assert) {
      assert.expect(2);
      const path = `aws-${this.uid}`;
      await enablePage.enable('aws', path);

      await click(SES.configTab);
      await click(SES.configure);
      await fillInAwsConfig('withLease');
      await click(GENERAL.submitButton);

      assert.true(
        this.flashSuccessSpy.calledWith(`Successfully saved ${path}'s configuration.`),
        'Success flash message is rendered showing the lease configuration was saved.'
      );
      assert.strictEqual(
        currentURL(),
        `/vault/secrets/${path}/configuration`,
        'the form transitioned as expected to the details page'
      );
      // cleanup
      await runCmd(`delete sys/mounts/${path}`);
    });
  });

  module('Community', function (hooks) {
    hooks.beforeEach(function () {
      this.version.type = 'community';
    });

    test('it does not show access type option and iam fields are shown', async function (assert) {
      const path = `aws-${this.uid}`;
      const type = 'aws';
      await enablePage.enable(type, path);
      await click(SES.configTab);
      await click(SES.configure);
      assert
        .dom(SES.wif.accessTypeSection)
        .doesNotExist('Access type section does not render for a community user');
      // check all the form fields are present
      await click(GENERAL.button('Root config options'));
      for (const key of expectedConfigKeys('aws', true)) {
        assert.dom(GENERAL.inputByAttr(key)).exists(`${key} shows for root section.`);
      }
      for (const key of expectedConfigKeys('aws-lease')) {
        assert.dom(`[data-test-ttl-form-label="${key}"]`).exists(`${key} shows for Lease section.`);
      }
      // cleanup
      await runCmd(`delete sys/mounts/${path}`);
    });

    module('Error handling', function () {
      test('it does not try to save lease configuration if root configuration errored on save', async function (assert) {
        assert.expect(1);
        const path = `aws-${this.uid}`;
        await enablePage.enable('aws', path);

        this.server.post(configUrl('aws', path), () => {
          assert.true(true, 'post request was made to save aws root config.');
          return overrideResponse(400, { errors: ['bad request!'] });
        });
        this.server.post(configUrl('aws-lease', path), () => {
          throw new Error(
            `post request was made to config/lease when the first config was not saved. A request to this endpoint should NOT be be made`
          );
        });
        await click(SES.configTab);
        await click(SES.configure);
        await fillInAwsConfig('withAccess');
        await fillInAwsConfig('withLease');
        await click(GENERAL.submitButton);
        // cleanup
        await runCmd(`delete sys/mounts/${path}`);
      });

      test('it shows a flash message error and transitions if lease configuration errored on save', async function (assert) {
        assert.expect(2);
        const path = `aws-${this.uid}`;
        await enablePage.enable('aws', path);

        this.server.post(configUrl('aws-lease', path), () => {
          return overrideResponse(400, { errors: ['bad request!'] });
        });

        await click(SES.configTab);
        await click(SES.configure);
        await fillInAwsConfig('withLease');
        await click(GENERAL.submitButton);

        assert.true(
          this.flashDangerSpy.calledWith(`Error saving lease configuration: bad request!`),
          'flash danger message is rendered showing the lease configuration was NOT saved.'
        );
        assert.strictEqual(
          currentURL(),
          `/vault/secrets/${path}/configuration`,
          'lease configuration failed to save but the component transitioned as expected'
        );
        // cleanup
        await runCmd(`delete sys/mounts/${path}`);
      });

      test('it prevents transition and shows api error if root config errored on save', async function (assert) {
        const path = `aws-${this.uid}`;
        await enablePage.enable('aws', path);

        this.server.post(configUrl('aws', path), () => {
          return overrideResponse(400, { errors: ['welp, that did not work!'] });
        });

        await click(SES.configTab);
        await click(SES.configure);
        await fillInAwsConfig('withAccess');
        await click(GENERAL.submitButton);

        assert.dom(GENERAL.messageError).hasText('Error welp, that did not work!', 'API error shows on form');
        assert.strictEqual(
          currentURL(),
          `/vault/secrets/${path}/configuration/edit`,
          'the form did not transition because the save failed.'
        );
        // cleanup
        await runCmd(`delete sys/mounts/${path}`);
      });

      test('it should show API error when AWS configuration read fails', async function (assert) {
        assert.expect(1);
        const path = `aws-${this.uid}`;
        const type = 'aws';
        await enablePage.enable(type, path);
        // interrupt get and return API error
        this.server.get(configUrl(type, path), () => {
          return overrideResponse(400, { errors: ['bad request'] });
        });
        await click(SES.configTab);
        assert.dom(SES.error.title).hasText('Error', 'shows the secrets backend error route');
      });
    });
  });
});
