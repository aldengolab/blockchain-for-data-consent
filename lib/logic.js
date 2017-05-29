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
  * Associate an AssociatedEntity with a Record
  * @param {org.data.privacyNetwork.Association} association the association to be processed
  * @return {Promise} Asset Registry Promise
  * @transaction
  */
  function Associate (association) {
    /*TODO: Check that current user is associator in association*/
    /*Check authorizations for associator has pushAuth with proper authRoot*/
    var authorized = false;
    var verifiedRoot = association.student.authRoot;
    if (association.associator.hasOwnProperty("fullAuthorizations") &&
        association.associator.fullAuthorizations.length > 0) {
      var authorizations = association.associator.fullAuthorizations;
    } else {
      var authorizations = association.associator.pushAuthorizations;
    }
    for (var i = 0; i < authorizations.length; i++) {
      if (authorizations[i].authorizedAction === "Associate") {
        var authRoot = authorizations[i].authRoot;
        var expiry = authorizations[i].expirationDate;
        var today = new Date();
        if (authRoot.email === verifiedRoot.email && expiry.getTime() > today.getTime()) {
          authorized = true;
          var auth = authorizations[i];
          break;
        }
      }
    }
    if (authorized === false) {
      throw new Error(association.associator.hasOwnProperty("fullAuthorizations"));
    } else if (authorized === true) {
      return getAssetRegistry('org.data.privacyNetwork.Record')
        .then(function (assetRegistry) {
          var factory = getFactory();
          association.student.associations.push(association);
          return assetRegistry.update(association.student);
        })
        .then(function () {
          return getParticipantRegistry('org.data.privacyNetwork.AssociatedEntity');
        })
        .then(function (participantRegistry) {
          association.guardian.students.push(association.student);
          return participantRegistry.update(association.guardian);
        }
      );
    }
  }

  /**
 * Create an Associated Entity
 * @param {org.data.privacyNetwork.CreateAE} creation the CreateAE to be processed
 * @return {Promise} Participant Registry Promises
 * @transaction
 */
 function CreateAssociatedEntity (creation) {
 return getParticipantRegistry('org.data.privacyNetwork.AssociatedEntity')
   .then(function (participantRegistry) {
     var factory = getFactory();
     var assocEnt = factory.newInstance('org.data.privacyNetwork',
                                              'AssociatedEntity',
                                               creation.email);
     assocEnt.firstName = creation.firstName;
     assocEnt.lastName = creation.lastName;
     assocEnt.organization = creation.organization;
     return participantRegistry.add(assocEnt);
   }
 );
}

  /**
  * Give an AuthorizedAgent FullAuthority
  * @param {org.data.privacyNetwork.FullAuthority} fullAuth the authority to be processed
  * @return {Promise} Participant Registry Promise
  * @transaction
  */
function GiveFullAuthority(fullAuth) {
  /*TODO: Check current user is DataManager; assert authRoot is DataManager*/
  var AuthorizedAgent = fullAuth.agent;
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
* @return {Promise} Participant Registry Promise
* @transaction
*/
function PushAuthority(pushAuth) {
  return getParticipantRegistry('org.data.privacyNetwork.AuthorizedAgent')
    .then(function (participantRegistry) {
      var factory = getFactory();
      /* TODO: Assert that pushAuth initiator is current user */
      /* TODO: Check that the given authRoot is matched by the the initiator's auth */
      /* TODO: Check that the initiator is not equal to the authAssociator*/
      if (pushAuth.createParticipant == true) {
        var authAssociator = factory.newInstance('org.data.privacyNetwork',
                                                 'AuthorizedAgent',
                                                  pushAuth.email);
        authAssociator.firstName = pushAuth.firstName;
        authAssociator.lastName = pushAuth.lastName;
        authAssociator.organization = pushAuth.organization;
        authAssociator.pushAuthorizations = [pushAuth];
        return participantRegistry.add(authAssociator);
      } else {
        var authAssociator = pushAuth.agent;
        authAssociator.pushAuthorizations.push(pushAuth);
        return participantRegistry.update(authAssociator)
      }
    }
  );
}

/**
* Request consent from a parent
* @param {org.data.privacyNetwork.Consent} consent the authority to be processed
* @return {Promise} Participant Registry Promise
* @transaction
*/
function RequestConsent(consent) {
  /* TODO: Must be of type AuthorizedAgent */
  /* TODO: consent.agent must be current user */
  /* TODO: ACL should allow authorized agent write access to DataUser*/
  return getParticipantRegistry('org.data.privacyNetwork.DataUser')
    .then(function (participantRegistry) {
      var factory = getFactory();
      var dataUser = consent.user;
      var consents = dataUser.consents;
      var agent = consent.agent;
      var auths = agent.pushAuthorizations;
      for (var i = 0; i < auths.length; i++) {
        if (auths[i].authorizedAction === "Consent") {
          var userRoot = auths[i].userRoot;
          if (userRoot.email === dataUser.email) {
            consents.push(consent);
            return participantRegistry.update(dataUser);
          }
        }
      }
      /* Only gets here if no authorization is found */
      throw new Error("Agent must have current 'Consent' authorization from Data User.")
    })
    .then(function () {
      return getAssetRegistry('org.data.privacyNetwork.Record');
    })
    .then(function (assetRegistry) {
      consent.student.consents.push(consent);
      assetRegistry.update(consent.student);
    }
  );
}
