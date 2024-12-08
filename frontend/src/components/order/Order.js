import { message, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { Accordion, Card, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { customDate, customNumber } from "../../helpers/func";
import { toggleShowLoading } from "../../redux/actions/common";
import { ORDER_SERVICE, TRANSACTION_SERVICE, buildImage, onErrorImage } from "../../services";

const Order = (props) => {

    const [orders, setOrders] = useState([]);


    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async () => {
        const response = await ORDER_SERVICE.getList();

        if (response?.status == 'success') {
            setOrders(response?.shopping?.data);

        }
    };
    const cancelOrder = async (id) => {
        const response = await TRANSACTION_SERVICE.changeStatus(id, -1);

        if (response?.status == 'success') {
            message.success("Hủy đơn thành công")
            getOrders()
        } else {
            message.error(response?.message || 'Hủy đơn thất bại');
        }
    };

    const completeOrder = async (id) => {
        const response = await TRANSACTION_SERVICE.changeStatus(id, 4);

        if (response?.status == 'success') {
            message.success("Hoàn tất đơn thành công")
            getOrders()
        } else {
            message.error(response?.message || 'Hoàn tất đơn thất bại');
        }
    };

    const genStatus = (status) => {
        if (status === 5) return <p className="text-warning mb-0 ">Chờ xác nhận</p>;
        else if (status === 2) return <p className="text-primary mb-0">Đang vận chuyển</p>;
        else if (status === 3) return <p className="text-primary mb-0">Đã giao hàng</p>;
        else if (status === 4) return <p className="text-success mb-0">Hoàn thành</p>;
        else if (status === 6) return <p className="text-success mb-0">Đã xác nhận</p>;
        else return <p className="text-danger mb-0">Đã hủy</p>;
    }

    const genPaymentType = (status) => {

        if (status === 2) return <div className="text-secondary" style={{ fontWeight: 600, fontSize: 18 }}>Thanh toán online</div>;
        return <div className="text-primary" style={{ fontWeight: 600, fontSize: 18 }}>Tiền mặt</div>;
    }

    return (
        <div className="myaccount-area pb-80 pt-100">
            <div className="container">
                <div className="row">
                    <div className="ml-auto mr-auto col-lg-9">
                        <div className="myaccount-wrapper">
                            <Accordion>
                                {orders.length > 0 ?
                                    orders.map((item, key1) => (
                                        <div key={key1}>
                                            <Card className="single-my-account mb-20">
                                                <Card.Header className="panel-heading">
                                                    <Accordion.Toggle variant="link" eventKey={String(key1)}>
                                                        <h3 className="panel-title">
                                                            <div className="row">
                                                                <div className="col-sm-6">
                                                                    Đơn hàng {item.id}
                                                                </div>
                                                                <div className="col-sm-3 text-right">
                                                                    {customNumber(item.tst_total_money)}
                                                                </div>
                                                                <div className="col-sm-3 text-right">
                                                                    {genStatus(item.tst_status)}
                                                                </div>
                                                            </div>
                                                        </h3>
                                                    </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey={String(key1)}>
                                                    <Card.Body>
                                                        <div className="myaccount-info-wrapper">
                                                            <div className="mb-5">
                                                                <h4>Tên người nhận: {item.tst_name} - {item.tst_phone}</h4>
                                                                <p><span style={{ fontWeight: 600 }}>Địa chỉ: </span>{item.tst_address}</p>
                                                                <p><span style={{ fontWeight: 600 }}>Email: </span>{item.tst_email}</p>
                                                                <p><span style={{ fontWeight: 600 }}>Thời gian tạo: </span>{customDate(item?.created_at, 'DD/MM/yyyy')}</p>
                                                                <p><span style={{ fontWeight: 600 }}>Thời gian cập nhật: </span>{customDate(item?.updated_at, 'DD/MM/yyyy')}</p>
                                                            </div>
                                                            <div className="text-center">
                                                                <h4>Sản phẩm</h4>
                                                            </div>
                                                            <Table className={`table-striped table-hover mb-5`} responsive>
                                                                <thead>
                                                                    <tr>
                                                                        <th>#</th>
                                                                        <th className="text-nowrap">    </th>
                                                                        <th className="text-nowrap">Số lượng</th>
                                                                        <th className="text-nowrap">Giá</th>
                                                                        <th className="text-nowrap">Tổng giá</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {item.orders.length > 0 &&
                                                                        item.orders.map((order, key2) => (
                                                                            <tr key={key2}>
                                                                                <td>
                                                                                    {key2 + 1}
                                                                                </td>
                                                                                <td className="d-flex align-items-center">
                                                                                    <img alt={order.product.pro_name}
                                                                                        src={buildImage(order.product.pro_avatar)} onError={onErrorImage} width={90} height={90} className="mr-1" />
                                                                                    <div>
                                                                                    {order.product.pro_name} <br />
                                                                                    {order.mau &&
                                                                                        <>
                                                                                            <span>Màu: {order.mau}</span> <br />
                                                                                        </>
                                                                                    }
                                                                                    {order.size &&
                                                                                        <>
                                                                                            <span>Kích cỡ: {order.size}</span>
                                                                                        </>
                                                                                    }
                                                                                    </div>
                                                                                </td>
                                                                                <td>{order.od_qty}</td>
                                                                                <td>{customNumber(order.product.pro_price)}</td>
                                                                                <td>{customNumber(order.product.pro_price * (100 - order.product.pro_sale) / 100 * order.od_qty)}</td>
                                                                            </tr>
                                                                        ))
                                                                    }
                                                                </tbody>
                                                            </Table>
                                                            <div className="border-top pt-md-3">
                                                                {item?.voucher?.amount &&
                                                                    <>

                                                                        <div className="row mb-md-3 pt-md-3">
                                                                            <div className="col-sm-9">
                                                                                <span style={{ fontWeight: 600, fontSize: 18, color: 'red' }}>Giảm giá:</span>
                                                                            </div>
                                                                            <div className="col-sm-3 text-right">
                                                                                <span style={{ fontWeight: 600, fontSize: 18, color: 'red' }}>{item?.voucher?.amount} %</span>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                }
                                                                <div className="row mb-md-3 pt-md-3">
                                                                    <div className="col-sm-9">
                                                                        <span style={{ fontWeight: 600, fontSize: 18, color: 'red' }}>Tổng giá:</span>
                                                                    </div>
                                                                    <div className="col-sm-3 text-right">
                                                                        <span style={{ fontWeight: 600, fontSize: 18, color: 'red' }}>{customNumber(item.tst_total_money)}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="row mb-md-3 pt-md-3">
                                                                    <div className="col-sm-9">
                                                                        <span style={{ fontWeight: 600, fontSize: 18 }}>Loại thanh toán:</span>
                                                                    </div>
                                                                    <div className="col-sm-3 text-right">
                                                                        {genPaymentType(item.tst_type)}
                                                                    </div>
                                                                </div>
                                                                {(item.tst_status == 5 || item.tst_status == 6) &&
                                                                    <>
                                                                        <button className="btn btn-danger"
                                                                            onClick={() => cancelOrder(item.id)}
                                                                        >Hủy đơn hàng</button>
                                                                    </>
                                                                }
                                                                {item.tst_status == 3 &&
                                                                    <>
                                                                        <button className=" btn btn-success"
                                                                            onClick={() => completeOrder(item.id)}
                                                                        >Đã nhận hàng</button>
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </div>
                                    ))
                                    :
                                    <div className="text-center">
                                        Chưa Có Sản Phẩm<br />
                                        <br />
                                        <br />
                                        <br />
                                        <Link to="/" style={{ fontSize: 18, color: '#a771ff' }}>Tiếp Tục Mua Sắm...</Link>
                                    </div>
                                }
                            </Accordion>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default Order;
