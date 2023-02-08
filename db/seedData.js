const users = [
  {
    password: "brettpass",
    email: "brett@example.com",
    location: 'Madrid'
  },
  {
    password: "headfirst",
    email: "keepyourheadonstraight@example.com",
    location: 'London'
  },
  {
    password: "scarykary",
    email: "dontbefrightened@example.com",
    location: 'Argentina'
  }
]

const soldItems = [
  {
    itemID: "53e72896-7d0e-43a7-bf49-a46a59c8a711",
    userID: "e328b4a1-8e43-4e1d-9cad-2b84c636ab5c",
    dateSold: "8/2/2023"
  },
  {
    itemID: "38858132-f1c6-4b79-b784-02ca3f8116da",
    userID: "25e949e8-d3d0-44f0-8337-f95d17fd8b79",
    dateSold: "9/2/2023"
  },
  {
    itemID: "9dd21388-1f42-4d67-ac61-5130e37984ee",
    userID: "19d687b2-be14-4f98-8d74-85b269d5abd4",
    dateSold: "10/2/2023"
  }
]

const items = [
  {
    name: "iphone 13",
    price: 850,
    picture: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-model-unselect-gallery-1-202207?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1654893619853",
    category: "technology"
  },
  {
    name: "Picture frame",
    price: 10.3,
    category: "home"
  },
  {
    name: "colourful dress",
    price: 25.99,
    description: "Only used once, like new",
    picture: "https://img.ltwebstatic.com/images3_pi/2022/08/09/1660025925908e7ebd54eafd2b1887fb40738a88f4_thumbnail_900x.webp"
  }
]


module.exports = {
  users,
  items,
  soldItems
}
