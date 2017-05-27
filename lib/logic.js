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
  * @return {Promise} Asset Registry Promise
  * @transaction
  */
  function Associate(association) {
    	var authorized = false;
      // Push Authority authorizations for the associator; probably just one
      var authorizations = association.associator.pushAuthorizations;
      // The authRoot for the student record
      var verifiedRoot = association.student.authRoot;
      // Search through Push Authority authorizations for correct AuthRoot
      for (var i = 0; i < authorizations.length; i++) {
        var authRoot = authorizations.slice(i).authRoot;
        var expiry = authorizations.slice(i).expirationDate;
        var today = new Date();
        if (authRoot == verifiedRoot && expiry.getTime() > today.getTime()) {
          authorized = true;
          var auth = authorizations.slice(i)
        }
      };
      // If the authorization is confirmed & not expired
      if (authorized == true) {
        return getAssetRegistry('org.acme.sample.SampleAsset')
          .then(function (assetRegistry) {
              return assetRegistry.update(sampleTransaction.asset);
          });
      }
  }
