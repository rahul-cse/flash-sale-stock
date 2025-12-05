import React, { useEffect, useState } from "react";
import ReservationTimer from "./ReservationTimer";
import { API_BASE_URL } from "./../apiConfig";


function ProductList() {    
  const [products, setProducts] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [updatingStock, setUpdatingStock] = useState(false);

  async function loadProducts() {
    const res = await fetch(`${API_BASE_URL}/products`);
    const data = await res.json();
    setProducts(data);
  }

  useEffect(() => {
    console.log("loadProducts")
    loadProducts();
     
    if (!reservation) {
            setTimeout(() => {   
            loadProducts();
            setUpdatingStock(false);
        }, 5000);
    }
  }, [reservation]);

  async function reserve(productId) {
    const res = await fetch(`${API_BASE_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });

    const data = await res.json();
    setReservation(data);
    loadProducts();
  }

  async function complete() {
    if (!reservation) return;

    await fetch(
      `${API_BASE_URL}/reservations/${reservation.id}/complete`,
      {
        method: "POST",
      }
    );

    setReservation(null);
    loadProducts();
  }

  return (
    <div>
        {updatingStock && (<div>updating Stock....</div>)}
        { !updatingStock && (
            <ul>
                {products.map((p) => (
                <li key={p.id} style={{ marginBottom: 10 }}>
                    <b>{p.name}</b> — ৳{p.price} — Stock: {p.availableStock} 
                    <button
                    onClick={() => reserve(p.id)}
                    disabled={p.availableStock <= 0}
                    style={{ marginLeft: 10 }}
                    >
                    Reserve
                    </button>
                </li>
                ))}
            </ul>
        )}
      

      {reservation && (
        <div style={{ marginTop: 20, padding: 12, border: "1px solid #ccc" }}>
          <h3>Active Reservation</h3>
          <div>Reservation ID: {reservation.id}</div>
          <div>Product ID: {reservation.productId}</div>

          <ReservationTimer
            expiresAt={reservation.expiresAt}
            onExpired={() => {
              setReservation(null);
              loadProducts();
              setUpdatingStock(true); 
            }}
          />

          <button onClick={complete} style={{ marginTop: 10 }}>
            Complete Purchase
          </button>
        </div>
      )}
    </div>
  );
}
export default ProductList;