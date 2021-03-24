const { getUserPosts } = require("../persistence/posts");
const { getAllUsers } = require("../persistence/users");

async function postsAchievements() {
    let result = await getAllUsers();
    let userDocuments = await result.toArray();

    for (let user of await userDocuments) {
        let postDocuments = await getUserPosts(user._id);
        let numPosts = await postDocuments.length;

        
    }
}

module.exports = postsAchievements;