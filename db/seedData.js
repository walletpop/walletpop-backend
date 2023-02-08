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

module.exports = {
  users, soldItems
}
