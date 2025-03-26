/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import { addVilla } from '../../../../services/api/villa';
import { fetchDicounts } from '../../../../services/api/Discount';
import { fetchLocations } from '../../../../services/api/Location';
import '../../../../styles/VillaManagement.css'; // Import custom CSS file for additional styling
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../contexts/UserContext';
const AddVillaForm = ({ onClose }) => {
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    const [formData, setFormData] = useState({
        userId: userInfo.id,
        name: '',
        description: '',
        address: '',
        phoneNumber: '',
        pricePerNight: '',
        capacity: '',
        rating: '',
        status: false,
        locationId: '',
        discountId: '',
        imageUrls: [],
    });

    const [locations, setLocations] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [locationData, discountData] = await Promise.all([fetchLocations(), fetchDicounts()]);
                setLocations(locationData);
                setDiscounts(discountData);
            } catch (error) {
                setError('Failed to load data');
            }
        };
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Gọi API và truyền FormData
            await addVilla(formData, formData.imageUrls);
            alert('Thêm thành công');
            onClose();
            // setFormData({
            //     name: '',
            //     description: '',
            //     address: '',
            //     phoneNumber: '',
            //     pricePerNight: '',
            //     capacity: '',
            //     rating: '',
            //     status: false,
            //     locationId: '',
            //     discountId: '',
            //     imageUrls: [],
            // });
        } catch (err) {
            setError('Failed to add villa. Please try again.');
        }
    };


    return (
        <div className="container modal-content ">
            <div className='text-end'>
                <button
                    type="button" className='bg-transparent'
                    onClick={onClose}
                ><i className='bi bi-x text-danger fs-3'></i></button>
            </div>
            <div>
                <h2 className="my-4 text-center fw-bold text-0082BB">Thêm Villa</h2>
            </div>
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="row g-4 " encType="multipart/form-data">
                {/* Name */}
                <div className="col-md-6">

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Tên Villa"
                        className="form-control ip-data rounded-3"
                        required
                    />
                </div>

                {/* Description */}


                {/* Address */}
                <div className="col-md-6">
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Địa chỉ"
                        className="form-control ip-data rounded-3"
                        required
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
                        className="form-control ip-data rounded-3"
                        required
                    />
                </div>

                {/* Price Per Night */}
                <div className="col-md-6">
                    <input
                        type="number"
                        name="pricePerNight"
                        value={formData.pricePerNight}
                        onChange={handleChange}
                        placeholder="Giá một đêm (VNĐ)"
                        className="form-control ip-data rounded-3"
                        required
                    />
                </div>

                {/* Capacity */}
                <div className="col-md-6">
                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        placeholder="Số khách tối đa"
                        className="form-control ip-data rounded-3"
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
                        className="form-control ip-data rounded-3"
                        required
                    />
                </div>

                {/* Status */}
                <div className="col-md-6">
                    <div className="form-group">
                        <select
                            name="status"
                            id="status"
                            className="form-control ip-data rounded-3"
                            value={formData.status.toString()}
                            onChange={(e) =>
                                setFormData({ ...formData, status: e.target.value === "true" })
                            }>
                            <option value={false}>Trạng thái</option>
                            <option value={true}>Còn trống</option>
                            <option value={false}>Không còn trống</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-6">
                    <input
                        type="file"
                        name="imageUrls"
                        accept=".jpg, .jpeg, .png"
                        multiple
                        onChange={(e) => setFormData({ ...formData, imageUrls: Array.from(e.target.files) })}
                        className="form-control ip-data"
                    />
                </div>
                {/* Location */}
                <div className="col-md-6 m-0 py-1">
                    <select name="locationId" value={formData.locationId} onChange={handleChange} className="rounded-3 form-select ip-data" required>
                        <option value="">Vị trí</option>
                        {locations.map((location) => (
                            <option key={location.id} value={location.id}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Discount */}
                <div className="col-md-6 m-0 py-1">
                    <select
                        name="discountId"
                        value={formData.discountId}
                        onChange={handleChange}
                        className="form-select ip-data rounded-3"
                        required>
                        <option value="">0% (Khuyến mãi)</option> {/* Mặc định là 0% */}
                        {discounts.map((discount) => (
                            <option key={discount.id} value={discount.id}>
                                {discount.description} ({discount.percentage}%)
                            </option>
                        ))}
                    </select>
                </div>


                {/* Image Upload */}

                <div className="">
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
    );
};
AddVillaForm.propTypes = {
    onClose: PropTypes.func
};
export default AddVillaForm;
