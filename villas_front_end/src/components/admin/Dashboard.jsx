/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../../styles/Dashboard.css";

const Dashboard = () => {
    const [userInfo, setUserInfo] = useState(null);

    // useEffect để lấy userInfo từ localStorage khi component được render
    useEffect(() => {
        const savedUserInfo = localStorage.getItem("userInfo");
        if (savedUserInfo) {
            setUserInfo(JSON.parse(savedUserInfo)); // Cập nhật userInfo từ localStorage
        }
    }, []); // useEffect chỉ chạy một lần khi component được render

    if (!userInfo) {
        return <p>Loading...</p>; // Hiển thị khi dữ liệu chưa được tải
    }

    return (
        <div className="main-content-container ">
            {/* Header */}
            <header className="header">
                <h1>Trang Admin</h1>
                <h4>Xin chào sếp {userInfo.fullName}</h4>
            </header>

            {/* Statistic Cards */}
            <section className="stats">
                <div className="card">
                    <h2>Total Users</h2>
                    <p>1,245</p>
                </div>
                <div className="card">
                    <h2>Doanh thu</h2>
                    <h3>{userInfo.balance.toLocaleString('vi')} VNĐ</h3>
                </div>
                <div className="card">
                    <h2>New Orders</h2>
                    <p>123</p>
                </div>
                <div className="card">
                    <h2>Active Sessions</h2>
                    <p>87</p>
                </div>
            </section>

            {/* Table Section */}
            <section className="table-section">
                <h2>Recent Orders</h2>
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#00123</td>
                            <td>John Doe</td>
                            <td>2024-12-01</td>
                            <td>$150</td>
                            <td>Completed</td>
                        </tr>
                        <tr>
                            <td>#00124</td>
                            <td>Jane Smith</td>
                            <td>2024-12-02</td>
                            <td>$200</td>
                            <td>Pending</td>
                        </tr>
                        <tr>
                            <td>#00125</td>
                            <td>Robert Brown</td>
                            <td>2024-12-03</td>
                            <td>$320</td>
                            <td>Cancelled</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Chart Section (Static Example) */}
            <section className="chart-section">
                <h2>Monthly Sales</h2>
                <div className="chart">
                    <div className="bar" style={{ height: "70%" }}></div>
                    <div className="bar" style={{ height: "50%" }}></div>
                    <div className="bar" style={{ height: "90%" }}></div>
                    <div className="bar" style={{ height: "60%" }}></div>
                    <div className="bar" style={{ height: "80%" }}></div>
                </div>
                <div className="chart-labels">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
