import React, { useState, useEffect } from 'react';
import { ReactComponent as TomatoSvg } from './logo.svg';
import UserProfile from './UserProfile';

const RestaurantRatingApp = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [viewMode, setViewMode] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch restaurants from API (Yelp or Google)
    // This is a placeholder. You'll need to implement the actual API call
    const fetchRestaurants = async () => {
      // const response = await fetch('/api/restaurants');
      // const data = await response.json();
      // setRestaurants(data);
    };

    fetchRestaurants();
  }, []);

  const handleAddRating = (restaurantId, rating) => {
    // Implement rating logic here
  };

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {restaurants.map((restaurant) => (
        <div key={restaurant.id} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{restaurant.name}</div>
            <p className="text-gray-700 text-base">Cuisine: {restaurant.cuisine}</p>
            <p className="text-gray-700 text-base">Date Visited: {restaurant.dateVisited}</p>
            <p className="text-gray-700 text-base">Food Ordered: {restaurant.foodOrdered}</p>
            <p className="text-gray-700 text-base">Rating: {restaurant.rating}/10</p>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Cuisine</th>
            <th className="py-3 px-6 text-left">Date Visited</th>
            <th className="py-3 px-6 text-left">Food Ordered</th>
            <th className="py-3 px-6 text-left">Rating</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {restaurants.map((restaurant) => (
            <tr key={restaurant.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{restaurant.name}</td>
              <td className="py-3 px-6 text-left">{restaurant.cuisine}</td>
              <td className="py-3 px-6 text-left">{restaurant.dateVisited}</td>
              <td className="py-3 px-6 text-left">{restaurant.foodOrdered}</td>
              <td className="py-3 px-6 text-left">{restaurant.rating}/10</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="relative flex flex-nowrap items-center justify-between w-full mx-auto">
        <div className="flex flex-nowrap items-center">
          <TomatoSvg width={40} height={45} style={{display:"inline-block"}}/>
          <h1 className="text-4xl px-2 font-bold" style={{fontFamily:"italiana"}}>Appetit</h1>
        </div>
        <UserProfile/>
      </div>
      <div className="relative w-full py-4 max-w-4xl mx-auto">
        <h1 className="text-3xl px-2 font-bold" style={{fontFamily:"italiana"}}>Add a restaurant visit to your list:</h1>
      </div>
      <div className="relative w-full max-w-4xl mx-auto">
        <input
          type="text"
          id="search"
          className="peer block w-full px-4 py-4 text-black bg-transparent border border-amber-700 rounded-lg focus:ring-0 focus:outline-none focus:border-amber-600"
          placeholder=""
        />
        <label
          htmlFor="search"
          className="absolute text-amber-700 left-4 bg-orange-100 px-1 text-sm transition-all transform peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-amber-700 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-amber-600"
        >
          Restaurant Name...
        </label>
      </div>
      {viewMode === 'card' ? renderCardView() : renderTableView()}
    </div>
  );
};

export default RestaurantRatingApp;