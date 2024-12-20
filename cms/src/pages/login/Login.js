import React, { useState } from "react";
import PropTypes from "prop-types";
import { withRouter, Redirect, Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import
	{
		Container,
		Row,
		Col,
		Button,
		FormGroup,
		FormText,
	} from "reactstrap";
import Widget from "../../components/Widget/Widget";
import Footer from "../../components/Footer/Footer";
import { loginUser } from "../../redux/actions/auth";
import { AUTH_SERVICE } from "../../services/authService";

import loginImage from "../../assets/loginImage.svg";
import SofiaLogo from "../../components/Icons/SofiaLogo.js";
import GoogleIcon from "../../components/Icons/AuthIcons/GoogleIcon.js";
import TwitterIcon from "../../components/Icons/AuthIcons/TwitterIcon.js";
import FacebookIcon from "../../components/Icons/AuthIcons/FacebookIcon.js";
import GithubIcon from "../../components/Icons/AuthIcons/GithubIcon.js";
import LinkedinIcon from "../../components/Icons/AuthIcons/LinkedinIcon.js";
import { Form, Input, message } from "antd";
import { useForm } from "antd/lib/form/Form";
import { toggleShowLoading } from "../../redux/actions/common";
import { VALIDATE_FORM } from "../../services/common";

const Login = ( props ) =>
{

	const [ form ] = useForm();
	const dispatch = useDispatch();

	const submitForm = async ( e ) =>
	{
		dispatch(toggleShowLoading(true));
		e.type = 2;
		const response = await AUTH_SERVICE.login(e, dispatch);
		if(response?.status == 'success') {
			localStorage.setItem('access_token_cms', response?.data?.access_token);
			localStorage.setItem('full_name', response?.data?.user ? response?.data?.user?.name : response?.data?.admin?.name);
			localStorage.setItem('email', response?.data?.user ? response?.data?.user?.email : response?.data?.admin?.email);
			localStorage.setItem('phone', response?.data?.user ? response?.data?.user?.phone : response?.data?.admin?.phone);
			localStorage.setItem('address', response?.data?.user ? response?.data?.user?.address : response?.data?.admin?.address);
			localStorage.setItem('avatar', response?.data?.user ? response?.data?.user?.avatar : response?.data?.admin?.avatar);
			localStorage.setItem('type', 'admin');
			window.location.href = '/';
		} else {
			message.error(response?.message || 'error');
		}
		dispatch( toggleShowLoading( false ) );
	}

	return (
		<div className="auth-page">
			<Container className="col-12">
				<Row className="d-flex align-items-center">
					<Col xs={ 12 } lg={ 6 } className="left-column">
						<Widget className="widget-auth widget-p-lg">
							<div className="d-flex align-items-center justify-content-between py-3">
								<p className="auth-header mb-0">LOGIN</p>
								<div className="logo-block">
									<SofiaLogo />
									<p className="mb-0" style={{ color: 'green' }}>[VITAGREEN] CMS</p>
								</div>
							</div>
							<Form
								className='p-3'
								name='nest-messages form'
								form={ form }
								onFinish={ submitForm }
								validateMessages={ VALIDATE_FORM }
							>
								<div className='mb-3 form-group'>
									<Form.Item name="email" label="Email"
										rules={ [ { required: true } ] }
										className=' d-block'>
										<Input className='form-control' style={ { height: '40px', borderRadius: '10px' } } placeholder='Nhập email' />
									</Form.Item>
									<Form.Item name="password" label="Mật khẩu"
										rules={ [ { required: true } ] }
										className=' d-block'>
										<Input.Password className='form-control d-flex' style={ { height: '40px', borderRadius: '10px' } } placeholder='Nhập mật khẩu' />
									</Form.Item>
								</div>
								<div className="bg-widget d-flex justify-content-center">
								<Button className="rounded-pill my-3" type="submit" style={{ backgroundColor: 'green', fontWeight: 'normal',fontWeight: 'bolder', color: 'white'}} color="secondary-green">ĐĂNG NHẬP</Button>
								</div>
							</Form>
						</Widget>
					</Col>
					<Col xs={ 0 } lg={ 6 } className="right-column">
						<div>
							<img src={ loginImage } alt="Error page" />
						</div>
					</Col>
				</Row>
			</Container>
			<Footer />
		</div>
	)
}


Login.propTypes = {
	dispatch: PropTypes.func.isRequired,
}

function mapStateToProps ( state )
{
	return {
		isFetching: state.auth.isFetching,
		isAuthenticated: state.auth.isAuthenticated,
		errorMessage: state.auth.errorMessage,
	};
}

export default withRouter( connect( mapStateToProps )( Login ) );
