import React, { useEffect, useState } from "react";
import { StarOutlined } from '@ant-design/icons'


export const StarIcons = ( props ) =>
{
	const [ ratingNumber, setRatingNumber ] = useState( 0 );
	const [ number, setNumber ] = useState( 0 );
	useEffect( () =>
	{
		if ( props.rating_number )
		{
			setRatingNumber( props.rating_number )
		}
	}, [ props.rating_number ] );


	return (
		<div className="review-star-icon">
			{
				[ ...Array( 5 ) ].map( ( item, index ) =>
				{
					if ( index < ratingNumber )
					{
						return (
							<StarOutlined key={ index }
								className={ `star active ${ index > 0 ? 'ml-2' : '' }` }
								onClick={ () =>
								{
									if ( props.is_form )
									{
										props.setRatingNumber( index + 1 )
									}

								} }
							/>
						);
					}
					return (
						<StarOutlined key={ index }
							className={ `star ${ index > 0 ? 'ml-2' : '' }` }
							onClick={ () =>
							{
								if ( props.is_form )
								{
									props.setRatingNumber( index + 1 )
								}

							} }
						/>
					);
				} )
			}
		</div>
	);
};
