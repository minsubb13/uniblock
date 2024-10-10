// 전역 변수로 현재 선택된 게시글의 ID를 저장
let currentPostId = null;



// 페이지 로드 시 게시글 목록을 가져옴
document.addEventListener('DOMContentLoaded', fetchPosts);

// 게시글 목록 가져오기
function fetchPosts() {
    fetch('http://127.0.0.1:8000/post/')
        .then(response => response.json())
        .then(posts => {
            const postList = document.getElementById('postList');
            postList.innerHTML = '<h2>게시글 목록</h2>';
            posts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content.substring(0, 100)}...</p>
                    <button onclick="showPostDetail(${post.pk})">자세히 보기</button>
                `;
                postList.appendChild(postDiv);
            });
        })
        .catch(error => console.error('Error:', error));
}

// 새 게시글 작성
function createPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    let token = localStorage.getItem('token');

    // FormData 객체 생성
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    fetch('http://127.0.0.1:8000/post/', {
        method: 'POST',
        headers: {
            'Authorization' : `Token ${token}`,
        },
        // body: JSON.stringify({ title, content }),
        body : formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        fetchPosts();  // 목록 새로고침
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
    })
    .catch(error => console.error('Error:', error));
}

// 게시글 상세 보기
function showPostDetail(postId) {
    currentPostId = postId;
    fetch(`http://127.0.0.1:8000/post/${postId}/`)
        .then(response => response.json())
        .then(post => {
            document.getElementById('detailTitle').textContent = post.title;
            document.getElementById('detailContent').textContent = post.content;
            document.getElementById('postList').style.display = 'none';
            document.getElementById('postForm').style.display = 'none';
            document.getElementById('postDetail').style.display = 'block';
            fetchVoteResult();
        })
        .catch(error => console.error('Error:', error));
}

// 투표하기
function vote(choice) {
    let token = localStorage.getItem('token');

    // FormData 객체 생성
    const formData = new FormData();
    formData.append('choice', choice);

    fetch(`http://127.0.0.1:8000/post/${currentPostId}/vote/`, {
        method: 'POST',
        headers: {
            'Authorization' : `Token ${token}`,
        },
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('Vote success:', data);
        fetchVoteResult();
    })
    .catch(error => console.error('Error:', error));
}

// 투표 결과 가져오기
function fetchVoteResult() {
    fetch(`http://127.0.0.1:8000/post/${currentPostId}/tally/`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('voteResult').textContent = `동의: ${data.O}, 비동의: ${data.X}`;
        })
        .catch(error => console.error('Error:', error));
}

// 게시글 목록으로 돌아가기
function showPostList() {
    document.getElementById('postList').style.display = 'block';
    document.getElementById('postForm').style.display = 'block';
    document.getElementById('postDetail').style.display = 'none';
    currentPostId = null;
}