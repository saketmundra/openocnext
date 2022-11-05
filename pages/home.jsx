import React from 'react';
import Navbar from "../components/navbar"
import Announcement from '../components/announcement';
import CreateItem from './create-item'
import Slider from '../components/slider'
import Categories from '../components/categories'
import Products from "../components/Products";
import Footer from "../components/footer";




const home = () => {
  return <div>
      <Announcement/>
      <Navbar/>
      <CreateItem/>
      {/* <Slider />
      <Categories />
      <Products/>
      <Footer/> */}
  </div>;
};

export default home;
