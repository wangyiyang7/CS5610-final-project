import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import * as atlas from "azure-maps-control";
import "./atlas.min.css";

const ProfileComponent = () => {
  const [userInfo, setUserInfo] = useState({});
  const [orderHistory, setOrderHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { accountId } = useParams();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userToken = localStorage.getItem("token");
        const userResponse = await fetch(
          `http://localhost:5001/profile/${accountId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": userToken,
            },
          }
        );
        const userData = await userResponse.json();
        setUserInfo(userData);

        const orderResponse = await fetch(
          `http://localhost:5001/order/${accountId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-access-token": userToken,
            },
          }
        );
        const orderData = await orderResponse.json();
        setOrderHistory(orderData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [accountId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async (updatedInfo) => {
    const saveToken = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5001/profile/${accountId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": saveToken,
      },
      body: JSON.stringify(updatedInfo),
    });
    if (response.ok) {
      setUserInfo(updatedInfo);
      setIsEditing(false); // Exit edit mode
    } else {
      console.error("Error updating profile");
    }
  };

  const mapRef = useRef(null);

  useEffect(() => {
    const map = new atlas.Map(mapRef.current, {
      center: [-123.11544, 49.28078],
      zoom: 14,
      authOptions: {
        authType: "subscriptionKey",
        subscriptionKey:
          "AQPjGnNIJmyFYXcFYW8g9XG8GOf2BqzNSY0LUZAdNOGg3d9GeSIuJQQJ99AKAC8vTInpI8XKAAAgAZMP3kjH",
      },
    });

    map.events.add("ready", () => {
      map.markers.add(
        new atlas.HtmlMarker({
          color: "DodgerBlue",
          position: [-123.11544, 49.28078],
        })
      );
    });

    return () => map.dispose();
  }, []);

  const handleDeleteOrder = async (id) => {
    const newOrderHistory = orderHistory.filter(
      (order) => order.orderNumber !== id
    );
    setOrderHistory(newOrderHistory);
    try {
      const userToken = localStorage.getItem("token");
      const userResponse = await fetch(`http://localhost:5001/order/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": userToken,
        },
      });
      if (userResponse.ok) {
        alert(`Order ${id} deleted!`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    const deleteToken = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5001/profile/${accountId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": deleteToken,
      },
    });
    if (response.ok) {
      logout();
      navigate("/login");
    } else {
      console.error("Error deleting account");
    }
  };

  return (
    <div>
      <div className="user-profile">
        <div className="user-profile__sidebar">
          <h2>Hi {userInfo.firstName}</h2>
          <nav>
            <ul>
              <li>
                <a href="#personal-info">Personal Information</a>
              </li>
              <li>
                <Link to={`/profile/${userInfo.accountId}/order-history`}>
                  Order History
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="user-profile__content">
          <div id="personal-info" className="user-profile__personal-info">
            <h2>Personal Information</h2>
            {isEditing ? (
              <div>
                <label>First Name:</label>
                <input
                  type="text"
                  defaultValue={userInfo.firstName}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, firstName: e.target.value })
                  }
                />
                <br />
                <label>Last Name:</label>
                <input
                  type="text"
                  defaultValue={userInfo.lastName}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, lastName: e.target.value })
                  }
                />
                <br />
                <label>Phone:</label>
                <input
                  type="text"
                  defaultValue={userInfo.phoneNumber}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, phoneNumber: e.target.value })
                  }
                />
                <br />
                <label>Email:</label>
                <input
                  type="email"
                  defaultValue={userInfo.email}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, email: e.target.value })
                  }
                />
                <br />
                <label>Address:</label>
                <textarea
                  type="text"
                  defaultValue={userInfo.address}
                  onChange={(e) =>
                    setUserInfo({ ...userInfo, address: e.target.value })
                  }
                />
                <br />
                <button onClick={() => handleSaveClick(userInfo)}>
                  Save Changes
                </button>
              </div>
            ) : (
              <div>
                <p>
                  Name: {userInfo.firstName} {userInfo.lastName}
                </p>
                <p>Phone: {userInfo.phoneNumber}</p>
                <p>Email: {userInfo.email}</p>
                <p>Address: {userInfo.address}</p>
              </div>
            )}
          </div>
          <div>
            <button onClick={handleEditClick}>Edit</button>
            <button onClick={handleDeleteAccount}>Delete Account</button>
          </div>
        </div>
        <div
          id="map"
          ref={mapRef}
          style={{ width: "300px", height: "300px" }}
        />
      </div>
      <div id="order-history" className="user-profile__order-history">
        <h2>Order History</h2>
        <ul>
          {orderHistory.map((order) => (
            <li key={order.orderNumber}>
              <span>Order Date: {order.orderDate}</span>
              <span> | </span>
              <span>Order Number: {order.orderNumber}</span>
              <span> | </span>
              <span>Total: ${order.total.toFixed(2)}</span>
              <span> | </span>
              <button onClick={() => handleDeleteOrder(order.orderNumber)}>
                Delete
              </button>{" "}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileComponent;
