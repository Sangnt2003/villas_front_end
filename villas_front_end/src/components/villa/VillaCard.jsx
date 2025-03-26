import PropTypes from 'prop-types';
import { useState } from 'react';
import '../../styles/VillaCard.css';
import { imageUrl } from '../../services/enviroment.jsx';
import { useNavigate } from 'react-router-dom';
import { getVilla } from '../../services/api/villa';
import { generateStarElements } from '../../services/elementsUtils.jsx';

export const VillaCard = ({ villa }) => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleShowDetail = async () => {
        try {
            const villaData = await getVilla(villa.id);
            navigate(`/villa-detail/${villa.name}`, { state: { villa: villaData } });
        } catch (error) {
            console.error("Error fetching villa data:", error);
            setError(error.message || "Lỗi khi lấy thông tin villa");
        }
    };



    return (
        <div className='villa-items mb-2' onClick={handleShowDetail}>
            <div className="backgroud-card row">
                <div className="col-4">
                    {villa?.imageUrls?.length > 0 ? (
                        <img
                            className="w-100 rounded villa-image"
                            src={`${imageUrl}villa/${villa.imageUrls[0]}`}
                            alt={villa.name}
                        />
                    ) : (
                        <img
                            className="w-100 rounded villa-image"
                            src={`${imageUrl}villa-default.png`}
                            alt={villa.name}
                        />
                    )}
                </div>
                <div className="col-8 row">
                    <div className='col-7'>
                        <div className='price-villa mb-3'>
                            <h4 className="fw-bold ">{villa.name}</h4>
                        </div>
                        <div className='rating-villa mb-3'>
                            <i className='h4'>{generateStarElements(villa.rating)}</i>
                        </div>
                        <div className='address-villa h6 truncated-text '>
                            <i className="bi bi-geo-alt-fill text-danger"></i> {villa.address}
                        </div>
                    </div>
                    <div className="col-5">
                        <div>
                            <span className="text-secondary text-decoration-line-through" style={{ fontSize: '25px' }}>
                                {(villa.listedPrice * 1.2).toLocaleString('vi-VN')} VNĐ
                            </span>
                        </div>
                        <div>
                            <h4 className="text-danger fw-bold d-inline" style={{ fontSize: '25px' }}>
                                {villa.listedPrice.toLocaleString('vi-VN')} VNĐ
                            </h4>
                        </div>
                    </div>
                </div>

            </div>
            {error && <p className="text-danger text-center mt-2">{error}</p>}
        </div>
    );
};

VillaCard.propTypes = {
    villa: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        rating: PropTypes.number.isRequired,
        address: PropTypes.string.isRequired,
        villaServices: PropTypes.array.isRequired,
        listedPrice: PropTypes.number.isRequired,
        imageUrls: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};

export default VillaCard;
