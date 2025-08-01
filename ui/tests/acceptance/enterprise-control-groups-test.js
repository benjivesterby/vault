/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import {
  settled,
  currentURL,
  currentRouteName,
  visit,
  waitUntil,
  fillIn,
  click,
  waitFor,
  find,
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { storageKey } from 'vault/services/control-group';
import { writeSecret } from 'vault/tests/helpers/kv/kv-run-commands';
import { login, logout } from 'vault/tests/helpers/auth/auth-helpers';
import { runCmd } from 'vault/tests/helpers/commands';
import { GENERAL } from 'vault/tests/helpers/general-selectors';
import { CONTROL_GROUP } from 'vault/tests/helpers/components/control-group-selectors';

module('Acceptance | Enterprise | control groups', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    return login();
  });

  const POLICY = `
    path "kv/foo" {
      capabilities = ["create", "read", "update", "delete", "list"]
      control_group = {
        max_ttl = "24h"
        factor "ops_manager" {
            identity {
                group_names = ["managers"]
                approvals = 1
            }
         }
      }
    }

    path "kv-v2-mount/data/foo" {
      capabilities = ["create", "read", "update", "list"]
      control_group = {
        max_ttl = "24h"
        factor "ops_manager" {
            identity {
                group_names = ["managers"]
                approvals = 1
            }
         }
      }
    }

    path "kv-v2-mount/*" {
      capabilities = ["list"]
    }
  `;

  const AUTHORIZER_POLICY = `
    path "sys/control-group/authorize" {
      capabilities = ["update"]
    }

    path "sys/control-group/request" {
      capabilities = ["update"]
    }
  `;

  const ADMIN_USER = 'authorizer';
  const ADMIN_PASSWORD = 'test';
  const setupControlGroup = async (context) => {
    await visit('/vault/secrets');
    const userpassAccessor = await runCmd([
      //enable kv-v1 mount and write a secret
      'write sys/mounts/kv type=kv',
      'write kv/foo bar=baz',

      //enable userpass, create user and associated entity
      'write sys/auth/userpass type=userpass',
      `write auth/userpass/users/${ADMIN_USER} password=${ADMIN_PASSWORD} policies=default`,
      `write identity/entity name=${ADMIN_USER} policies=test`,
      // write policies for control group + authorization
      `write sys/policies/acl/kv-control-group policy=${btoa(POLICY)}`,
      `write sys/policies/acl/authorizer policy=${btoa(AUTHORIZER_POLICY)}`,
      // read out mount to get the accessor
      'read -field=accessor sys/internal/ui/mounts/auth/userpass',
    ]);

    const authorizerEntityId = await runCmd([
      // lookup entity id for our authorizer
      `write -field=id identity/lookup/entity name=${ADMIN_USER}`,
    ]);

    const userToken = await runCmd([
      // create alias for authorizor and add them to the managers group
      `write identity/alias mount_accessor=${userpassAccessor} entity_id=${authorizerEntityId} name=${ADMIN_USER}`,
      `write identity/group name=managers member_entity_ids=${authorizerEntityId} policies=authorizer`,
      // create a token to request access to kv/foo
      'write -field=client_token auth/token/create policies=kv-control-group',
    ]);
    context.userToken = userToken;
    await login(userToken);
    await settled();
    return context;
  };

  test('for v2 secrets it redirects you if you try to navigate to a Control Group restricted path', async function (assert) {
    await runCmd(['write sys/mounts/kv-v2-mount type=kv-v2', 'delete kv-v2-mount/metadata/foo']);
    await writeSecret('kv-v2-mount', 'foo', 'bar', 'baz');
    await settled();
    await setupControlGroup(this);
    await settled();
    await visit('/vault/secrets/kv-v2-mount/kv/foo/details');

    assert.ok(
      await waitUntil(() => currentRouteName() === 'vault.cluster.access.control-group-accessor'),
      'redirects to access control group route'
    );
    // without waiting for a settled state before test teardown there was an occasional async request leak causing failures
    // the queryRecord method in the capabilities adapter was seemingly resolving after the store was destroyed
    // "Error: Async Request leaks detected. Add a breakpoint here and set store.generateStackTracesForTrackedRequests = true; to inspect traces for leak origins"
    // this should allow the pending request to resolve before tear down
    await settled();
  });

  const workflow = async (assert, context, shouldStoreToken) => {
    const url = '/vault/secrets/kv/show/foo';
    await setupControlGroup(context);
    await settled();
    // as the requestor, go to the URL that's blocked by the control group
    // and store the values
    await visit(url);
    await waitFor(CONTROL_GROUP.accessorValue);
    const accessor = find(CONTROL_GROUP.accessorValue).textContent.trim();
    const controlGroupToken = find(CONTROL_GROUP.tokenValue).textContent.trim();
    await logout();
    await settled();
    // log in as the admin, navigate to the accessor page,
    // and authorize the control group request
    await visit('/vault/auth?with=userpass');

    await fillIn(GENERAL.inputByAttr('username'), ADMIN_USER);
    await fillIn(GENERAL.inputByAttr('password'), ADMIN_PASSWORD);
    await click(GENERAL.submitButton);
    await visit(`/vault/access/control-groups/${accessor}`);

    // putting here to help with flaky test
    await waitFor(GENERAL.button('Authorize'));
    await click(GENERAL.button('Authorize'));
    assert.dom(CONTROL_GROUP.bannerPrefix).hasText('Thanks!', 'text display changes');
    await settled();
    await login(context.userToken);
    await settled();
    if (shouldStoreToken) {
      localStorage.setItem(
        storageKey(accessor, 'kv/foo'),
        JSON.stringify({
          accessor,
          token: controlGroupToken,
          creation_path: 'kv/foo',
          uiParams: {
            url,
          },
        })
      );
      await visit(`/vault/access/control-groups/${accessor}`);

      assert.dom(CONTROL_GROUP.navMessage).exists('shows user the navigate message');
      await click(GENERAL.button('Visit'));
      assert.strictEqual(currentURL(), url, 'successfully loads the target url');
    } else {
      await visit(`/vault/access/control-groups/${accessor}`);
      await fillIn(GENERAL.inputByAttr('token'), controlGroupToken);
      await click(GENERAL.submitButton);
      await waitFor(CONTROL_GROUP.jsonViewer);
      assert.dom(CONTROL_GROUP.jsonViewer).exists('shows the json viewer');
    }
  };

  test('it allows the full flow to work without a saved token', async function (assert) {
    await workflow(assert, this);
    await settled();
  });

  test('it allows the full flow to work with a saved token', async function (assert) {
    await workflow(assert, this, true);
    await settled();
  });

  test('it displays the warning in the console when making a request to a Control Group path', async function (assert) {
    await setupControlGroup(this);
    const output = await runCmd('read kv/foo');
    assert.ok(output.includes('A Control Group was encountered at kv/foo'));
    assert.ok(output.includes('The Control Group Token is'));
    assert.ok(output.includes('The Accessor is'));
    assert.ok(output.includes('Visit /ui/vault/access/control-groups/'));
  });
});
