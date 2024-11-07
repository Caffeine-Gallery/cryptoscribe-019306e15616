import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Quill editor
  const quill = new Quill('#editor', {
    theme: 'snow'
  });

  // Elements
  const postsContainer = document.getElementById('posts');
  const newPostBtn = document.getElementById('new-post-btn');
  const postForm = document.getElementById('post-form');
  const submitPostBtn = document.getElementById('submit-post-btn');

  // Show/Hide post form
  newPostBtn.addEventListener('click', () => {
    postForm.style.display = postForm.style.display === 'none' ? 'block' : 'none';
  });

  // Load and display posts
  async function loadPosts() {
    // Add loading spinner
    postsContainer.innerHTML = '<p>Loading posts...</p>';
    try {
      let posts = await backend.getPosts();
      // Display posts in reverse order (most recent first)
      posts = posts.reverse();
      postsContainer.innerHTML = '';
      for (const post of posts) {
        const postElement = document.createElement('div');
        postElement.classList.add('post', 'mb-5');
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <h5 class="text-muted">by ${post.author} on ${new Date(Number(post.timestamp) / 1000000).toLocaleString()}</h5>
          <div>${post.body}</div>
          <hr>
        `;
        postsContainer.appendChild(postElement);
      }
    } catch (error) {
      console.error(error);
      postsContainer.innerHTML = '<p>Error loading posts.</p>';
    }
  }

  // Handle post submission
  submitPostBtn.addEventListener('click', async () => {
    const titleInput = document.getElementById('post-title');
    const authorInput = document.getElementById('post-author');
    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const body = quill.root.innerHTML;

    if (!title || !author || !body) {
      alert('Please fill in all fields.');
      return;
    }

    // Add loading spinner
    submitPostBtn.disabled = true;
    submitPostBtn.textContent = 'Submitting...';

    try {
      await backend.addPost(title, body, author);
      // Reset form
      titleInput.value = '';
      authorInput.value = '';
      quill.setContents([]);
      postForm.style.display = 'none';
      // Reload posts
      await loadPosts();
    } catch (error) {
      console.error(error);
      alert('Error submitting post.');
    }

    // Remove loading spinner
    submitPostBtn.disabled = false;
    submitPostBtn.textContent = 'Submit Post';
  });

  // Initial load
  await loadPosts();
});