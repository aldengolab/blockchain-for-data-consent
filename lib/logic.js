/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 'use strict';
 /**
  * Associate an AE with a Record
  * @param {org.data.privacyNetwork.Association} association the association to be processed
  * @return {Promise[]} Participant Registry Promises
  * @transaction
  */
  function Associate(association) {
    return getParticipantRegistry('org.data.privacyNetwork.AuthorizedAssociator')
      .then(function (registry) {
        var factory = getFactory();
        var assocEnt = factory.newInstance('org.data.privacyNetwork',
                                                 'AssociatedEntity',
                                                  association.email);
        assocEnt.firstName = association.firstName;
        assocEnt.lastName = association.lastName;
        association.guardian = assocEnt;
        var authorized = false;
        var authorizations = association.associator.pushAuthorizations;
        var verifiedRoot = association.student.authRoot;
        for (var i = 0; i < authorizations.length; i++) {
          var authRoot = authorizations[i].authRoot;
          var expiry = authorizations[i].expirationDate;
          var today = new Date();
          if (authRoot == verifiedRoot && expiry.getTime() > today.getTime()) {
            authorized = true;
            var auth = authorizations[i];
          }
        }
        if (authorized == true) {
          var student = association.student
          student.associations.put(assocation);
          return [registry.add(assocEnt), registry.update(student)];
        }
      }
    )
  }

  /**
  * Give an AuthorizedAssociator a FullAuthority transaction
  * @param {org.data.privacyNetwork.FullAuthority} fullAuth the authority to be processed
  * @return {Promise} Asset Registry Promise
  * @transaction
  */
function GiveFullAuthority(fullAuth) {
  var authorizedAssociator = fullAuth.authAssociator;
  var authorizations = authorizedAssociator.fullAuthorizations;
  return getParticipantRegistry('org.data.privacyNetwork.AuthorizedAssociator')
    .then(function (participantRegistry) {
    	var factory = getFactory();
    	authorizations.push(fullAuth);
    	return participantRegistry.update(authorizedAssociator);
  });
}

/**
* Give an AuthorizedAssociator a PushAuthority transaction
* @param {org.data.privacyNetwork.PushAuthority} pushAuth the authority to be processed
* @return {Promise} Asset Registry Promise
* @transaction
*/
function PushAuthority(pushAuth) {
  return getParticipantRegistry('org.data.privacyNetwork.AuthorizedAssociator')
    .then(function (participantRegistry) {
      var factory = getFactory();
      var authAssociator = factory.newInstance('org.data.privacyNetwork',
                                               'AuthorizedAssociator',
                                                pushAuth.email);
      authAssociator.firstName = pushAuth.firstName;
      authAssociator.lastName = pushAuth.lastName;
      authAssociator.organization = pushAuth.organization;
      authAssociator.pushAuthorizations.push(pushAuth)
      return participantRegistry.add(authAssociator);
    }
  );
}
