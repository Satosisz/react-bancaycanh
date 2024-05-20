// @ts-nocheck
import { deleteMethod, getMethod} from "./apiService";
import { buildFilter } from "./common";

export const RATING_SERVICE_CMS = {
	async getLists ( params )
	{
		let filters = await buildFilter( params );
		return await getMethod( '/admin/rating', filters );
	},

	async show ( id, params )
	{
		return await getMethod( `/admin/rating/show/${ id }`, params );
	},

	async delete ( id )
	{
		return await deleteMethod( `/admin/rating/delete/${ id }` );
	}
}
