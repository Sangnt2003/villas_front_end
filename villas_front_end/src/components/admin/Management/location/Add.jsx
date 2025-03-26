/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import { addLocation } from '../../../../services/api/Location';
import '../../../../styles/VillaManagement.css';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../contexts/UserContext';

const AddVillaForm = ({ onClose }) => {
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Gọi API để thêm Location với dữ liệu formData
            await addLocation(formData);
            alert('Thêm villa thành công');
            onClose();
        } catch (err) {
            setError('Failed to add villa. Please try again.');
        }
    };

    return (
        <div className="container modal-content">
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
            <form onSubmit={handleSubmit} className="row g-4" encType="multipart/form-data">
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
                <div className="col-md-6">
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Mô tả"
                        className="form-control ip-data rounded-3"
                        required
                    />
                </div>

                {/* Image URL */}
                <div className="col-md-6">
                    <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="URL hình ảnh"
                        className="form-control ip-data rounded-3"
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
    onClose: PropTypes.func,
};

export default AddVillaForm;
