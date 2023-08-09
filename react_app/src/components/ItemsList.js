import React, { useState, useEffect } from 'react';
import { getItems } from '../api';

const ItemsList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const data = await getItems();
            setItems(data);
        };
        fetchItems();
    }, []);

    return (
        <div>
            <h2>Items</h2>
            <ul>
                {items.map(item => (
                    <li key={item.id}>{item.name}: {item.description}</li>
                ))}
            </ul>
        </div>
    );
}

export default ItemsList;
