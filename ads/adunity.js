/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {validateData, loadScript} from '../3p/3p';
import { startsWith } from '../src/string';

/**
 * @param {!Window} global
 * @param {!Object} data
 */
export function adunity(global, data) {
	validateData(data, ['auAccount','auSite'], 
				['auSection','auZone','auDemo', 'auIsdemo','auAd','auOrder','auSegment','auOptions','auSources','auAds','auTriggerFn','auTriggerVal','auCallbackVal', 'auCallbackFn', 'auPassbackFn','auPassbackVal','auClick','auDual','auImpression', 'auVideo']
			);

	const doc = global.document;
	
	//prepare tag structure
	tag = doc.createElement('div');
	tag.classList.add("au-tag");
	tag.setAttribute("data-au-width", data["width"]);
	tag.setAttribute("data-au-height", data["height"]);

  if (data != null) {
		for (const key in data) {
		  if (hasOwnProperty.call(data, key)) {
				if(startsWith(key, 'type') || startsWith(key, 'ampSlotIndex')) continue;
					if(startsWith(key, 'au')){
						if(key == "auVideo")
							tag.setAttribute("class", "au-video");
						else
							tag.setAttribute("data-au-" + key.substring(2).toLowerCase(), data[key]);
					}
		  }
		}
	}
	//make sure is executed only once
	let libraryAdded = false;
	//execute tag only if in view
	let inViewUnlisten = global.context.observeIntersection(function(changes) {
		changes.forEach(function(c) {
			if(!libraryAdded && c.intersectionRect.height > data["height"] / 2 ){
				libraryAdded = true;
				inViewUnlisten();
				renderTags(global, data);
			}
		});
	});
	const tagPh = doc.getElementById('c');
	tagPh.appendChild(tag);
}

/**
 * @param {!Window} global
 * @param {!Object} data
 */
function renderTags(global, data) {
	let localData = data || global.context.data;
	global.context.renderStart({width: localData.width, height: localData.height });
	loadScript(global, '//content.adunity.com/aulib.js');
}