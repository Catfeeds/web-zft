/*
 * @Author: insane.luojie 
 * @Date: 2017-11-10 10:01:31 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2017-12-18 16:14:24
 */

import api from '~/plugins/api';

export default {
	state: {
		user: {
			id: '',
			projectId: 980488114
		},
		cityArea: {},
		houseTypes: {
			SOLE: ['SOLE', '整租'],
			SHARE: ['SHARE', '合租'],
			ENTIRE: ['ENTIRE', '整栋']
		},
		defaultHouseType: 'SOLE'
	},
	actions: {
		GET_COMMUNITIES({ commit, state }) {
			return api('communities').query(
				{ houseFormat: state.defaultHouseType },
				{ projectId: state.user.projectId }
			);
		},
		GET_CITY_AREA({ commit, state }) {
			if (Object.keys(state.city_area).length) {
				return state.city_area;
			}
			return api('city_area');
		}
	}
};
