// @ts-nocheck
import React from 'react';
import { buildImage } from '../../services/common';

export const ProfileInfo = (props) => {
    return (
        <>
            <div className='media'>
                <div className='media-body'>
                    <ul className='list-unstyled list-info'>
                        <div className="row">
                            <div className="col-8">
                                <li className='row pt-2 pb-2 border-bottom'>
                                    <span className='d-flex align-items-center min-w-25 col-12 col-md-3'>
                                        <i className="eva eva-info mr-1"></i>
                                        Họ và Tên:
                                    </span>
                                    <span className='col-12 col-md-9'>
                                        {props.profileData?.name || ''}
                                    </span>
                                </li>
                                <li className='row pt-2 pb-2 border-bottom'>
                                    <span className='d-flex align-items-center min-w-25 col-12 col-md-3'>
                                        <i className="eva eva-email mr-1"></i>
                                        Email:
                                    </span>
                                    <span className='col-12 col-md-9'>
                                        {props.profileData?.email || ''}
                                    </span>
                                </li>
                                <li className='row pt-2 pb-2 border-bottom'>
                                    <span className='d-flex align-items-center min-w-25 col-12 col-md-3'>
                                        <i className="eva eva-star mr-1"></i>
                                        Giới tính:
                                    </span>
                                    <span className='col-12 col-md-9'>
                                        {props.profileData?.gender || ''}
                                    </span>
                                </li>
                                {/* <li className='row pt-2 pb-2 border-bottom'>
                                    <span className='d-flex align-items-center min-w-25 col-12 col-md-3'>
                                        <i className="eva eva-calendar mr-1"></i>
                                        birthday
                                    </span>
                                    <span className='col-12 col-md-9'>
                                        {props.profileData?.birthday || ''}
                                    </span>
                                </li> */}
                                <li className='row pt-2 pb-2 border-bottom'>
                                    <span className='d-flex align-items-center min-w-25 col-12 col-md-3'>
                                        <i className="eva eva-phone mr-1"></i>
                                        Số điện thoại:
                                    </span>
                                    <span className='col-12 col-md-9'>
                                        {props.profileData?.phone || ''}
                                    </span>
                                </li>
                                <li className='row pt-2 pb-2'>
                                    <span className='d-flex align-items-center min-w-25 col-12 col-md-3'>
                                        <i className="eva eva-map mr-1"></i>
                                        Địa chỉ:
                                    </span>
                                    <span className='col-12 col-md-9'>
                                        {props.profileData?.address || ''}
                                    </span>
                                </li>
                            </div>
                            <div className="col-3 text-center pt-4">
                                <img src={ buildImage(props.profileData?.avatar)} width="100%" height="100%" style={{ maxWidth: 140, maxHeight: 140 }} />
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    )
}
