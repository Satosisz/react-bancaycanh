import { buildFilter, getMethod } from '../index'

export const getSlides = async ( params ) =>
{
	let filter = buildFilter( params );
	return await getMethod( 'slide', filter );
}

export const showSlide = async ( id, params ) =>
{
	return await getMethod( `slide/show/${ id }`, params );
}


export const showSlideDetail = async ( productId, setSlide ) =>
{
	try
	{
		const response = await showSlide( productId );
		if ( response?.status == 'success' )
		{
			setSlide( response?.data?.slides );
		} else {
			setSlide( null );
		}
	} catch ( error )
	{
		console.log( error );
		setSlide( null );
	}
}

export const getSlidesByFilters = async ( params, setSlides ) =>
{
	const data = [
		{
			"avatar": "/assets/banner1.png"
		},
		{
			"avatar": "/assets/banner2.png"
		},
		{
			"avatar": "/assets/banner2.png"
		}
	];
	setSlides( data );
	// try
	// {
	// 	const response = await getSlides( params );
	// 	if ( response?.status == 'success' )
	// 	{
	// 		setSlides( response?.data.slides );
	// 	} else
	// 	{
	// 		setSlides( null );
	// 	}
	// } catch ( error )
	// {
	// 	setSlides( null );
	// }
}
