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
  * @return {Promise} Participant Registry Promise
  * @transaction
  */
  function Associate (association) {
    var authorized = false;
    var authorizations = association.associator.pushAuthorizations;
    var verifiedRoot = association.student.authRoot;
    for (var i = 0; i < authorizations.length; i++) {
      var authRoot = authorizations[i].authRoot;
      var expiry = authorizations[i].expirationDate;
      var today = new Date();
      if (authRoot.email === verifiedRoot.email && expiry.getTime() > today.getTime()) {
        authorized = true;
        var auth = authorizations[i];
      }
    }
    if (authorized === true) {
      return getAssetRegistry('org.data.privacyNetwork.Record')
        .then(function (assetRegistry) {
          var factory = getFactory();
          association.student.associations.push(association);
          return assetRegistry.update(association.student);
        }
      );
    }
  }

  /**
 * Create an Associated Entity
 * @param {org.data.privacyNetwork.CreateAE} creation the association to be processed
 * @return {Promise} Participant Registry Promises
 * @transaction
 */
 function CreateAE (creation) {
 return getParticipantRegistry('org.data.privacyNetwork.AssociatedEntity')
   .then(function (participantRegistry) {
     var factory = getFactory();
     var assocEnt = factory.newInstance('org.data.privacyNetwork',
                                              'AssociatedEntity',
                                               creation.email);
     assocEnt.firstName = creation.firstName;
     assocEnt.lastName = creation.lastName;
     assocEnt.organization = creation.organization;
     assocEnt.students = [];
     return participantRegistry.add(assocEnt);
   }
 );
}

  /**
  * Give an AuthorizedAgent a FullAuthority transaction
  * @param {org.data.privacyNetwork.FullAuthority} fullAuth the authority to be processed
  * @return {Promise} Asset Registry Promise
  * @transaction
  */
function GiveFullAuthority(fullAuth) {
  var AuthorizedAgent = fullAuth.authAssociator;
  var authorizations = AuthorizedAgent.fullAuthorizations;
  return getParticipantRegistry('org.data.privacyNetwork.AuthorizedAgent')
    .then(function (participantRegistry) {
    	var factory = getFactory();
    	authorizations.push(fullAuth);
    	return participantRegistry.update(AuthorizedAgent);
  });
}

/**
* Give an AuthorizedAgent a PushAuthority transaction
* @param {org.data.privacyNetwork.PushAuthority} pushAuth the authority to be processed
* @return {Promise} Asset Registry Promise
* @transaction
*/
function PushAuthority(pushAuth) {
  return getParticipantRegistry('org.data.privacyNetwork.AuthorizedAgent')
    .then(function (participantRegistry) {
      var factory = getFactory();
      var authAssociator = factory.newInstance('org.data.privacyNetwork',
                                               'AuthorizedAgent',
                                                pushAuth.email);
      authAssociator.firstName = pushAuth.firstName;
      authAssociator.lastName = pushAuth.lastName;
      authAssociator.organization = pushAuth.organization;
      authAssociator.pushAuthorizations = [pushAuth];
      authAssociator.fullAuthorizations = [];
      authAssociator.authorizedAction = pushAuth.authorizedAction;
      return participantRegistry.add(authAssociator);
    }
  );
}
