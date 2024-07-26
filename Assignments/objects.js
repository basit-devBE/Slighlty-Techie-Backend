//create an obj for a user with the following data
//username,email,password,firstname,lastname,posts,address: da,location,landmark,area,region
//createdAt,verified

//add the following new properties
//fullname,age,gender


//update username,lastname,gender,location

const user = {
    username: "ba123",
    email: "basitmohammed362@gmail.com",
    password: "Qewerty@123passpassword",
    firstname: "Basit",
    lastname: "Mohammed",
    posts: [{
        title: "My first post",
        content: "This is my first post",
        createdAt: Date(),
    }],
    address: {
        da: "House 11, BA Rd",
        location: "Bomso",
        landmark: "KNUST",
        area: "Kumasi",
        region: "Ashanti"
    },
    createdAt: Date(),
    verified: true,
}

user["fullname"] = user.firstname + " " + user.lastname
user["age"] = 25
user["gender"] = "Male"

user.posts["reviews"] = [{
    user_Id: 1234,
    content: " This is a very nice post",
    createdAt: Date(),
}]

user.posts["likes"] = 35



user.username = "Mobasit8"
user.lastname = "Yussif"
user.gender = "female"
user.address = {
    da: "New House Address",
    location: "New Location",
    landmark: "New Landmark",
    area: "New Area",
    region: "New Region"
};

userjson = JSON.stringify(user)
console.log(userjson)