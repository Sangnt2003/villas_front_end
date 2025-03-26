/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import { addVilla } from '../../../../services/api/villa';
import { fetchDicounts } from '../../../../services/api/Discount';
import { fetchLocations } from '../../../../services/api/Location';
import { fetchServices } from '../../../../services/api/Service';
import '../../../../styles/AddVilla.css'; // Import custom CSS file for additional styling
import PropTypes from 'prop-types';
import { imageUrl } from '../../../../services/enviroment';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../contexts/UserContext';

const AddVillaForm = ({ onClose }) => {
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    const ApprovalStatus = Object.freeze({
        Pending: 0,
        Approved: 1,
        Rejected: 2,
    });

    const [formData, setFormData] = useState({
        userId: userInfo.id,
        name: '',
        description: '',
        address: '',
        phoneNumber: userInfo.phoneNumber,
        pricePerNight: '',
        listedPrice: '',
        capacity: '',
        rating: '',
        locationId: '',
        discountId: '',
        imageUrls: [],
        villaServices: [],
        approvalStatus: ApprovalStatus.Pending
    });
    const [locations, setLocations] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [error, setError] = useState(null);
    const [villaServicesList, setVillaServicesList] = useState([]);
    const [servicesToShow, setServicesToShow] = useState();
    const [loading, setLoading] = useState(true);
    const [showBooking, setShowBooking] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [locationData, discountData, serviceData] = await Promise.all([
                    fetchLocations(),
                    fetchDicounts(),
                    fetchServices(),
                ]);
                setLocations(locationData);
                setDiscounts(discountData);
                setVillaServicesList(serviceData);
            } catch (err) {
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevState) => {
            const updatedData = {
                ...prevState,
                [name]: ['pricePerNight', 'listedPrice', 'capacity', 'rating'].includes(name) ? parseFloat(value) : value,
            };

            if (name === 'locationId') {
                const selectedLocation = locations.find(location => location.id === value);
                updatedData.address = selectedLocation ? selectedLocation.name : '';
            }

            if (name === 'listedPrice') {
                updatedData.pricePerNight = parseFloat((value * 0.92).toFixed(2)); // Tính `pricePerNight` và làm tròn 2 chữ số thập phân
            }

            return updatedData;
        });
    };


    const handleVillaServicesChange = (event) => {
        const selectedServiceId = event.target.value;
        let updatedVillaServices = [...formData.villaServices];

        if (event.target.checked) {
            updatedVillaServices.push(selectedServiceId); // Add service to array if checked
        } else {
            updatedVillaServices = updatedVillaServices.filter(id => id !== selectedServiceId); // Remove service if unchecked
        }

        setFormData({
            ...formData,
            villaServices: updatedVillaServices.map(serviceId => serviceId.toString()), // Ensure they are strings for consistency
        });
    };
    const handleShowBooking = () => {
        setShowBooking(!showBooking);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const images = Array.from(formData.imageUrls); // Chuyển tệp ảnh thành mảng
            await addVilla(formData, images); // Gửi dữ liệu và tệp ảnh
            alert('Villa added successfully');
            onClose(); // Đóng form sau khi thêm villa thành công
        } catch (err) {
            setError('Failed to add villa. Please try again.');
        }
    };


    return (
        <div className="add-modal">
            <div className="modal-content-all-villa">
                <div className="image-form-add-villa-container">
                    <img
                        src={`${imageUrl}villa/image-form-add-villa.jpg`}
                        alt="image-form-add-villa"
                        className="image-form-add-villa"
                    />
                    <button
                        type="button"
                        className="close-button"
                        onClick={onClose}
                    >
                        <i className="bi bi-x"></i>
                    </button>
                </div>
                <div className='p-3'>
                    <div>
                        <h1 className="my-2 text-center fw-bold text-0082BB">Thêm Villa</h1>
                    </div>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <form onSubmit={handleSubmit} className="row g-4 mt-2" encType="multipart/form-data">
                        <div className="col-md-6">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Tên Villa"
                                className="form-control ip-data w-100 rounded-3"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="col-md-6">
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Địa chỉ"
                                className="form-control ip-data w-100 rounded-3"
                                readOnly={true}
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="col-md-6">
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Số điện thoại"
                                className="form-control ip-data w-100 rounded-3"
                                required
                                readOnly
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                type="text"
                                name="listedPrice"
                                value={
                                    formData.isEditing
                                        ? formData.listedPrice || "" // Nếu không có giá trị, gán chuỗi rỗng
                                        : (formData.listedPrice ?
                                            new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            }).format(formData.listedPrice)
                                            : '') // Nếu không có giá trị thì không có gì hiển thị
                                }
                                onChange={(e) => {
                                    const numericValue = parseFloat(e.target.value.replace(/[^\d]/g, '') || 0);
                                    handleChange({ target: { name: 'listedPrice', value: numericValue } });
                                }}
                                onFocus={() => {
                                    handleChange({ target: { name: 'isEditing', value: true } }); // Bật chế độ chỉnh sửa
                                }}
                                onBlur={() => {
                                    handleChange({ target: { name: 'isEditing', value: false } }); // Tắt chế độ chỉnh sửa
                                }}
                                placeholder="Giá niêm yết (VNĐ)"
                                className="form-control ip-data w-100 rounded-3"
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                type="text"
                                name="pricePerNight"
                                value={
                                    formData.pricePerNight
                                        ? new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(formData.pricePerNight)
                                        : '' // Nếu không có giá trị thì không có gì hiển thị
                                }
                                onChange={(e) => {
                                    const numericValue = parseFloat(e.target.value.replace(/[^\d]/g, '') || 0);
                                    handleChange({ target: { name: 'pricePerNight', value: numericValue } });
                                }}
                                placeholder="Bạn nhận lại sau khi trừ tất cả phí"
                                className="form-control ip-data w-100 rounded-3"
                                required
                                disabled
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                placeholder="Số khách tối đa"
                                className="form-control ip-data w-100 rounded-3"
                                required
                            />
                        </div>

                        {/* Rating */}
                        <div className="col-md-6">
                            <input
                                type="number"
                                name="rating"
                                value={formData.rating}
                                onChange={handleChange}
                                placeholder="Số sao đánh giá"
                                min="1"
                                max="5"
                                className="form-control ip-data w-100 rounded-3"
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="col-md-6">
                            <input
                                type="file"
                                name="images"
                                accept=".jpg, .jpeg, .png"
                                multiple
                                onChange={(e) => setFormData({ ...formData, imageUrls: e.target.files })} // Chuyển tệp ảnh vào state
                                className="form-control ip-data w-100"
                            />
                        </div>

                        <div className="col-md-6 m-0 py-1">
                            <select
                                name="locationId"
                                value={formData.locationId}
                                onChange={handleChange}
                                className="rounded-3 form-select-location ip-data w-100"
                                required
                            >
                                <option value="">Vị trí</option>
                                {locations.map((location) => (
                                    <option key={location.id} value={location.id}>
                                        {location.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 m-0 py-1">
                            <select
                                name="discountId"
                                value={formData.discountId || (discounts.length > 0 ? discounts[0].id : '')} // Mặc định chọn discount đầu tiên
                                onChange={handleChange}
                                className="form-select-discount ip-data w-100 rounded-3"
                                required
                            >
                                {discounts.map((discount) => (
                                    <option key={discount.id} value={discount.id}>
                                        {discount.description} ({discount.percentage}%)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="">
                            <label htmlFor="villaServices" className="form-label">Dịch vụ</label>
                            <div className="villa-services-checkboxes mb-3">
                                {villaServicesList.slice(0, servicesToShow).map((service) => (
                                    <div key={service.id} className="form-check">
                                        <input
                                            type="checkbox"
                                            id={`service-${service.id}`}
                                            className="form-check-input"
                                            value={service.id}
                                            checked={formData.villaServices.includes(service.id)}
                                            onChange={handleVillaServicesChange}
                                        />
                                        <label htmlFor={`service-${service.id}`} className="form-check-label">
                                            {service.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <small className="text-muted">Chọn các dịch vụ mà villa bạn có</small>
                        </div>

                        {/* Description */}
                        <div className="col-12">
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Thêm mô tả"
                                className="form-control"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="col-12">
                            <button type="submit" className="btn btn-warning w-100">Thêm</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

AddVillaForm.propTypes = {
    onClose: PropTypes.func
};

export default AddVillaForm;
