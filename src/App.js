import React from 'react';
import { ReactComponent as TomatoSvg } from './logo.svg';
import SearchBar from './components/SearchBar';
import UserProfile from './components/UserProfile';
import RestaurantsTable from './components/RestaurantsTable';

const RestaurantRatingApp = () => {

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
      <SearchBar />
      <RestaurantsTable />
    </div>
  );
};

export default RestaurantRatingApp;