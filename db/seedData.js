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
