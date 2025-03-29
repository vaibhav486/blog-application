
        document.getElementById("togglePostsBtn").addEventListener("click", async function () {
            const postsContainer = document.getElementById("postsContainer");
            const button = this;

            if (postsContainer.style.display === "none") {
                // Fetch posts and show them
                const response = await fetch("/get-posts");
                const posts = await response.json();
                postsContainer.innerHTML = "";

                if (posts.length === 0) {
                    postsContainer.innerHTML = "<p>No posts yet.</p>";
                } else {
                    const ul = document.createElement("ul");

                    posts.forEach(post => {
                        const li = document.createElement("li");
                        li.innerHTML = `
                            <h2>${post.title}</h2>
                            <p>${post.content}</p>
                            <a href="/edit/${post.id}">Edit post</a>
                            <form action="/delete/${post.id}" method="POST" style="display:inline;">
                                <button type="submit">Delete</button>
                            </form>
                        `;
                        ul.appendChild(li);
                    });

                    postsContainer.appendChild(ul);
                }

                postsContainer.style.display = "block"; 
                button.textContent = "Hide My Posts"; // Change button text
            } else {
                // Hide posts
                postsContainer.style.display = "none";
                button.textContent = "Show My Posts"; // Change button text back
            }
        });
 