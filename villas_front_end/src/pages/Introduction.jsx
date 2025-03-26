import '../styles/Introduction.css';

const Introduction = () => {
    return (
        <div className="d-flex justify-content-center">
            <div className="introduction-container">
                <div className="row align-items-center mb-4">
                    <div className="logo col-md-2">
                        <img src='/assets/logo.png' alt="Logo" className="logo-img" />
                    </div>
                    <div className="col-md-10">
                        <h1 className="title ms-3 fw-bold">Giới thiệu về Ecovavilla: Nền tảng cho thuê villa trực tuyến</h1>
                    </div>
                </div>
                <p className="greeting mt-4">Kính chào quý khách,</p>

                <p className="intro-text">
                    Tôi là <strong>Nguyễn Tấn Sang</strong>, người sáng lập và phát triển website <strong>Ecovavilla</strong>.
                    Với tâm huyết và nỗ lực không ngừng nghỉ, tôi đã xây dựng nên nền tảng cho thuê villa trực tuyến Ecovavilla,
                    nhằm mang đến cho khách hàng một trải nghiệm dễ dàng, tiện lợi và hiệu quả trong việc thuê và cho thuê các căn villa đẹp đẽ tại mọi nơi.
                </p>

                <h2 className="subheading">Tầm nhìn và sứ mệnh</h2>
                <p>
                    Ecovavilla ra đời với tầm nhìn trở thành nền tảng hàng đầu cho thuê villa trực tuyến tại Việt Nam và khu vực.
                    Sứ mệnh của chúng tôi là kết nối giữa chủ villa và khách thuê một cách nhanh chóng và hiệu quả, góp phần thúc đẩy sự phát triển của ngành du lịch và nghỉ dưỡng.
                </p>
                <p>
                    Chúng tôi tin rằng với công nghệ hiện đại và sự tận tâm phục vụ, Ecovavilla sẽ giúp các chủ villa tối ưu hóa việc khai thác tài sản của mình và mang đến cho khách hàng những trải nghiệm nghỉ dưỡng tuyệt vời nhất.
                </p>

                <h2 className="subheading">Tính năng nổi bật của Ecovavilla</h2>
                <ul>
                    <li>
                        <strong>Dễ dàng đăng ký và quản lý villa:</strong> Chủ villa có thể dễ dàng đăng ký và quản lý thông tin các căn villa của mình trên Ecovavilla.
                        Giao diện thân thiện và dễ sử dụng giúp chủ villa cập nhật thông tin chi tiết về villa, bao gồm hình ảnh, giá cả, tiện ích và các quy định đặt phòng.
                    </li>
                    <li>
                        <strong>Hỗ trợ đa nền tảng:</strong> Ecovavilla hỗ trợ trên nhiều nền tảng khác nhau, bao gồm website và ứng dụng di động,
                        giúp khách hàng có thể dễ dàng tiếp cận dịch vụ bất kỳ lúc nào, ở bất kỳ đâu.
                    </li>
                    <li>
                        <strong>Thanh toán an toàn và tiện lợi:</strong> Ecovavilla tích hợp nhiều phương thức thanh toán an toàn và tiện lợi như thẻ tín dụng, chuyển khoản ngân hàng, và ví điện tử, đảm bảo quá trình giao dịch diễn ra nhanh chóng và bảo mật.
                    </li>
                    <li>
                        <strong>Tìm kiếm và gợi ý thông minh:</strong> Với công nghệ AI, Ecovavilla cung cấp tính năng tìm kiếm và gợi ý thông minh, giúp khách hàng dễ dàng tìm thấy căn villa phù hợp với nhu cầu và sở thích của mình. Chúng tôi sử dụng thuật toán phân tích dữ liệu để đưa ra các gợi ý chính xác và tối ưu nhất cho khách hàng.
                    </li>
                    <li>
                        <strong>Đánh giá và phản hồi:</strong> Khách hàng có thể đánh giá và để lại phản hồi sau khi sử dụng dịch vụ. Những đánh giá này giúp chủ villa cải thiện chất lượng dịch vụ và giúp các khách hàng khác có thêm thông tin tham khảo khi lựa chọn villa.
                    </li>
                </ul>

                <h2 className="subheading">Quy trình đăng ký và quản lý villa trên Ecovavilla</h2>
                <ol>
                    <li><strong>Đăng ký tài khoản:</strong> Chủ villa cần đăng ký tài khoản trên Ecovavilla. Quy trình đăng ký nhanh chóng và đơn giản, yêu cầu chủ villa cung cấp thông tin cá nhân và liên hệ cơ bản.</li>
                    <li><strong>Đăng tin villa:</strong> Sau khi đăng ký thành công, chủ villa có thể đăng tin về các căn villa của mình. Chúng tôi khuyến khích chủ villa cung cấp đầy đủ thông tin chi tiết và hình ảnh chất lượng cao để thu hút sự quan tâm của khách hàng.</li>
                    <li><strong>Quản lý đặt phòng:</strong> Chủ villa có thể dễ dàng quản lý các yêu cầu đặt phòng từ khách hàng thông qua bảng điều khiển quản lý. Hệ thống cung cấp thông tin chi tiết về lịch đặt phòng, tình trạng phòng, và các yêu cầu đặc biệt từ khách hàng.</li>
                    <li><strong>Thanh toán và xác nhận:</strong> Ecovavilla hỗ trợ chủ villa trong việc xử lý thanh toán và xác nhận đặt phòng. Chúng tôi đảm bảo các giao dịch diễn ra an toàn và nhanh chóng, giúp chủ villa tiết kiệm thời gian và công sức.</li>
                    <li><strong>Phản hồi và đánh giá:</strong> Chủ villa có thể nhận phản hồi từ khách hàng sau mỗi kỳ lưu trú. Những phản hồi này là nguồn thông tin quý báu giúp chủ villa cải thiện chất lượng dịch vụ và đáp ứng tốt hơn nhu cầu của khách hàng.</li>
                </ol>

                <h2 className="subheading">Trải nghiệm của khách hàng trên Ecovavilla</h2>
                <ul>
                    <li><strong>Tìm kiếm dễ dàng:</strong> Khách hàng có thể dễ dàng tìm kiếm các căn villa phù hợp với nhu cầu của mình thông qua tính năng tìm kiếm nâng cao. Hệ thống gợi ý thông minh giúp khách hàng tiết kiệm thời gian và nhanh chóng tìm được căn villa ưng ý.</li>
                    <li><strong>Đặt phòng nhanh chóng:</strong> Chỉ với vài thao tác đơn giản, khách hàng có thể đặt phòng ngay trên website hoặc ứng dụng di động của Ecovavilla. Quy trình đặt phòng được tối ưu hóa để mang lại sự thuận tiện và nhanh chóng.</li>
                    <li><strong>Thanh toán linh hoạt:</strong> Khách hàng có thể lựa chọn phương thức thanh toán phù hợp nhất với mình, đảm bảo quá trình thanh toán diễn ra an toàn và thuận tiện.</li>
                    <li><strong>Dịch vụ hỗ trợ khách hàng:</strong> Ecovavilla cung cấp dịch vụ hỗ trợ khách hàng 24/7, sẵn sàng giải đáp mọi thắc mắc và hỗ trợ khách hàng trong quá trình đặt phòng và lưu trú.</li>
                    <li><strong>Đánh giá và chia sẻ trải nghiệm:</strong> Sau khi trải nghiệm dịch vụ, khách hàng có thể đánh giá và chia sẻ trải nghiệm của mình trên Ecovavilla. Những đánh giá này không chỉ giúp cải thiện chất lượng dịch vụ mà còn là nguồn thông tin hữu ích cho các khách hàng khác.</li>
                </ul>

                <h2 className="subheading">Tầm nhìn phát triển của Ecovavilla</h2>
                <p>
                    Trong tương lai, Ecovavilla không chỉ dừng lại ở việc là một nền tảng cho thuê villa, mà còn hướng tới xây dựng một hệ sinh thái dịch vụ du lịch toàn diện.
                    Chúng tôi đang nghiên cứu và phát triển các tính năng mới như tour du lịch, dịch vụ xe đưa đón, và các tiện ích bổ sung khác nhằm mang lại trải nghiệm du lịch trọn vẹn cho khách hàng.
                </p>
                <p>
                    Ngoài ra, chúng tôi cũng hướng tới việc mở rộng phạm vi hoạt động ra quốc tế, đưa Ecovavilla trở thành một thương hiệu uy tín và được tin cậy trên thị trường toàn cầu.
                    Chúng tôi cam kết không ngừng cải tiến và nâng cao chất lượng dịch vụ để đáp ứng tốt nhất nhu cầu của khách hàng.
                </p>

                <h2 className="subheading">Cam kết của Ecovavilla</h2>
                <p>
                    Ecovavilla cam kết mang đến cho khách hàng và chủ villa một nền tảng an toàn, tin cậy và tiện lợi.
                    Chúng tôi luôn lắng nghe và ghi nhận mọi ý kiến đóng góp để hoàn thiện hơn từng ngày. Sự hài lòng của khách hàng chính là động lực để chúng tôi không ngừng nỗ lực và phát triển.
                </p>

                <h2 className="subheading">Lời kết</h2>
                <p>
                    Chúng tôi chân thành cảm ơn quý khách đã tin tưởng và lựa chọn Ecovavilla. Hy vọng rằng với nền tảng này, chúng tôi sẽ mang lại cho quý khách những trải nghiệm nghỉ dưỡng tuyệt vời và đáng nhớ.
                    Nếu có bất kỳ thắc mắc hay cần hỗ trợ, xin đừng ngần ngại liên hệ với chúng tôi. Ecovavilla luôn sẵn sàng phục vụ quý khách.
                </p>
                <p className="signature">
                    Trân trọng,<br />
                    Nguyễn Tấn Sang - Nhà sáng lập Ecovavilla
                </p>
            </div>
        </div>
    );
};

export default Introduction;
