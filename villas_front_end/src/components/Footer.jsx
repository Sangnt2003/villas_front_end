import icon from "/assets/icon/icon.png";
import '../styles/Footer.css';

export const Footer = () => {
    return (
        <div className="footer col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="footer-content">
                <p className="copyright">
                    Bản quyền © Nguyễn Tấn Sang
                </p>

                <div className="contact-info">
                    <div className="phone">
                        <span>0965801407</span>
                    </div>
                    <div className="email">
                        <span>nguyentansangit2411@gmail.com</span>
                    </div>
                    <div className="address">
                        <span>188 Nguyễn Xí, Phường 26, Quận Bình Thạnh, TP.HCM </span>
                    </div>
                </div>

                <div className="footer-logo">
                    <img className="footer-icon" alt="Icon" src={icon} />
                </div>
            </div>
        </div>
    );
};

export default Footer;
