const API_URL = "http://localhost:3001";  // backend url
let currentUser = localStorage.getItem("currentUser") || null;

// Auth Functions
async function signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    alert("Signup successful! Please login.");
  } else {
    alert(await res.text());
  }
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    const data = await res.json();
    currentUser = data.username;
    localStorage.setItem("currentUser", currentUser);
    updateAuthStatus();
    document.getElementById("blogFormSection").style.display = "block";
    alert("Login successful!");
  } else {
    alert(await res.text());
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateAuthStatus();
  document.getElementById("blogFormSection").style.display = "none";
}

function updateAuthStatus() {
  const authStatus = document.getElementById("authStatus");
  if (currentUser) {
    authStatus.textContent = `Logged in as: ${currentUser}`;
  } else {
    authStatus.textContent = "Not logged in";
  }
}

// Blog Functions
const blogForm = document.getElementById("blogForm");
const blogsContainer = document.getElementById("blogsContainer");

blogForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) {
    alert("Login required!");
    return;
  }

  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  const res = await fetch(`${API_URL}/blogs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, author: currentUser })
  });

  if (res.ok) {
    blogForm.reset();
    loadBlogs();
  }
});

async function loadBlogs() {
  const res = await fetch(`${API_URL}/blogs`);
  const blogs = await res.json();

  blogsContainer.innerHTML = "";
  blogs.forEach(blog => {
    const div = document.createElement("div");
    div.className = "blog-card";
    div.innerHTML = `
      <h3>${blog.title}</h3>
      <p>${blog.content}</p>
      <small>By ${blog.author} on ${new Date(blog.createdAt).toLocaleString()}</small>
      <br><br>
      ${currentUser === blog.author ? `
        <button onclick="editBlog('${blog._id}')">Edit</button>
        <button onclick="deleteBlog('${blog._id}')">Delete</button>
      ` : ""}
    `;
    blogsContainer.appendChild(div);
  });
}

async function deleteBlog(id) {
  await fetch(`${API_URL}/blogs/${id}`, { method: "DELETE" });
  loadBlogs();
}

async function editBlog(id) {
  const newTitle = prompt("Edit Title");
  const newContent = prompt("Edit Content");

  if (newTitle && newContent) {
    await fetch(`${API_URL}/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, content: newContent })
    });
    loadBlogs();
  }
}

// Initial Load
updateAuthStatus();
loadBlogs();
