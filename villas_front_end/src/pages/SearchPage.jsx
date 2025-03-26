// src/pages/SearchPage.jsx
import { useNavigate } from 'react-router-dom';
import Search from '../components/search/search.jsx';

const SearchPage = () => {
    const navigate = useNavigate();

    const handleResultClick = () => {
        navigate('/villa-list');
    };

    return (
        <div className="search-page">
            <h1>Kết quả tìm kiếm</h1>
            <Search /> {/* Cho phép tìm kiếm lại */}
            <div className="search-results">
                <button onClick={handleResultClick}>Xem danh sách Villa</button>
            </div>
        </div>
    );
};

export default SearchPage;
