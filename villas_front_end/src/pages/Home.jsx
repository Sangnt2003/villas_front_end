import Search from '../components/search/search.jsx';
import '../styles/Home.css';
import { UserContext } from '../contexts/UserContext.jsx';
import { useContext } from 'react';
import LocationCardList from '../components/location/LocationCardList.jsx';
import VillaCardList from '../components/villa/VillaCardList.jsx';
import VillaSearchNearby from '../components/villa/VillaSearchNearBy.jsx';
const HomePage = () => {
    const { userInfo } = useContext(UserContext);
    const firstName = userInfo?.fullName?.split(' ').slice(-1).join('') || '';
    return (
        <div className="home-page">
            <div className="w-100">
                <div className="background">
                    <div className="search-container">
                        <div className='w-75'>
                            <div className='text-start'>
                                {firstName ? (
                                    <>
                                        <h1 className='home-heading-1'>{firstName}, Tiếp theo bạn muốn có kì nghỉ ở đâu nè?</h1>
                                    </>
                                ) : <h1 className='home-heading-1'>Tiếp theo bạn muốn có kì nghỉ ở đâu nè?</h1>}
                                <p className='home-heading-2 text-start'>Cùng với khuyến mãi ngập tràn</p>
                            </div>
                            <Search />
                        </div>
                    </div>
                </div>
                {userInfo && (
                    <div className="list-card">
                        <div style={{ width: '34%' }}>
                            <h1
                                className="fw-bold gradient-text text-center"
                                style={{ fontSize: 50 }}>
                                Những Villa gần bạn
                            </h1>
                        </div>
                        <VillaSearchNearby />
                    </div>
                )}
                <div className="list-card">
                    <div style={{ width: '46%' }}>
                        <h1
                            className="fw-bold gradient-text text-center"
                            style={{ fontSize: 50 }}>
                            Những điểm đến hot trong năm
                        </h1>
                    </div>
                    <LocationCardList />
                </div>
                <div className="list-card">
                    <div style={{ width: '45%' }}>
                        <h1
                            className="fw-bold gradient-text text-center"
                            style={{ fontSize: 50 }}>
                            Hãy chọn nơi bạn muốn đến♥
                        </h1>
                    </div>
                    <VillaCardList />
                </div>

            </div>
        </div >
    );
};

export default HomePage;


