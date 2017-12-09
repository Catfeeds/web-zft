/*
 * @Author: insane.luojie 
 * @Date: 2017-11-10 10:01:31 
 * @Last Modified by: insane.luojie
 * @Last Modified time: 2017-11-27 12:04:05
 */

import api from '~/plugins/api';

export default {
	state: {
		user: {
			id: '',
			projectId: '980488f9adfasdf'
		},
		city_area: {},
		houseType: {
			SOLE: ['sole', '整租'],
			SHARE: ['share', '合租'],
			ENTIRE: ['entire', '整栋']
		}
	},
	actions: {
		GET_COMMUNITIES() {
			return api('communities', null, { id: '123' });
		},
		GET_CITY_AREA({ commit, state }) {
			if (Object.keys(state.city_area).length) {
				return state.city_area;
			}
			return api('city_area');
		}
	}
};
