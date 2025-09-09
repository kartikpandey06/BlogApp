let currentUser = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users")) || [];
let posts = JSON.parse(localStorage.getItem("posts")) || [];

// If no sample data, add it
if (users.length === 0 && posts.length === 0) {
  users = [
    { username: "alice", password: "123" },
    { username: "bob", password: "123" },
    { username: "charlie", password: "123" }
  ];

  posts = [
    { id: 1, title: "Hello World!", content: "This is my first post on this blog!", author: "alice", created_at: "2025-09-10 10:00 AM" },
    { id: 2, title: "Tech News", content: "JavaScript keeps evolving every year, ES2025 looks great!", author: "bob", created_at: "2025-09-10 11:30 AM" },
    { id: 3, title: "Life Update", content: "I just started my 2nd year in ECE! Excited for the future 🚀", author: "charlie", created_at: "2025-09-10 01:15 PM" }
  ];

  saveData();
}

function saveData() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("posts", JSON.stringify(posts));
}

function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  if (users.find(u => u.username === username)) {
    alert("User already exists!");
    return;
  }

  users.push({ username, password });
  saveData();
  alert("Registration successful! Please login.");
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    currentUser = username;
    localStorage.setItem("currentUser", currentUser);
    showDashboard();
  } else {
    alert("Invalid credentials!");
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("auth-section").style.display = "block";
}

function createPost() {
  const title = document.getElementById("post-title").value.trim();
  const content = document.getElementById("post-content").value.trim();

  if (!title || !content) {
    alert("Please enter title and content!");
    return;
  }

  posts.push({ 
    id: Date.now(), 
    title, 
    content, 
    author: currentUser, 
    created_at: new Date().toLocaleString() 
  });

  saveData();
  renderPosts();
  document.getElementById("post-title").value = "";
  document.getElementById("post-content").value = "";
}

function deletePost(id) {
  posts = posts.filter(p => p.id !== id);
  saveData();
  renderPosts();
}

function viewProfile(username) {
  const profileSection = document.getElementById("profile-section");
  const profileUser = document.getElementById("profile-user");
  const profilePosts = document.getElementById("profile-posts");

  profileUser.textContent = username;
  profilePosts.innerHTML = "";

  posts.filter(p => p.author === username).forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <h4>${post.title}</h4>
      <p>${post.content}</p>
      <small>${post.created_at}</small>
    `;
    profilePosts.appendChild(div);
  });

  profileSection.style.display = "block";
}

function closeProfile() {
  document.getElementById("profile-section").style.display = "none";
}

function renderPosts() {
  const postList = document.getElementById("post-list");
  postList.innerHTML = "";

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <h4>${post.title}</h4>
      <p>${post.content}</p>
      <small>By <a href="#" onclick="viewProfile('${post.author}')">${post.author}</a> at ${post.created_at}</small>
      ${post.author === currentUser ? `<button onclick="deletePost(${post.id})">Delete</button>` : ""}
    `;
    postList.appendChild(div);
  });
}

function showDashboard() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("currentUser").textContent = currentUser;
  renderPosts();
}

// Auto-login if session exists
if (currentUser) {
  showDashboard();
}
