import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
function App() {
    const [ads, setAds] = useState([]);
    const [ipAddress, setIpAddress] = useState('');
    const [adText, setAdText] = useState('');

    // Функція для отримання IP-адреси
    const fetchIpAddress = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            setIpAddress(response.data.ip);
        } catch (error) {
            console.error("Error fetching IP address:", error);
        }
    };

    // Функція для отримання всіх оголошень
    const fetchAds = async () => {
        try {
            const response = await axios.get('http://54.89.130.1:5000/ads');
            setAds(response.data);
        } catch (error) {
            console.error("Error fetching ads:", error);
        }
    };

    // Викликаємо fetchIpAddress та fetchAds при завантаженні компонента
    useEffect(() => {
        fetchIpAddress();
        fetchAds();
    }, []);

    // Функція для додавання нового оголошення
    const handleAddAd = async (e) => {
        e.preventDefault(); // Запобігаємо перезавантаженню сторінки

        try {
            await axios.post('http://54.89.130.1:5000/ads', {
                ip_address: ipAddress,
                ad_text: adText,
            });

            // Оновлюємо список оголошень після додавання
            fetchAds();

            // Очищаємо поле вводу для тексту оголошення
            setAdText('');
        } catch (error) {
            console.error("Error adding ad:", error);
        }
    };

    return (
        <div>
            <h1>Оголошення</h1>

            <form onSubmit={handleAddAd}>
                <textarea
                    placeholder="Текст оголошення"
                    value={adText}
                    onChange={(e) => setAdText(e.target.value)}
                    required
                />
                <button type="submit">Додати оголошення</button>
            </form>

            <h2>Усі оголошення:</h2>
            <ul>
                {ads.map(ad => (
                    <li key={ad.id}>
                        <strong>{ad.ip_address}</strong>: {ad.ad_text}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
