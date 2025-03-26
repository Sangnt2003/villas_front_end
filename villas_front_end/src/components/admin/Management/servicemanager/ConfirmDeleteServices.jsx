/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { deleteService } from "../../../../services/api/Service";
const ConfirmDeleteModal = ({ show, serviceId, onClose, onConfirm }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await deleteService(serviceId);
            onConfirm();
            alert('xóa thành công')
            onClose();
        } catch (error) {
            alert("Xóa thất bại, vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`modal ${show ? "d-block" : "d-none"}`} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Xác nhận xóa</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p>Bạn có chắc chắn muốn xóa dịch vụ này?</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang xóa..." : "Xóa"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
