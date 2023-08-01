import React from "react";
import"./Home.css";
import Product from"./Product.js"
import MetaData from "../layout/MetaData";
const product={
  name:"Blue tshirt",
  images:[{url:"https://i.ibb.co/DRST11n/1.webp"}],
  price:"3300",
  _id:"om"
};

const Home = () => {
  return(
     <React.Fragment>
      <MetaData title="Home page is working"/>
    <div className="banner">
        <p>Welcome to ecommerce</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>

<a href="#container">
  <button>
    Scroll 
  </button>
</a>
</div>
<h2 className="homeHeading">Featured Products</h2>

<div className="container" id="container">
  <Product product ={product}/>
  <Product product ={product}/>
  <Product product ={product}/>
  <Product product ={product}/>
  <Product product ={product}/>
  <Product product ={product}/>
  <Product product ={product}/>
  <Product product ={product}/>

</div>
  </React.Fragment>

   
  )
}

export default Home 